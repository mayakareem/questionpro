/**
 * Zod validation schemas for AI Research Guide
 * Production-ready runtime validation with TypeScript type inference
 */

import { z } from 'zod'

/**
 * Enum schemas
 */
export const DecisionCategorySchema = z.enum([
  'pricing_optimization',
  'feature_prioritization',
  'customer_satisfaction',
  'customer_experience',
  'brand_health',
  'market_segmentation',
  'competitive_analysis',
  'product_launch',
  'message_testing',
  'loyalty_retention',
  'market_sizing',
  'ux_optimization',
  'general',
])

export const IndustrySchema = z.enum([
  'b2b_saas',
  'ecommerce',
  'financial_services',
  'healthcare',
  'education',
  'hospitality',
  'consumer_goods',
  'professional_services',
  'technology',
  'retail',
  'manufacturing',
  'other',
])

export const GeographySchema = z.enum([
  'north_america',
  'south_america',
  'europe',
  'asia_pacific',
  'middle_east',
  'africa',
  'global',
])

export const MethodologyTypeSchema = z.enum([
  'survey',
  'nps',
  'conjoint',
  'maxdiff',
  'cx_journey',
  'text_analytics',
  'ab_testing',
  'segmentation',
  'brand_tracking',
  'csat',
  'ces',
])

export const ConfidenceLevelSchema = z.enum(['low', 'medium', 'high', 'very_high'])

/**
 * Timeline estimate schema
 */
export const TimelineEstimateSchema = z.object({
  setupDays: z.number().int().min(0),
  fieldworkDays: z.number().int().min(0),
  analysisDays: z.number().int().min(0),
  totalDays: z.number().int().min(0),
  minimumSampleSize: z.number().int().min(1).optional(),
})

/**
 * Sample plan schema
 */
export const SamplePlanSchema = z.object({
  targetSize: z.number().int().min(1),
  minimumSize: z.number().int().min(1),
  idealSize: z.number().int().min(1),
  samplingMethod: z.string().min(1),
  recruitmentStrategy: z.array(z.string()),
  screeningCriteria: z.array(z.string()).optional(),
})

/**
 * Workflow step schema
 */
export const WorkflowStepSchema = z.object({
  stepNumber: z.number().int().min(1),
  action: z.string().min(1),
  description: z.string().min(1),
  toolsUsed: z.array(z.string()),
  estimatedTime: z.string().optional(),
})

/**
 * QuestionPro workflow schema
 */
export const QuestionProWorkflowSchema = z.object({
  steps: z.array(WorkflowStepSchema),
  modules: z.array(z.string()),
  templates: z.array(z.string()).optional(),
  features: z.array(z.string()),
})

/**
 * Expected output schema
 */
export const ExpectedOutputSchema = z.object({
  type: z.string().min(1),
  description: z.string().min(1),
  format: z.array(z.string()),
  visualization: z.string().optional(),
  example: z.string().optional(),
})

/**
 * Risk schema
 */
export const RiskSchema = z.object({
  type: z.enum(['timing', 'cost', 'complexity', 'sample', 'interpretation', 'validity']),
  level: z.enum(['low', 'medium', 'high']),
  description: z.string().min(1),
  mitigation: z.string().min(1),
})

/**
 * Recommended method schema
 */
export const RecommendedMethodSchema = z.object({
  name: z.string().min(1),
  methodologyType: MethodologyTypeSchema,
  fitScore: z.number().min(0).max(100),
  purpose: z.string().min(1),
  whyThisFits: z.string().min(1),
  whenToUse: z.array(z.string()),
  whenNotToUse: z.array(z.string()),
  samplePlan: SamplePlanSchema,
  timelineEstimate: TimelineEstimateSchema,
  questionProWorkflow: QuestionProWorkflowSchema,
  expectedOutputs: z.array(ExpectedOutputSchema),
  decisionSupported: z.string().min(1),
  risks: z.array(RiskSchema),
})

/**
 * Method sequence schema
 */
export const MethodSequenceSchema = z.object({
  phase: z.number().int().min(1),
  methods: z.array(z.string().min(1)),
  rationale: z.string().min(1),
  canRunInParallel: z.boolean(),
  dependencies: z.array(z.string()).optional(),
})

/**
 * Target audience schema
 */
export const TargetAudienceSchema = z.object({
  primary: z.string().min(1),
  secondary: z.array(z.string()).optional(),
  size: z.string().optional(),
  characteristics: z.array(z.string()),
  segments: z.array(z.string()).optional(),
})

/**
 * Sub-objective schema
 */
export const SubObjectiveSchema = z.object({
  objective: z.string().min(1),
  keyQuestions: z.array(z.string()),
  successCriteria: z.string().min(1),
})

/**
 * Assumption schema
 */
export const AssumptionSchema = z.object({
  category: z.enum(['business', 'research', 'technical', 'audience']),
  description: z.string().min(1),
  impact: z.enum(['low', 'medium', 'high']),
  validationNeeded: z.boolean(),
})

/**
 * Caveat schema
 */
export const CaveatSchema = z.object({
  type: z.enum(['methodology', 'sample', 'timing', 'interpretation', 'generalization']),
  description: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high']),
})

