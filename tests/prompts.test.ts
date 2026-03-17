/**
 * Test Prompts for Evaluation
 *
 * 20 diverse test questions covering:
 * - Pricing (4)
 * - Feature Prioritization (3)
 * - Customer Experience (4)
 * - Brand Research (3)
 * - Market Research (3)
 * - Concept Testing (3)
 *
 * Each prompt includes:
 * - id: Unique identifier
 * - question: The user's research question
 * - expectedMethodologies: Expected methods (for validation)
 * - category: Type of research question
 * - industry: Business vertical
 */

export interface TestPrompt {
  id: string
  question: string
  expectedMethodologies?: string[]
  category: string
  industry?: string
}

export const testPrompts: TestPrompt[] = [
  // PRICING (4 prompts)
  {
    id: 'pricing-1',
    question: 'What should we charge for our new premium tier SaaS product?',
    expectedMethodologies: ['Pricing Research', 'Conjoint Analysis'],
    category: 'pricing',
    industry: 'saas'
  },
  {
    id: 'pricing-2',
    question: 'Are our current subscription prices competitive compared to alternatives in the market?',
    expectedMethodologies: ['Pricing Research', 'Brand Tracking'],
    category: 'pricing',
    industry: 'saas'
  },
  {
    id: 'pricing-3',
    question: 'How much would customers be willing to pay for expedited shipping?',
    expectedMethodologies: ['Pricing Research', 'MaxDiff'],
    category: 'pricing',
    industry: 'ecommerce'
  },
  {
    id: 'pricing-4',
    question: 'Should we offer a freemium tier or focus on paid-only subscriptions?',
    expectedMethodologies: ['Pricing Research', 'Concept Test'],
    category: 'pricing',
    industry: 'saas'
  },

  // FEATURE PRIORITIZATION (3 prompts)
  {
    id: 'features-1',
    question: 'Which features should we prioritize on our Q2 product roadmap?',
    expectedMethodologies: ['MaxDiff', 'Conjoint Analysis'],
    category: 'features',
    industry: 'saas'
  },
  {
    id: 'features-2',
    question: 'What do enterprise customers value most in our mobile banking app?',
    expectedMethodologies: ['MaxDiff', 'Exploratory Interviews'],
    category: 'features',
    industry: 'banking'
  },
  {
    id: 'features-3',
    question: 'Should we build dark mode or advanced analytics first?',
    expectedMethodologies: ['MaxDiff', 'Concept Test'],
    category: 'features',
    industry: 'saas'
  },

  // CUSTOMER EXPERIENCE (4 prompts)
  {
    id: 'cx-1',
    question: 'Why are customers churning from our service after the first month?',
    expectedMethodologies: ['CX Driver Analysis', 'Exploratory Interviews'],
    category: 'cx',
    industry: 'saas'
  },
  {
    id: 'cx-2',
    question: "What's causing the 75% cart abandonment rate on our checkout page?",
    expectedMethodologies: ['CX Driver Analysis', 'Exploratory Interviews'],
    category: 'cx',
    industry: 'ecommerce'
  },
  {
    id: 'cx-3',
    question: 'How satisfied are our enterprise customers compared to SMB customers?',
    expectedMethodologies: ['CX Driver Analysis', 'Brand Tracking'],
    category: 'cx',
    industry: 'saas'
  },
  {
    id: 'cx-4',
    question: 'What are the biggest pain points in our customer onboarding process?',
    expectedMethodologies: ['CX Driver Analysis', 'Exploratory Interviews'],
    category: 'cx',
    industry: 'saas'
  },

  // BRAND RESEARCH (3 prompts)
  {
    id: 'brand-1',
    question: 'How well-known is our brand compared to competitors in the UAE market?',
    expectedMethodologies: ['Brand Tracking'],
    category: 'brand',
    industry: 'general'
  },
  {
    id: 'brand-2',
    question: 'What do customers associate with our brand when they think about skincare?',
    expectedMethodologies: ['Brand Tracking', 'Exploratory Interviews'],
    category: 'brand',
    industry: 'beauty'
  },
  {
    id: 'brand-3',
    question: 'Is our rebranding campaign improving brand perception among millennials?',
    expectedMethodologies: ['Brand Tracking'],
    category: 'brand',
    industry: 'retail'
  },

  // MARKET RESEARCH (3 prompts)
  {
    id: 'market-1',
    question: 'Who is our ideal customer persona for our new telehealth platform?',
    expectedMethodologies: ['Exploratory Interviews', 'Focus Groups'],
    category: 'market',
    industry: 'healthcare'
  },
  {
    id: 'market-2',
    question: 'What market segments should we target for our new electric vehicle?',
    expectedMethodologies: ['Exploratory Interviews', 'Brand Tracking'],
    category: 'market',
    industry: 'automotive'
  },
  {
    id: 'market-3',
    question: 'Why are our Q4 sales declining in the retail banking sector?',
    expectedMethodologies: ['Exploratory Interviews', 'CX Driver Analysis'],
    category: 'market',
    industry: 'banking'
  },

  // CONCEPT TESTING (3 prompts)
  {
    id: 'concept-1',
    question: 'Will customers prefer our new minimalist packaging over the current design?',
    expectedMethodologies: ['Concept Test', 'MaxDiff'],
    category: 'concept',
    industry: 'beauty'
  },
  {
    id: 'concept-2',
    question: 'Should we launch the AI-powered search feature or wait for more development?',
    expectedMethodologies: ['Concept Test'],
    category: 'concept',
    industry: 'saas'
  },
  {
    id: 'concept-3',
    question: 'Which of three homepage redesign concepts will drive the most conversions?',
    expectedMethodologies: ['Concept Test', 'MaxDiff'],
    category: 'concept',
    industry: 'ecommerce'
  }
]

/**
 * Get test prompts by category
 */
export function getPromptsByCategory(category: string): TestPrompt[] {
  return testPrompts.filter(p => p.category === category)
}

/**
 * Get test prompts by industry
 */
export function getPromptsByIndustry(industry: string): TestPrompt[] {
  return testPrompts.filter(p => p.industry === industry)
}

/**
 * Get single test prompt by ID
 */
export function getPromptById(id: string): TestPrompt | undefined {
  return testPrompts.find(p => p.id === id)
}

/**
 * Get random test prompts
 */
export function getRandomPrompts(count: number): TestPrompt[] {
  const shuffled = [...testPrompts].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
