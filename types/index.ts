export interface ResearchPlan {
  decision: string
  objective: string
  methodologies: string[]
  rationale: string
  implementation: string
  outputs: string
  decisionSupport: string
}

export interface ResearchPlanResponse extends ResearchPlan {
  success: boolean
  originalQuestion: string
}

export interface Methodology {
  id: string
  name: string
  description: string
  use_cases: string[]
  strengths: string[]
  limitations: string[]
  typical_outputs: string[]
}

export interface QuestionProFeature {
  feature_name: string
  description: string
  how_to_use: string
}

export interface DecisionFramework {
  decision_type: string
  typical_questions: string[]
  research_objective: string
  recommended_methodologies: string[]
  rationale: string
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  sanitized: string
}
