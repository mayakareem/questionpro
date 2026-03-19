/**
 * Research Plan API Route
 *
 * POST /api/plan
 *
 * Accepts a user's research question and returns a comprehensive,
 * AI-generated research plan with methodology recommendations,
 * QuestionPro implementation guidance, and expected outputs.
 *
 * Architecture:
 * 1. Validate input
 * 2. Route to relevant methodologies
 * 3. Retrieve knowledge from files
 * 4. Build LLM prompt
 * 5. Call Anthropic Claude API
 * 6. Parse and validate response
 * 7. Return structured JSON
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { retrieveContext, formatContextForPrompt } from '@/lib/retrieval'
import { buildPrompt, estimateTokens } from '@/lib/planner'
import { validateQuery } from '@/lib/utils/validator'
import { logSearch } from '@/lib/analytics'

/**
 * Request body interface
 */
interface PlanRequest {
  userQuestion: string
  options?: {
    includeExamples?: boolean
    maxPrimaryMethods?: number
    maxSecondaryMethods?: number
  }
}

/**
 * Response interface
 */
interface PlanResponse {
  success: boolean
  plan?: {
    userQuestion: string
    businessDecision: string
    researchObjective: string
    recommendedMethods: Array<{
      name: string
      isPrimary: boolean
      rationale: string
    }>
    implementation: {
      questionProSteps: string
      sampleSize: string
      timeline: string
    }
    expectedOutputs: string
    decisionSupport: string
    assumptions: string[]
    caveats: string[]
    rawResponse?: string // Full LLM response for debugging
  }
  error?: {
    code: string
    message: string
    details?: string
  }
  metadata?: {
    methodsIncluded: string[]
    estimatedTokens: number
    processingTimeMs: number
    modelVersion: string
  }
}

/**
 * Initialize Anthropic client
 * TODO: Ensure ANTHROPIC_API_KEY is set in environment variables
 */
function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY not configured. Please set it in your .env file.'
    )
  }

  return new Anthropic({ apiKey })
}

/**
 * Parse LLM response into structured plan
 *
 * TODO: This is a simple text parser. Future enhancements:
 * - Use Claude's structured output mode (JSON schema)
 * - Add retry logic if parsing fails
 * - Use a more robust markdown parser
 * - Validate against Zod schema from lib/schemas.ts
 */
