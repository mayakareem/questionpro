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

You must respond in valid JSON format with the following structure:
{
  "marketOverview": {
    "estimatedMarketSize": "string - market size estimate with currency and year",
    "growthRate": "string - CAGR or annual growth rate",
    "maturityStage": "string - emerging/growing/mature/declining",
    "keyTrends": ["array of 3-4 key market trends"]
  },
  "industryBenchmarks": [
    {
      "metric": "string - benchmark name",
      "value": "string - typical value/range",
      "source": "string - source type (e.g., Industry Report, Analyst Estimate)",
      "relevance": "high|medium|low"
    }
  ],
  "competitorSignals": [
    {
      "category": "string - e.g., Direct Competitors, Adjacent Players, Disruptors",
      "insight": "string - what competitors are doing",
      "implication": "string - what this means for the research"
    }
  ],
  "secondarySources": [
    {
      "name": "string - source name",
      "type": "string - e.g., Industry Report, Government Data, Academic Study, Trade Association",
      "description": "string - what data is available",
      "accessNote": "string - free/paid/subscription"
    }
  ],
  "regulatoryContext": {
    "applicable": true/false,
    "considerations": ["array of regulatory/compliance factors if applicable"]
  },
  "researchGaps": ["array of 2-3 gaps that primary research should fill based on available secondary data"]
}

Be specific with numbers, percentages, and estimates where possible. If you are uncertain, provide ranges and note the confidence level. Always ground estimates in realistic industry data. Focus on the MEA (Middle East & Africa) region and GCC markets when the question seems related to that geography, otherwise use global benchmarks.

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no explanation text outside the JSON.`

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

    // Parse JSON response
    let intelligence
    try {
      // Strip any markdown code fences if present
      let jsonStr = textBlock.text.trim()
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      }
      intelligence = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('[Intelligence API] JSON parse error:', parseError)
      console.error('[Intelligence API] Raw response:', textBlock.text.substring(0, 500))
      throw new Error('Failed to parse intelligence response as JSON')
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
