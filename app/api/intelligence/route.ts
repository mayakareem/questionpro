/**
 * Market Intelligence API Route
 *
 * POST /api/intelligence
 *
 * Takes a research question and generates multi-source intelligence:
 * - Market size estimates and growth trends
 * - Industry benchmarks and KPIs
 * - Competitor landscape signals
 * - Secondary data sources available
 * - Regulatory/compliance considerations
 */

import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

interface IntelligenceRequest {
  userQuestion: string
  businessDecision?: string
}

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured.')
  }
  return new Anthropic({ apiKey })
}

const INTELLIGENCE_SYSTEM_PROMPT = `You are a senior market research analyst and competitive intelligence specialist. Given a research question or business decision, provide structured multi-source intelligence that would complement primary research.

You must respond with ONLY a JSON object. No markdown code fences, no backticks, no explanation text before or after. Just the raw JSON object starting with { and ending with }.

The JSON must follow this exact structure:

{"marketOverview":{"estimatedMarketSize":"market size with currency and year","growthRate":"CAGR or annual growth","maturityStage":"emerging or growing or mature or declining","keyTrends":["trend 1","trend 2","trend 3"]},"industryBenchmarks":[{"metric":"benchmark name","value":"typical value","source":"source type","relevance":"high"}],"competitorSignals":[{"category":"Direct Competitors","insight":"what they do","implication":"what it means"}],"secondarySources":[{"name":"source name","type":"Industry Report","description":"what data available","accessNote":"free or paid"}],"regulatoryContext":{"applicable":true,"considerations":["factor 1"]},"researchGaps":["gap 1","gap 2"]}

Rules:
- "relevance" must be exactly one of: "high", "medium", "low"
- "applicable" must be a JSON boolean (true or false, not a string)
- "maturityStage" must be one of: "emerging", "growing", "mature", "declining"
- Provide 3-5 industry benchmarks, 2-4 competitor signals, 3-5 secondary sources, and 2-3 research gaps
- Be specific with numbers and percentages where possible
- Focus on MEA/GCC markets when the question seems related to that geography, otherwise use global benchmarks
- Return ONLY the JSON object, nothing else`

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IntelligenceRequest

    if (!body.userQuestion || body.userQuestion.trim().length < 10) {
      return new Response(
        JSON.stringify({ success: false, error: 'Question too short' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const anthropic = getAnthropicClient()

    const userPrompt = `Research Question: "${body.userQuestion}"
${body.businessDecision ? `\nBusiness Decision Context: "${body.businessDecision}"` : ''}

Provide comprehensive multi-source market intelligence for this research question. Include realistic market estimates, relevant industry benchmarks, competitor activity signals, available secondary data sources, and any regulatory considerations.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      temperature: 0.5,
      system: INTELLIGENCE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    })

    // Extract text content
    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    // Parse JSON response with robust extraction
    let intelligence
    try {
      let jsonStr = textBlock.text.trim()

      // Strip markdown code fences
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '')
      }

      // If there's text before the JSON object, extract just the JSON
      const firstBrace = jsonStr.indexOf('{')
      const lastBrace = jsonStr.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1)
      }

      intelligence = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('[Intelligence API] JSON parse error:', parseError)
      console.error('[Intelligence API] Raw response (first 800 chars):', textBlock.text.substring(0, 800))

      // Last resort: try to find JSON object pattern in the text
      try {
        const jsonMatch = textBlock.text.match(/\{[\s\S]*"marketOverview"[\s\S]*\}/)
        if (jsonMatch) {
          intelligence = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON object found in response')
        }
      } catch {
        throw new Error('Failed to parse intelligence response as JSON')
      }
    }

    // Validate required fields exist
    if (!intelligence.marketOverview || !intelligence.industryBenchmarks) {
      console.error('[Intelligence API] Missing required fields in parsed response')
      throw new Error('Intelligence response missing required fields')
    }

    return new Response(
      JSON.stringify({ success: true, intelligence }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  } catch (error) {
    console.error('[Intelligence API] Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