function parseLLMResponse(response: string): PlanResponse['plan'] {
  // Simple section extraction based on headers
  const sections: Record<string, string> = {}

  // Extract sections by looking for ## headers
  const headerRegex = /##\s+\d+\.\s+(.+?)\n([\s\S]*?)(?=##\s+\d+\.|$)/g
  let match

  while ((match = headerRegex.exec(response)) !== null) {
    const sectionTitle = match[1].trim()
    const sectionContent = match[2].trim()
    sections[sectionTitle] = sectionContent
  }

  // Extract methods from "RECOMMENDED METHODOLOGY" section
  const methodsSection = sections['RECOMMENDED METHODOLOGY'] || ''
  const methods: Array<{ name: string; isPrimary: boolean; rationale: string }> = []

  // Split into method blocks (each starting with - **[PRIMARY] or - **[SUPPORTING])
  const methodBlocks = methodsSection.split(/\n-\s+\*\*\[(?:PRIMARY|SUPPORTING)\]/).filter(b => b.trim())

  methodBlocks.forEach(block => {
    const lines = block.trim().split('\n')
    const firstLine = lines[0]

    // Determine if primary based on the preceding marker
    const precedingText = methodsSection.substring(0, methodsSection.indexOf(block))
    const isPrimary = precedingText.includes('[PRIMARY]') || block.toLowerCase().includes('primary')

    // Extract method name from first line (everything before first ** or -)
    let methodName = firstLine.split('**')[0].trim()
    if (!methodName) {
      methodName = firstLine.split('-')[0].trim()
    }

    // Extract rationale (look for **Rationale:** line)
    let rationale = ''
    const rationaleMatch = block.match(/\*\*Rationale:\*\*\s*(.+?)(?=\n\s*[-*]|\n\s*\*\*|$)/s)
    if (rationaleMatch) {
      rationale = rationaleMatch[1].trim()
    }

    if (methodName && methodName.length > 2) {
      methods.push({
        name: methodName,
        isPrimary,
        rationale
      })
    }
  })

  // Fallback: if no methods found with structured format, use simple parsing
  if (methods.length === 0) {
    const methodLines = methodsSection
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-*]\s*/, '').trim())

    methodLines.forEach(method => {
      methods.push({
        name: method,
        isPrimary: method.toLowerCase().includes('primary'),
        rationale: ''
      })
    })
  }

  // Extract assumptions (bullet points)
  const assumptionsSection = sections['ASSUMPTIONS'] || ''
  const assumptions = assumptionsSection
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .map(line => line.replace(/^[-*]\s*/, '').trim())
    .filter(a => a.length > 0)

  // Extract caveats (bullet points)
  const caveatsSection = sections['CAVEATS'] || ''
  const caveats = caveatsSection
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .map(line => line.replace(/^[-*]\s*/, '').trim())
    .filter(c => c.length > 0)

  return {
    userQuestion: '', // Will be filled in by caller
    businessDecision: sections["WHAT YOU'RE TRYING TO DECIDE"] || '',
    researchObjective: sections['RESEARCH OBJECTIVE'] || '',
    recommendedMethods: methods,
    implementation: {
      questionProSteps: sections['HOW TO CONDUCT IN QUESTIONPRO'] || '',
      sampleSize: extractSampleSize(sections['HOW TO CONDUCT IN QUESTIONPRO'] || ''),
      timeline: extractTimeline(sections['HOW TO CONDUCT IN QUESTIONPRO'] || '')
    },
    expectedOutputs: sections["WHAT OUTPUTS YOU'LL SEE"] || '',
    decisionSupport: sections['WHAT DECISION THESE OUTPUTS SUPPORT'] || '',
    assumptions: assumptions.length > 0 ? assumptions : ['No specific assumptions listed'],
    caveats: caveats.length > 0 ? caveats : ['No specific caveats listed'],
    rawResponse: response
  }
}

/**
 * Extract sample size recommendation from implementation text
 */
function extractSampleSize(text: string): string {
  // Look for patterns like "300-400 respondents" or "200 minimum"
  const samplePattern = /(\d+)[-–]?(\d+)?\s*(respondents?|responses?|people|participants?)/i
  const match = text.match(samplePattern)

  if (match) {
    if (match[2]) {
      return `${match[1]}-${match[2]} ${match[3]}`
    }
    return `${match[1]} ${match[3]}`
  }

  return 'Sample size not specified'
}

/**
 * Extract timeline estimate from implementation text
 */
function extractTimeline(text: string): string {
  // Look for patterns like "2-3 weeks" or "Week 1-4"
  const timelinePattern = /(\d+)[-–]?(\d+)?\s*(weeks?|days?|months?)|Week\s+(\d+)[-–]?(\d+)?/i
  const match = text.match(timelinePattern)

  if (match) {
    if (match[4]) {
      // "Week 1-4" format
      return match[5] ? `Week ${match[4]}-${match[5]}` : `Week ${match[4]}`
    }
    if (match[2]) {
      return `${match[1]}-${match[2]} ${match[3]}`
    }
    return `${match[1]} ${match[3]}`
  }

  return 'Timeline not specified'
}

