/**
 * API Request and Response Types
 *
 * These types ensure type safety between frontend and backend
 * and match the API route definitions in app/api/plan/route.ts
 */

/**
 * Request body for POST /api/plan
 */
export interface PlanRequest {
  userQuestion: string
  options?: {
    includeExamples?: boolean
    maxPrimaryMethods?: number
    maxSecondaryMethods?: number
  }
}

/**
 * Recommended methodology
 */
export interface RecommendedMethod {
  name: string
  isPrimary: boolean
  rationale: string
}

/**
 * Implementation details for QuestionPro
 */
export interface Implementation {
  questionProSteps: string
  sampleSize: string
  timeline: string
}

/**
 * Complete research plan
 */
export interface ResearchPlan {
  userQuestion: string
  businessDecision: string
  researchObjective: string
  recommendedMethods: RecommendedMethod[]
  implementation: Implementation
  expectedOutputs: string
  decisionSupport: string
  assumptions: string[]
  caveats: string[]
  rawResponse?: string // Full LLM response for debugging
}

/**
 * API error structure
 */
export interface ApiError {
  code: string
  message: string
  details?: string
}

/**
 * Response metadata
 */
export interface ResponseMetadata {
  methodsIncluded: string[]
  estimatedTokens: number
  processingTimeMs: number
  modelVersion: string
}

/**
 * Response from POST /api/plan
 */
export interface PlanResponse {
  success: boolean
  plan?: ResearchPlan
  error?: ApiError
  metadata?: ResponseMetadata
}

/**
 * Health check response from GET /api/plan
 */
export interface HealthResponse {
  status: string
  service: string
  version: string
  endpoints: {
    POST: string
    GET: string
  }
}
