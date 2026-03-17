/**
 * Retrieval Module
 *
 * Simple filesystem-based retrieval that loads relevant methodology files,
 * QuestionPro documentation, and examples to inject into LLM prompts.
 *
 * V1: Simple file loading from disk
 * Future: Vector database, semantic search, caching layer
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { routeQuestion, type MethodologyRoute } from './method-router'

/**
 * Retrieved context for LLM prompt
 */
export interface RetrievedContext {
  methodologies: MethodologyContent[]
  questionProWorkflows: string
  questionProCapabilities: string
  questionProOutputs: string
  examples: string[]
  metadata: {
    primaryMethods: string[]
    secondaryMethods: string[]
    routingRationale: string
    retrievedAt: Date
  }
}

export interface MethodologyContent {
  id: string
  filename: string
  content: string
  isPrimary: boolean
}

/**
 * Base paths for knowledge files
 */
const KNOWLEDGE_BASE = join(process.cwd(), 'knowledge')
const METHODS_PATH = join(KNOWLEDGE_BASE, 'methods')
const QUESTIONPRO_PATH = join(KNOWLEDGE_BASE, 'questionpro')
const EXAMPLES_PATH = join(KNOWLEDGE_BASE, 'examples')

/**
 * Load a file from disk with error handling
 */