/**
 * POST /api/plan
 *
 * Main handler for research plan generation
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Parse request body
    const body = (await request.json()) as PlanRequest

    // Validate input
    const validation = validateQuery(body.userQuestion)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_QUERY',
            message: 'Invalid research question',
            details: validation.errors.join(', ')
          }
        } as PlanResponse,
        { status: 400 }
      )
    }

    const question = validation.sanitized

    // Step 1: Retrieve relevant context
    console.log('[Plan API] Retrieving context for question:', question)

    const context = await retrieveContext(question, {
      maxPrimaryMethods: body.options?.maxPrimaryMethods || 2,
      maxSecondaryMethods: body.options?.maxSecondaryMethods || 2,
      includeExamples: body.options?.includeExamples ?? true,
      includeQuestionPro: true
    })

    console.log('[Plan API] Retrieved methods:', context.metadata.primaryMethods)

    // Step 2: Build prompt
    console.log('[Plan API] Building prompt...')

    const prompt = buildPrompt(question, context)

    // Check token count
    const { estimatedTokens, warning } = estimateTokens(prompt)
    if (warning) {
      console.warn('[Plan API] Token warning:', warning)
    }

    console.log('[Plan API] Estimated tokens:', estimatedTokens)

    // Step 3: Call Anthropic API
    console.log('[Plan API] Calling Anthropic API...')

    // TODO: Add error handling for API failures
    // TODO: Add retry logic with exponential backoff
    // TODO: Add rate limiting
    // TODO: Add request timeout

    const anthropic = getAnthropicClient()

    // Create a streaming response
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      temperature: 0.7,
      system: prompt.system,
      messages: [
        {
          role: 'user',
          content: prompt.user
        }
      ]
    })

    console.log('[Plan API] Streaming response from Claude')

    // Create a TransformStream to handle the streaming response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        let fullText = ''

        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const text = chunk.delta.text
              fullText += text

              // Send the incremental text to the client
              const data = JSON.stringify({ type: 'chunk', content: text })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }

          // Parse the complete response
          const plan = parseLLMResponse(fullText)
          if (!plan) {
            throw new Error('Failed to parse LLM response')
          }
          plan.userQuestion = question

          // Validate response structure
          if (!plan.businessDecision || !plan.researchObjective) {
            console.error('[Plan API] Invalid response structure:', {
              hasDecision: !!plan.businessDecision,
              hasObjective: !!plan.researchObjective
            })
            throw new Error('LLM response missing required sections')
          }

          const processingTime = Date.now() - startTime
          console.log('[Plan API] Successfully generated plan in', processingTime, 'ms')

          // Log successful search
          const methods = context.methodologies.map(m => m.id)
          logSearch({
            question,
            success: true,
            methods
          })

          // Send the complete parsed plan
          const finalData = JSON.stringify({
            type: 'complete',
            success: true,
            plan,
            metadata: {
              methodsIncluded: methods,
              estimatedTokens,
              processingTimeMs: processingTime,
              modelVersion: 'claude-sonnet-4-6'
            }
          })
          controller.enqueue(encoder.encode(`data: ${finalData}\n\n`))
          controller.close()
        } catch (error) {
          console.error('[Plan API] Streaming error:', error)

          // Log failed search
          logSearch({
            question,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown streaming error'
          })

          const errorData = JSON.stringify({
            type: 'error',
            success: false,
            error: {
              code: 'STREAMING_ERROR',
              message: 'Error during streaming',
              details: error instanceof Error ? error.message : 'Unknown error'
            }
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[Plan API] Error:', error)

    const processingTime = Date.now() - startTime

    // Handle specific error types
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ANTHROPIC_API_ERROR',
            message: 'Failed to generate research plan',
            details: error.message
          },
          metadata: {
            methodsIncluded: [],
            estimatedTokens: 0,
            processingTimeMs: processingTime,
            modelVersion: 'claude-sonnet-4-6'
          }
        } as PlanResponse,
        { status: 500 }
      )
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate research plan',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        metadata: {
          methodsIncluded: [],
          estimatedTokens: 0,
          processingTimeMs: processingTime,
          modelVersion: 'claude-sonnet-4-6'
        }
      } as PlanResponse,
      { status: 500 }
    )
  }
}

/**
 * GET /api/plan
 *
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      service: 'AI Research Guide - Plan API',
      version: '1.0.0',
      endpoints: {
        POST: '/api/plan - Generate research plan',
        GET: '/api/plan - Health check'
      }
    },
    { status: 200 }
  )
}

/**
 * FUTURE ENHANCEMENTS:
 *
 * 1. STRUCTURED OUTPUT (High Priority)
 *    - Use Claude's JSON mode with schema
 *    - Validate against ResearchPlan Zod schema
 *    - Eliminate parsing errors
 *    - Example:
 *    ```
 *    const response = await anthropic.messages.create({
 *      model: 'claude-sonnet-4-6',
 *      response_format: { type: 'json_object' },
 *      system: prompt.system + '\n\nReturn your response as valid JSON matching this schema...'
 *    })
 *    ```
 *
 * 2. RETRY LOGIC
 *    - Retry on API failures with exponential backoff
 *    - Retry on validation failures with refined prompt
 *    - Max 3 retries
 *
 * 3. CACHING
 *    - Cache responses by question hash
 *    - Use Redis or in-memory cache
 *    - Set TTL based on content freshness needs
 *    - Example: Identical questions get cached result for 1 hour
 *
 * 4. STREAMING RESPONSES
 *    - Stream LLM output to client
 *    - Show progressive results as they arrive
 *    - Better UX for slow responses
 *    - Example: Stream each section as it's generated
 *
 * 5. RATE LIMITING
 *    - Implement per-user rate limits
 *    - Prevent abuse and control costs
 *    - Use Redis or Upstash for distributed rate limiting
 *
 * 6. COST TRACKING
 *    - Log token usage per request
 *    - Track costs by user/org
 *    - Set budget alerts
 *    - Dashboard for usage analytics
 *
 * 7. A/B TESTING
 *    - Test different prompts
 *    - Test different model versions
 *    - Measure quality and cost tradeoffs
 *    - Gradually roll out winners
 *
 * 8. FEEDBACK LOOP
 *    - Allow users to rate responses
 *    - Track which responses led to action
 *    - Use feedback to improve prompts
 *    - Fine-tune on high-quality examples
 *
 * 9. MULTI-TURN CONVERSATIONS
 *    - Support follow-up questions
 *    - Maintain conversation context
 *    - Allow iterative refinement
 *    - Store conversation history
 *
 * 10. MONITORING & OBSERVABILITY
 *     - Add distributed tracing (OpenTelemetry)
 *     - Monitor latency, error rates, token usage
 *     - Alert on anomalies
 *     - Dashboards for health and performance
 */

