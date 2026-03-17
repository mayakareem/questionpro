/**
 * Core TypeScript types for AI Research Guide
 * Defines the complete structure of a research plan and its components
 */

/**
 * Decision categories for classification
 */
export type DecisionCategory =
  | 'pricing_optimization'
  | 'feature_prioritization'
  | 'customer_satisfaction'
  | 'customer_experience'
  | 'brand_health'
  | 'market_segmentation'
  | 'competitive_analysis'
  | 'product_launch'
  | 'message_testing'
  | 'loyalty_retention'
  | 'market_sizing'
  | 'ux_optimization'
  | 'general'

/**
 * Industry verticals
 */
export type Industry =
  | 'b2b_saas'
  | 'ecommerce'
  | 'financial_services'
  | 'healthcare'
  | 'education'
  | 'hospitality'
  | 'consumer_goods'
  | 'professional_services'
  | 'technology'
  | 'retail'
  | 'manufacturing'
  | 'other'

/**
 * Geographic regions
 */
export type Geography =
  | 'north_america'
  | 'south_america'
  | 'europe'
  | 'asia_pacific'
  | 'middle_east'
  | 'africa'
  | 'global'

/**
 * Research methodology types
 */
export type MethodologyType =
  | 'survey'
  | 'nps'
  | 'conjoint'
  | 'maxdiff'
  | 'cx_journey'
  | 'text_analytics'
  | 'ab_testing'
  | 'segmentation'
  | 'brand_tracking'
  | 'csat'
  | 'ces'

/**
 * Confidence levels for recommendations
 */
export type ConfidenceLevel = 'low' | 'medium' | 'high' | 'very_high'

/**
 * Timeline estimates
 */
export interface TimelineEstimate {
  setupDays: number
  fieldworkDays: number
  analysisDays: number
  totalDays: number
  minimumSampleSize?: number
}

/**
 * Sample plan details
 */
export interface SamplePlan {
  targetSize: number
  minimumSize: number
  idealSize: number
  samplingMethod: string
  recruitmentStrategy: string[]
  screeningCriteria?: string[]
}

/**
 * QuestionPro workflow steps
 */
export interface QuestionProWorkflow {
  steps: WorkflowStep[]
  modules: string[]
  templates?: string[]
  features: string[]
}

export interface WorkflowStep {
  stepNumber: number
  action: string
  description: string
  toolsUsed: string[]
  estimatedTime?: string
}

/**
 * Expected outputs from a methodology
 */
export interface ExpectedOutput {
  type: string
  description: string
  format: string[]
  visualization?: string
  example?: string
}

/**
 * Risk assessment for a methodology
 */
export interface Risk {
  type: 'timing' | 'cost' | 'complexity' | 'sample' | 'interpretation' | 'validity'
  level: 'low' | 'medium' | 'high'
  description: string
  mitigation: string
}

/**
 * Individual research method recommendation
 */
export interface RecommendedMethod {
  // Core identification
  name: string
  methodologyType: MethodologyType
  fitScore: number // 0-100 score indicating how well this method fits

  // Strategic context
  purpose: string
  whyThisFits: string
  whenToUse: string[]
  whenNotToUse: string[]

  // Planning details
  samplePlan: SamplePlan
  timelineEstimate: TimelineEstimate

  // QuestionPro implementation
  questionProWorkflow: QuestionProWorkflow

  // Outputs and outcomes
  expectedOutputs: ExpectedOutput[]
  decisionSupported: string

  // Risk management
  risks: Risk[]
}

/**
 * Recommended sequence for multiple methods
 */
export interface MethodSequence {
  phase: number
  methods: string[] // Method names
  rationale: string
  canRunInParallel: boolean
  dependencies?: string[] // Methods that must complete first
}

/**
 * Target audience definition
 */
export interface TargetAudience {
  primary: string
  secondary?: string[]
  size?: string
  characteristics: string[]
  segments?: string[]
}

/**
 * Research sub-objectives
 */
export interface SubObjective {
  objective: string
  keyQuestions: string[]
  successCriteria: string
}

/**
 * Assumptions made in the research plan
 */
export interface Assumption {
  category: 'business' | 'research' | 'technical' | 'audience'
  description: string
  impact: 'low' | 'medium' | 'high'
  validationNeeded: boolean
}

/**
 * Caveats and limitations
 */
export interface Caveat {
  type: 'methodology' | 'sample' | 'timing' | 'interpretation' | 'generalization'
  description: string
  severity: 'low' | 'medium' | 'high'
}

/**
 * Final deliverables
 */
export interface FinalDeliverable {
  name: string
  description: string
  format: string[]
  recipients?: string[]
  timeline?: string
}

/**
 * Next best action recommendation
 */
export interface NextBestAction {
  priority: 'immediate' | 'short_term' | 'medium_term' | 'long_term'
  action: string
  rationale: string
  dependencies?: string[]
  estimatedEffort?: string
}

/**
 * Complete research plan structure
 */
export interface ResearchPlan {
  // User input and context
  userQuestion: string
  businessDecision: string
  decisionCategory: DecisionCategory
  industry?: Industry
  geography?: Geography
  targetAudience?: TargetAudience

  // Research design
  researchObjective: string
  subObjectives?: SubObjective[]

  // Methodology recommendations
  recommendedMethods: RecommendedMethod[]
  recommendedSequence?: MethodSequence[]

  // Risk and assumptions
  assumptions: Assumption[]
  caveats: Caveat[]

  // Deliverables and next steps
  expectedFinalDeliverables: FinalDeliverable[]
  nextBestActions: NextBestAction[]

  // Confidence and metadata
  confidence: ConfidenceLevel
  generatedAt?: Date
  modelVersion?: string
}

/**
 * API response wrapper for research plan
 */
export interface ResearchPlanResponse {
  success: boolean
  plan?: ResearchPlan
  error?: {
    code: string
    message: string
    details?: string
  }
  metadata?: {
    processingTimeMs: number
    tokensUsed?: number
    modelVersion: string
  }
}

/**
 * Validation result type
 */
export interface ValidationResult<T = any> {
  valid: boolean
  data?: T
  errors?: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

/**
 * User query input
 */
export interface UserQueryInput {
  question: string
  industry?: Industry
  geography?: Geography
  context?: {
    companySize?: 'startup' | 'smb' | 'mid_market' | 'enterprise'
    urgency?: 'low' | 'medium' | 'high' | 'critical'
    budget?: 'low' | 'medium' | 'high' | 'unlimited'
    timeline?: string
  }
}

/**
 * Legacy types for backward compatibility
 */
export interface LegacyResearchPlan {
  decision: string
  objective: string
  methodologies: string[]
  rationale: string
  implementation: string
  outputs: string
  decisionSupport: string
}

export interface LegacyResearchPlanResponse extends LegacyResearchPlan {
  success: boolean
  originalQuestion: string
}