function loadFile(filePath: string): string | null {
  try {
    if (!existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`)
      return null
    }
    return readFileSync(filePath, 'utf-8')
  } catch (error) {
    console.error(`Error loading file ${filePath}:`, error)
    return null
  }
}

/**
 * Load methodology markdown file
 */
function loadMethodology(methodologyId: string): string | null {
  const filePath = join(METHODS_PATH, `${methodologyId}.md`)
  return loadFile(filePath)
}

/**
 * Load multiple methodologies
 */
function loadMethodologies(
  methodologyIds: string[],
  isPrimary: boolean = false
): MethodologyContent[] {
  return methodologyIds
    .map(id => {
      const content = loadMethodology(id)
      return content
        ? {
            id,
            filename: `${id}.md`,
            content,
            isPrimary
          }
        : null
    })
    .filter((m): m is MethodologyContent => m !== null)
}

/**
 * Load QuestionPro workflow documentation
 */
function loadQuestionProWorkflows(): string {
  const filePath = join(QUESTIONPRO_PATH, 'workflow-map.md')
  const content = loadFile(filePath)
  return content || '# QuestionPro Workflows\n\n[Documentation not available]'
}

/**
 * Load QuestionPro capabilities documentation
 */
function loadQuestionProCapabilities(): string {
  const filePath = join(QUESTIONPRO_PATH, 'capabilities.md')
  const content = loadFile(filePath)
  return content || '# QuestionPro Capabilities\n\n[Documentation not available]'
}

/**
 * Load QuestionPro outputs documentation
 */
function loadQuestionProOutputs(): string {
  const filePath = join(QUESTIONPRO_PATH, 'outputs.md')
  const content = loadFile(filePath)
  return content || '# QuestionPro Outputs\n\n[Documentation not available]'
}

/**
 * Load example prompts and answers
 *
 * For V1, we load the full examples file. In future versions, we could:
 * - Extract only relevant examples based on question type
 * - Use semantic similarity to find best examples
 * - Load examples dynamically based on industry
 */
function loadExamples(): string[] {
  const examples: string[] = []

  // Load gold-standard answers (contains detailed examples)
  const goldStandardPath = join(EXAMPLES_PATH, 'gold-standard-answers.md')
  const goldStandard = loadFile(goldStandardPath)
  if (goldStandard) {
    examples.push(goldStandard)
  }

  // Could load more examples here in the future
  // - Industry-specific examples
  // - Similar question examples (via semantic search)

  return examples
}

/**
 * Main retrieval function
 *
 * Takes a user question, routes it to relevant methodologies,
 * and loads all necessary context for the LLM prompt.
 *
 * @param question - User's research question
 * @param options - Optional configuration
 * @returns RetrievedContext with all loaded content
 */
export async function retrieveContext(
  question: string,
  options: {
    maxPrimaryMethods?: number
    maxSecondaryMethods?: number
    includeExamples?: boolean
    includeQuestionPro?: boolean
  } = {}
): Promise<RetrievedContext> {
  const {
    maxPrimaryMethods = 2,
    maxSecondaryMethods = 2,
    includeExamples = true,
    includeQuestionPro = true
  } = options

  // Route question to methodologies
  const route = routeQuestion(question, maxPrimaryMethods, maxSecondaryMethods)

  // Load methodology content
  const primaryMethodologies = loadMethodologies(route.primary, true)
  const secondaryMethodologies = loadMethodologies(route.secondary, false)
  const allMethodologies = [...primaryMethodologies, ...secondaryMethodologies]

  // Load QuestionPro documentation
  const questionProWorkflows = includeQuestionPro
    ? loadQuestionProWorkflows()
    : ''

  const questionProCapabilities = includeQuestionPro
    ? loadQuestionProCapabilities()
    : ''

  const questionProOutputs = includeQuestionPro
    ? loadQuestionProOutputs()
    : ''

  // Load examples
  const examples = includeExamples ? loadExamples() : []

  return {
    methodologies: allMethodologies,
    questionProWorkflows,
    questionProCapabilities,
    questionProOutputs,
    examples,
    metadata: {
      primaryMethods: route.primary,
      secondaryMethods: route.secondary,
      routingRationale: route.rationale,
      retrievedAt: new Date()
    }
  }
}

/**
 * Format retrieved context for LLM prompt
 *
 * Combines all retrieved content into a structured string
 * suitable for injection into system prompt.
 *
 * @param context - Retrieved context
 * @returns Formatted string for LLM prompt
 */
export function formatContextForPrompt(context: RetrievedContext): string {
  const sections: string[] = []

  // Header
  sections.push('# RESEARCH METHODOLOGY KNOWLEDGE BASE\n')
  sections.push(`Retrieved at: ${context.metadata.retrievedAt.toISOString()}`)
  sections.push(`Routing rationale: ${context.metadata.routingRationale}\n`)

  // Primary methodologies
  if (context.methodologies.filter(m => m.isPrimary).length > 0) {
    sections.push('## PRIMARY METHODOLOGIES (Most Relevant)\n')
    context.methodologies
      .filter(m => m.isPrimary)
      .forEach(method => {
        sections.push(`### ${method.id}\n`)
        sections.push(method.content)
        sections.push('\n---\n')
      })
  }

  // Secondary methodologies
  if (context.methodologies.filter(m => !m.isPrimary).length > 0) {
    sections.push('## SECONDARY METHODOLOGIES (Consider If Appropriate)\n')
    context.methodologies
      .filter(m => !m.isPrimary)
      .forEach(method => {
        sections.push(`### ${method.id}\n`)
        sections.push(method.content)
        sections.push('\n---\n')
      })
  }

  // QuestionPro documentation
  if (context.questionProWorkflows) {
    sections.push('## QUESTIONPRO PLATFORM WORKFLOWS\n')
    sections.push(context.questionProWorkflows)
    sections.push('\n---\n')
  }

  if (context.questionProCapabilities) {
    sections.push('## QUESTIONPRO CAPABILITIES\n')
    sections.push(context.questionProCapabilities)
    sections.push('\n---\n')
  }

  if (context.questionProOutputs) {
    sections.push('## QUESTIONPRO OUTPUTS & DELIVERABLES\n')
    sections.push(context.questionProOutputs)
    sections.push('\n---\n')
  }

  // Examples (if included)
  if (context.examples.length > 0) {
    sections.push('## EXAMPLE RESEARCH PLANS\n')
    sections.push('Use these as reference for structure and quality:\n')
    context.examples.forEach((example, idx) => {
      sections.push(`### Example Set ${idx + 1}\n`)
      sections.push(example)
      sections.push('\n---\n')
    })
  }

  return sections.join('\n')
}

/**
 * Lightweight context builder (for token-limited scenarios)
 *
 * Returns only the most essential content to reduce token usage.
 * Useful when working with token limits or faster response times.
 *
 * @param question - User's research question
 * @returns Minimal context with only primary methodologies
 */