/**
 * Example Request:
 *
 * ```bash
 * curl -X POST http://localhost:3000/api/plan \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "userQuestion": "What should we charge for our new premium tier?",
 *     "options": {
 *       "includeExamples": true,
 *       "maxPrimaryMethods": 2,
 *       "maxSecondaryMethods": 1
 *     }
 *   }'
 * ```
 *
 * Example Response:
 *
 * ```json
 * {
 *   "success": true,
 *   "plan": {
 *     "userQuestion": "What should we charge for our new premium tier?",
 *     "businessDecision": "Determining the optimal price point for a new premium product tier...",
 *     "researchObjective": "Understand customer willingness to pay and feature valuation...",
 *     "recommendedMethods": [
 *       {
 *         "name": "Conjoint Analysis",
 *         "isPrimary": true,
 *         "rationale": "..."
 *       }
 *     ],
 *     "implementation": {
 *       "questionProSteps": "1. Set up conjoint study...",
 *       "sampleSize": "400-500 respondents",
 *       "timeline": "4-6 weeks"
 *     },
 *     "expectedOutputs": "- Feature importance scores...",
 *     "decisionSupport": "These outputs enable you to...",
 *     "assumptions": ["Target audience has budget authority..."],
 *     "caveats": ["What people say they'll pay ≠ actual behavior..."]
 *   },
 *   "metadata": {
 *     "methodsIncluded": ["pricing-research", "conjoint"],
 *     "estimatedTokens": 45000,
 *     "processingTimeMs": 8500,
 *     "modelVersion": "claude-sonnet-4-6"
 *   }
 * }
 * ```
 */