/**
 * Final deliverable schema
 */
export const FinalDeliverableSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  format: z.array(z.string()),
  recipients: z.array(z.string()).optional(),
  timeline: z.string().optional(),
})

/**
 * Next best action schema
 */
export const NextBestActionSchema = z.object({
  priority: z.enum(['immediate', 'short_term', 'medium_term', 'long_term']),
  action: z.string().min(1),
  rationale: z.string().min(1),
  dependencies: z.array(z.string()).optional(),
  estimatedEffort: z.string().optional(),
})

/**
 * Complete research plan schema
 */
export const ResearchPlanSchema = z.object({
  // User input and context
  userQuestion: z.string().min(10).max(500),
  businessDecision: z.string().min(1),
  decisionCategory: DecisionCategorySchema,
  industry: IndustrySchema.optional(),
  geography: GeographySchema.optional(),
  targetAudience: TargetAudienceSchema.optional(),

  // Research design
  researchObjective: z.string().min(1),
  subObjectives: z.array(SubObjectiveSchema).optional(),

  // Methodology recommendations
  recommendedMethods: z.array(RecommendedMethodSchema).min(1),
  recommendedSequence: z.array(MethodSequenceSchema).optional(),

  // Risk and assumptions
  assumptions: z.array(AssumptionSchema),
  caveats: z.array(CaveatSchema),

  // Deliverables and next steps
  expectedFinalDeliverables: z.array(FinalDeliverableSchema),
  nextBestActions: z.array(NextBestActionSchema).min(1),

  // Confidence and metadata
  confidence: ConfidenceLevelSchema,
  generatedAt: z.date().optional(),
  modelVersion: z.string().optional(),
})

/**
 * User query input schema
 */
export const UserQueryInputSchema = z.object({
  question: z.string().min(10).max(500),
  industry: IndustrySchema.optional(),
  geography: GeographySchema.optional(),
  context: z.object({
    companySize: z.enum(['startup', 'smb', 'mid_market', 'enterprise']).optional(),
    urgency: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    budget: z.enum(['low', 'medium', 'high', 'unlimited']).optional(),
    timeline: z.string().optional(),
  }).optional(),
})

/**
 * API response schema
 */
export const ResearchPlanResponseSchema = z.object({
  success: z.boolean(),
  plan: ResearchPlanSchema.optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.string().optional(),
  }).optional(),
  metadata: z.object({
    processingTimeMs: z.number(),
    tokensUsed: z.number().optional(),
    modelVersion: z.string(),
  }).optional(),
})

/**
 * Legacy schemas for backward compatibility
 */
export const LegacyResearchPlanSchema = z.object({
  decision: z.string(),
  objective: z.string(),
  methodologies: z.array(z.string()),
  rationale: z.string(),
  implementation: z.string(),
  outputs: z.string(),
  decisionSupport: z.string(),
})

export const LegacyResearchPlanResponseSchema = LegacyResearchPlanSchema.extend({
  success: z.boolean(),
  originalQuestion: z.string(),
})

/**
 * Type inference exports
 */
export type DecisionCategory = z.infer<typeof DecisionCategorySchema>
export type Industry = z.infer<typeof IndustrySchema>
export type Geography = z.infer<typeof GeographySchema>
export type MethodologyType = z.infer<typeof MethodologyTypeSchema>
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelSchema>
export type TimelineEstimate = z.infer<typeof TimelineEstimateSchema>
export type SamplePlan = z.infer<typeof SamplePlanSchema>
export type WorkflowStep = z.infer<typeof WorkflowStepSchema>
export type QuestionProWorkflow = z.infer<typeof QuestionProWorkflowSchema>
export type ExpectedOutput = z.infer<typeof ExpectedOutputSchema>
export type Risk = z.infer<typeof RiskSchema>
export type RecommendedMethod = z.infer<typeof RecommendedMethodSchema>
export type MethodSequence = z.infer<typeof MethodSequenceSchema>
export type TargetAudience = z.infer<typeof TargetAudienceSchema>
export type SubObjective = z.infer<typeof SubObjectiveSchema>
export type Assumption = z.infer<typeof AssumptionSchema>
export type Caveat = z.infer<typeof CaveatSchema>
export type FinalDeliverable = z.infer<typeof FinalDeliverableSchema>
export type NextBestAction = z.infer<typeof NextBestActionSchema>
export type ResearchPlan = z.infer<typeof ResearchPlanSchema>
export type UserQueryInput = z.infer<typeof UserQueryInputSchema>
export type ResearchPlanResponse = z.infer<typeof ResearchPlanResponseSchema>

/**
 * Validation helper functions
 */
export function validateResearchPlan(data: unknown) {
  return ResearchPlanSchema.safeParse(data)
}

export function validateUserQuery(data: unknown) {
  return UserQueryInputSchema.safeParse(data)
}

export function validateRecommendedMethod(data: unknown) {
  return RecommendedMethodSchema.safeParse(data)
}

/**
 * Partial schemas for updates
 */
export const PartialResearchPlanSchema = ResearchPlanSchema.partial()
export const PartialUserQueryInputSchema = UserQueryInputSchema.partial()
