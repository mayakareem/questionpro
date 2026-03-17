/**
 * Evaluation Runner for AI Research Guide
 *
 * Runs test prompts through the system and evaluates:
 * - Business decision inference quality
 * - Methodology selection appropriateness
 * - Rationale clarity
 * - QuestionPro workflow practicality
 * - Output clarity and usefulness
 *
 * Usage:
 *   npx tsx scripts/eval-runner.ts
 *   npx tsx scripts/eval-runner.ts --prompt "Your test question"
 *   npx tsx scripts/eval-runner.ts --file tests/prompts.test.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import Anthropic from '@anthropic-ai/sdk'
import { retrieveContext } from '../lib/retrieval'
import { buildPrompt } from '../lib/planner'
import { validateQuery } from '../lib/utils/validator'

// Evaluation criteria
interface EvaluationCriteria {
  businessDecisionQuality: number // 1-5: How well did it understand the business decision?
  methodologyRelevance: number // 1-5: Are the recommended methodologies appropriate?
  rationaleClarity: number // 1-5: Is the "why this fits" explanation clear?
  questionProWorkflowPracticality: number // 1-5: Is the QuestionPro workflow realistic?
  outputClarity: number // 1-5: Are expected outputs practical and clear?
  overallScore: number // 1-5: Overall quality
  notes: string // Evaluator notes
}

interface TestPrompt {
  id: string
  question: string
  expectedMethodologies?: string[] // Optional: for validation
  category?: string // e.g., "pricing", "cx", "features"
  industry?: string // e.g., "saas", "retail", "banking"
}

interface EvaluationResult {
  prompt: TestPrompt
  response: {
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
  }
  evaluation: EvaluationCriteria
  metadata: {
    methodsIncluded: string[]
    processingTimeMs: number
    timestamp: string
  }
}

interface EvaluationSummary {
  totalTests: number
  averageScores: {
    businessDecisionQuality: number
    methodologyRelevance: number
    rationaleClarity: number
    questionProWorkflowPracticality: number
    outputClarity: number
    overallScore: number
  }
  passRate: number // Percentage with overall score >= 3
  results: EvaluationResult[]
  timestamp: string
}

/**
 * Parse LLM response into structured plan
 */
function parseLLMResponse(response: string): EvaluationResult['response'] {
  const sections: Record<string, string> = {}

  // Extract sections by looking for ## headers
  const headerRegex = /##\s+\d+\.\s+(.+?)\n([\s\S]*?)(?=##\s+\d+\.|$)/g
  let match

  while ((match = headerRegex.exec(response)) !== null) {
    const sectionTitle = match[1].trim()
    const sectionContent = match[2].trim()
    sections[sectionTitle] = sectionContent
  }

  // Extract methods
  const methodsSection = sections['RECOMMENDED METHODOLOGY'] || ''
  const methodLines = methodsSection
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .map(line => line.replace(/^[-*]\s*/, '').trim())

  const methods = methodLines.map(method => ({
    name: method,
    isPrimary: method.toLowerCase().includes('primary'),
    rationale: ''
  }))

  // Extract assumptions
  const assumptionsSection = sections['ASSUMPTIONS'] || ''
  const assumptions = assumptionsSection
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .map(line => line.replace(/^[-*]\s*/, '').trim())
    .filter(a => a.length > 0)

  // Extract caveats
  const caveatsSection = sections['CAVEATS'] || ''
  const caveats = caveatsSection
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .map(line => line.replace(/^[-*]\s*/, '').trim())
    .filter(c => c.length > 0)

  // Extract sample size and timeline
  const implementationText = sections['HOW TO CONDUCT IN QUESTIONPRO'] || ''
  const samplePattern = /(\d+)[-–]?(\d+)?\s*(respondents?|responses?|people|participants?)/i
  const sampleMatch = implementationText.match(samplePattern)
  let sampleSize = 'Not specified'
  if (sampleMatch) {
    sampleSize = sampleMatch[2]
      ? `${sampleMatch[1]}-${sampleMatch[2]} ${sampleMatch[3]}`
      : `${sampleMatch[1]} ${sampleMatch[3]}`
  }

  const timelinePattern = /(\d+)[-–]?(\d+)?\s*(weeks?|days?|months?)/i
  const timelineMatch = implementationText.match(timelinePattern)
  let timeline = 'Not specified'
  if (timelineMatch) {
    timeline = timelineMatch[2]
      ? `${timelineMatch[1]}-${timelineMatch[2]} ${timelineMatch[3]}`
      : `${timelineMatch[1]} ${timelineMatch[3]}`
  }

  return {
    userQuestion: '',
    businessDecision: sections["WHAT YOU'RE TRYING TO DECIDE"] || '',
    researchObjective: sections['RESEARCH OBJECTIVE'] || '',
    recommendedMethods: methods,
    implementation: {
      questionProSteps: implementationText,
      sampleSize,
      timeline
    },
    expectedOutputs: sections["WHAT OUTPUTS YOU'LL SEE"] || '',
    decisionSupport: sections['WHAT DECISION THESE OUTPUTS SUPPORT'] || '',
    assumptions: assumptions.length > 0 ? assumptions : ['No specific assumptions listed'],
    caveats: caveats.length > 0 ? caveats : ['No specific caveats listed']
  }
}