export async function retrieveLightweightContext(
  question: string
): Promise<RetrievedContext> {
  return retrieveContext(question, {
    maxPrimaryMethods: 2,
    maxSecondaryMethods: 0,
    includeExamples: false,
    includeQuestionPro: true
  })
}

/**
 * Rich context builder (for comprehensive planning)
 *
 * Returns full context with examples and secondary methods.
 * Best for complex questions or when quality > speed.
 *
 * @param question - User's research question
 * @returns Full context with all available knowledge
 */
export async function retrieveRichContext(
  question: string
): Promise<RetrievedContext> {
  return retrieveContext(question, {
    maxPrimaryMethods: 3,
    maxSecondaryMethods: 2,
    includeExamples: true,
    includeQuestionPro: true
  })
}

/**
 * Get methodology summaries (for debugging/inspection)
 *
 * Returns just the methodology IDs and metadata without full content.
 * Useful for testing routing without loading full files.
 */
export function getMethodologySummary(question: string): {
  route: MethodologyRoute
  filesFound: string[]
  filesMissing: string[]
} {
  const route = routeQuestion(question)
  const allMethods = [...route.primary, ...route.secondary]

  const filesFound: string[] = []
  const filesMissing: string[] = []

  allMethods.forEach(methodId => {
    const filePath = join(METHODS_PATH, `${methodId}.md`)
    if (existsSync(filePath)) {
      filesFound.push(methodId)
    } else {
      filesMissing.push(methodId)
    }
  })

  return {
    route,
    filesFound,
    filesMissing
  }
}

/**
 * FUTURE ENHANCEMENTS:
 *
 * 1. VECTOR DATABASE INTEGRATION
 *    - Store methodology embeddings in Pinecone/Weaviate/Chroma
 *    - Use semantic search instead of keyword matching
 *    - Example: Find methodologies similar to question embedding
 *
 * 2. CACHING LAYER
 *    - Cache retrieved context by question hash
 *    - Invalidate cache when files change
 *    - Reduce disk I/O for common questions
 *
 * 3. SMART EXAMPLE SELECTION
 *    - Embed all gold-standard examples
 *    - Retrieve only most similar examples
 *    - Reduce token usage while maintaining quality
 *
 * 4. INDUSTRY-SPECIFIC RETRIEVAL
 *    - Detect industry from question
 *    - Load industry-specific knowledge
 *    - Example: Healthcare questions load healthcare examples
 *
 * 5. PROGRESSIVE LOADING
 *    - Load primary methods first (fast response)
 *    - Stream secondary methods and examples
 *    - Better UX with partial responses
 *
 * 6. RELEVANCE SCORING
 *    - Score each retrieved document by relevance
 *    - Sort by relevance in formatted output
 *    - Allow LLM to focus on most relevant content first
 *
 * 7. DYNAMIC CHUNKING
 *    - Break large methodology files into sections
 *    - Retrieve only relevant sections
 *    - Example: Load "How to Conduct" section for implementation questions
 *
 * 8. CONTEXT COMPRESSION
 *    - Summarize less-relevant sections
 *    - Use LLM to compress verbose documentation
 *    - Fit more knowledge in same token budget
 */

/**
 * Example Usage:
 *
 * ```typescript
 * import { retrieveContext, formatContextForPrompt } from './lib/retrieval'
 *
 * // Retrieve context for user question
 * const question = "What should we charge for our new premium tier?"
 * const context = await retrieveContext(question)
 *
 * console.log(context.metadata)
 * // {
 * //   primaryMethods: ['pricing-research', 'conjoint'],
 * //   secondaryMethods: ['maxdiff'],
 * //   routingRationale: 'Question involves pricing decisions',
 * //   retrievedAt: 2024-01-15T10:30:00.000Z
 * // }
 *
 * // Format for LLM prompt
 * const formattedContext = formatContextForPrompt(context)
 *
 * // Inject into system prompt
 * const systemPrompt = `
 * You are a research methodology expert.
 *
 * ${formattedContext}
 *
 * User question: ${question}
 *
 * Provide a comprehensive research plan...
 * `
 * ```
 */