/**
 * Evaluate a single response using LLM-as-judge
 */
async function evaluateResponse(
  prompt: TestPrompt,
  response: EvaluationResult['response'],
  anthropic: Anthropic
): Promise<EvaluationCriteria> {
  const evaluationPrompt = `You are an expert evaluator for research methodology recommendations.

Evaluate this AI-generated research plan on 5 criteria (score 1-5 for each):

USER QUESTION:
"${prompt.question}"

GENERATED PLAN:
Business Decision: ${response.businessDecision}
Research Objective: ${response.researchObjective}
Recommended Methods: ${response.recommendedMethods.map(m => m.name).join(', ')}
QuestionPro Workflow: ${response.implementation.questionProSteps.substring(0, 300)}...
Expected Outputs: ${response.expectedOutputs.substring(0, 200)}...

EVALUATION CRITERIA (score each 1-5):

1. Business Decision Quality (1-5)
   - Did it correctly understand what the user is trying to decide?
   - Is it specific and actionable?
   Score:

2. Methodology Relevance (1-5)
   - Are the recommended methods appropriate for this question?
   - Would a real researcher recommend these?
   Score:

3. Rationale Clarity (1-5)
   - Is the "why this fits" explanation clear and convincing?
   - Does it explain the connection between question and method?
   Score:

4. QuestionPro Workflow Practicality (1-5)
   - Are the implementation steps realistic and specific?
   - Would someone be able to follow these steps?
   Score:

5. Output Clarity (1-5)
   - Are the expected outputs practical and well-defined?
   - Would the outputs actually help make the decision?
   Score:

6. Overall Score (1-5)
   - Overall quality and usefulness
   Score:

Respond in this exact format:
BUSINESS_DECISION: [score]
METHODOLOGY: [score]
RATIONALE: [score]
WORKFLOW: [score]
OUTPUT: [score]
OVERALL: [score]
NOTES: [brief notes on strengths and weaknesses]`

  try {
    const evaluation = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      temperature: 0.3,
      messages: [{ role: 'user', content: evaluationPrompt }]
    })

    const content = evaluation.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const evalText = content.text

    // Parse scores
    const businessDecision = parseFloat(evalText.match(/BUSINESS_DECISION:\s*(\d+)/)?.[1] || '3')
    const methodology = parseFloat(evalText.match(/METHODOLOGY:\s*(\d+)/)?.[1] || '3')
    const rationale = parseFloat(evalText.match(/RATIONALE:\s*(\d+)/)?.[1] || '3')
    const workflow = parseFloat(evalText.match(/WORKFLOW:\s*(\d+)/)?.[1] || '3')
    const output = parseFloat(evalText.match(/OUTPUT:\s*(\d+)/)?.[1] || '3')
    const overall = parseFloat(evalText.match(/OVERALL:\s*(\d+)/)?.[1] || '3')
    const notes = evalText.match(/NOTES:\s*(.+)/s)?.[1]?.trim() || 'No notes provided'

    return {
      businessDecisionQuality: businessDecision,
      methodologyRelevance: methodology,
      rationaleClarity: rationale,
      questionProWorkflowPracticality: workflow,
      outputClarity: output,
      overallScore: overall,
      notes
    }
  } catch (error) {
    console.error('Error in LLM evaluation:', error)
    // Fallback: manual scoring needed
    return {
      businessDecisionQuality: 3,
      methodologyRelevance: 3,
      rationaleClarity: 3,
      questionProWorkflowPracticality: 3,
      outputClarity: 3,
      overallScore: 3,
      notes: `Evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Run a single test prompt
 */
async function runTest(
  prompt: TestPrompt,
  anthropic: Anthropic
): Promise<EvaluationResult> {
  const startTime = Date.now()

  console.log(`\n📝 Testing: "${prompt.question}"`)

  // Validate input
  const validation = validateQuery(prompt.question)
  if (!validation.valid) {
    throw new Error(`Invalid question: ${validation.errors.join(', ')}`)
  }

  const question = validation.sanitized

  // Retrieve context
  console.log('  ⏳ Retrieving context...')
  const context = await retrieveContext(question, {
    maxPrimaryMethods: 2,
    maxSecondaryMethods: 2,
    includeExamples: true,
    includeQuestionPro: true
  })

  // Build prompt
  const promptData = buildPrompt(question, context)

  // Call Claude
  console.log('  ⏳ Calling Claude API...')
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    temperature: 0.7,
    system: promptData.system,
    messages: [{ role: 'user', content: promptData.user }]
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  // Parse response
  const plan = parseLLMResponse(content.text)
  plan.userQuestion = question

  // Evaluate response
  console.log('  ⏳ Evaluating response...')
  const evaluation = await evaluateResponse(prompt, plan, anthropic)

  const processingTime = Date.now() - startTime

  console.log(`  ✅ Complete in ${processingTime}ms`)
  console.log(`  📊 Overall Score: ${evaluation.overallScore}/5`)

  return {
    prompt,
    response: plan,
    evaluation,
    metadata: {
      methodsIncluded: context.methodologies.map(m => m.id),
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Run evaluation suite
 */
async function runEvaluation(prompts: TestPrompt[]): Promise<EvaluationSummary> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set in environment')
  }

  const anthropic = new Anthropic({ apiKey })

  console.log(`\n🧪 Running Evaluation Suite`)
  console.log(`📊 Total Test Prompts: ${prompts.length}`)
  console.log(`⏰ Started: ${new Date().toISOString()}\n`)

  const results: EvaluationResult[] = []

  for (const prompt of prompts) {
    try {
      const result = await runTest(prompt, anthropic)
      results.push(result)
    } catch (error) {
      console.error(`❌ Error testing "${prompt.question}":`, error)
      // Continue with other tests
    }
  }

  // Calculate summary statistics
  const totalTests = results.length
  const scores = {
    businessDecisionQuality: 0,
    methodologyRelevance: 0,
    rationaleClarity: 0,
    questionProWorkflowPracticality: 0,
    outputClarity: 0,
    overallScore: 0
  }

  results.forEach(result => {
    scores.businessDecisionQuality += result.evaluation.businessDecisionQuality
    scores.methodologyRelevance += result.evaluation.methodologyRelevance
    scores.rationaleClarity += result.evaluation.rationaleClarity
    scores.questionProWorkflowPracticality += result.evaluation.questionProWorkflowPracticality
    scores.outputClarity += result.evaluation.outputClarity
    scores.overallScore += result.evaluation.overallScore
  })

  const averageScores = {
    businessDecisionQuality: scores.businessDecisionQuality / totalTests,
    methodologyRelevance: scores.methodologyRelevance / totalTests,
    rationaleClarity: scores.rationaleClarity / totalTests,
    questionProWorkflowPracticality: scores.questionProWorkflowPracticality / totalTests,
    outputClarity: scores.outputClarity / totalTests,
    overallScore: scores.overallScore / totalTests
  }

  const passCount = results.filter(r => r.evaluation.overallScore >= 3).length
  const passRate = (passCount / totalTests) * 100

  const summary: EvaluationSummary = {
    totalTests,
    averageScores,
    passRate,
    results,
    timestamp: new Date().toISOString()
  }

  return summary
}

/**
 * Save evaluation results to JSON
 */
function saveResults(summary: EvaluationSummary, outputPath: string): void {
  const dir = path.dirname(outputPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2))
  console.log(`\n💾 Results saved to: ${outputPath}`)
}

/**
 * Print summary to console
 */
function printSummary(summary: EvaluationSummary): void {
  console.log('\n' + '='.repeat(60))
  console.log('📊 EVALUATION SUMMARY')
  console.log('='.repeat(60))
  console.log(`\nTotal Tests: ${summary.totalTests}`)
  console.log(`Pass Rate: ${summary.passRate.toFixed(1)}% (≥3/5)`)
  console.log('\nAverage Scores (out of 5):')
  console.log(`  Business Decision Quality: ${summary.averageScores.businessDecisionQuality.toFixed(2)}`)
  console.log(`  Methodology Relevance:     ${summary.averageScores.methodologyRelevance.toFixed(2)}`)
  console.log(`  Rationale Clarity:         ${summary.averageScores.rationaleClarity.toFixed(2)}`)
  console.log(`  QuestionPro Workflow:      ${summary.averageScores.questionProWorkflowPracticality.toFixed(2)}`)
  console.log(`  Output Clarity:            ${summary.averageScores.outputClarity.toFixed(2)}`)
  console.log(`  Overall Score:             ${summary.averageScores.overallScore.toFixed(2)}`)

  console.log('\n' + '='.repeat(60))
  console.log('📝 Individual Results:')
  console.log('='.repeat(60))

  summary.results.forEach((result, idx) => {
    const score = result.evaluation.overallScore
    const emoji = score >= 4 ? '🟢' : score >= 3 ? '🟡' : '🔴'
    console.log(`\n${idx + 1}. ${emoji} ${result.prompt.question}`)
    console.log(`   Score: ${score}/5 | Methods: ${result.response.recommendedMethods.map(m => m.name).join(', ')}`)
    console.log(`   Notes: ${result.evaluation.notes.substring(0, 100)}...`)
  })

  console.log('\n' + '='.repeat(60))
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2)

  // Load test prompts
  let prompts: TestPrompt[]

  if (args.includes('--file')) {
    const fileIdx = args.indexOf('--file')
    const filePath = args[fileIdx + 1]
    const { testPrompts } = await import(path.resolve(filePath))
    prompts = testPrompts
  } else if (args.includes('--prompt')) {
    const promptIdx = args.indexOf('--prompt')
    const question = args[promptIdx + 1]
    prompts = [{ id: 'cli-1', question, category: 'manual' }]
  } else {
    // Load default test prompts
    const { testPrompts } = await import('../tests/prompts.test')
    prompts = testPrompts
  }

  // Run evaluation
  const summary = await runEvaluation(prompts)

  // Print summary
  printSummary(summary)

  // Save results
  const outputPath = path.join(process.cwd(), 'tests/results', `eval-${Date.now()}.json`)
  saveResults(summary, outputPath)

  console.log('\n✅ Evaluation complete!\n')
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

export { runEvaluation, runTest }
export type { EvaluationResult, EvaluationSummary, TestPrompt }
