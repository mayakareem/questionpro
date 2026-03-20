/**
 * Method Router
 *
 * Simple rule-based router that maps user questions to relevant methodology files
 * based on keywords and intent patterns.
 *
 * This is a lightweight pre-LLM filter to help the AI focus on the most relevant
 * methodologies. It doesn't make the final decision—the LLM does—but it narrows
 * the context to improve response quality and reduce token usage.
 *
 * FUTURE IMPROVEMENTS:
 * - Add semantic similarity matching (embeddings) for better intent detection
 * - Use ML classifier trained on question-methodology pairs
 * - Add industry-specific routing (e.g., healthcare questions route differently)
 * - Implement confidence scores for each methodology match
 * - Add question complexity analysis (simple vs complex routing)
 * - Cache common question patterns for faster routing
 * - Add telemetry to track which routes perform best
 */

export interface MethodologyRoute {
  primary: string[]      // Primary methodologies that best fit
  secondary: string[]    // Supporting methodologies to consider
  rationale: string      // Why these methods were selected
  metadata?: {
    totalMethodologies: number
    keywordMatches: [string, number][]
    intentMatches: [string, number][]
    context?: ContextSignals  // Business context detected from question
  }
}

export interface KeywordPattern {
  keywords: string[]
  methodologies: string[]
  weight: 'primary' | 'secondary'
}

/**
 * Keyword patterns mapped to methodologies
 * Each pattern includes keywords to match and which methodology files to include
 */
const KEYWORD_PATTERNS: Record<string, KeywordPattern[]> = {
  // Pricing-related patterns
  pricing: [
    {
      keywords: [
        'price', 'pricing', 'charge', 'cost', 'fee', 'subscription',
        'tier', 'plan', 'expensive', 'cheap', 'affordable', 'revenue',
        'monetize', 'monetization', 'willingness to pay', 'wtp'
      ],
      methodologies: ['pricing-research', 'conjoint'],
      weight: 'primary'
    },
    {
      keywords: ['price', 'feature', 'bundle', 'package', 'configuration'],
      methodologies: ['conjoint', 'maxdiff'],
      weight: 'primary'
    }
  ],

  // Feature and product prioritization
  features: [
    {
      keywords: [
        'feature', 'prioritize', 'priority', 'roadmap', 'backlog',
        'build', 'develop', 'capability', 'functionality', 'which features',
        'what features', 'feature set'
      ],
      methodologies: ['maxdiff', 'conjoint'],
      weight: 'primary'
    },
    {
      keywords: ['feature', 'customer', 'need', 'want', 'request'],
      methodologies: ['exploratory-interviews', 'maxdiff'],
      weight: 'primary'
    }
  ],

  // Concept testing and product launch
  concepts: [
    {
      keywords: [
        'concept', 'idea', 'prototype', 'mockup', 'test',
        'which should we launch', 'which product', 'which version',
        'concept test', 'validate', 'validation'
      ],
      methodologies: ['concept-test'],
      weight: 'primary'
    },
    {
      keywords: ['launch', 'new product', 'introduce', 'release', 'go-to-market'],
      methodologies: ['concept-test', 'exploratory-interviews'],
      weight: 'primary'
    },
    {
      keywords: ['messaging', 'message', 'creative', 'campaign', 'positioning'],
      methodologies: ['concept-test', 'focus-groups'],
      weight: 'primary'
    }
  ],

  // Brand and perception
  brand: [
    {
      keywords: [
        'brand', 'awareness', 'perception', 'image', 'reputation',
        'known for', 'associate', 'brand health', 'brand equity',
        'brand tracking', 'brand perception'
      ],
      methodologies: ['brand-tracking'],
      weight: 'primary'
    },
    {
      keywords: ['brand', 'competitor', 'compare', 'versus', 'vs'],
      methodologies: ['brand-tracking', 'exploratory-interviews'],
      weight: 'primary'
    }
  ],

  // Customer experience and journey
  experience: [
    {
      keywords: [
        'experience', 'journey', 'touchpoint', 'friction', 'pain point',
        'struggle', 'difficult', 'frustrating', 'onboarding', 'effort',
        'ease', 'hard', 'easy', 'cx', 'customer experience'
      ],
      methodologies: ['cx-driver-analysis', 'exploratory-interviews'],
      weight: 'primary'
    },
    {
      keywords: ['nps', 'net promoter', 'loyalty', 'recommend', 'promoter', 'detractor'],
      methodologies: ['nps', 'cx-driver-analysis'],
      weight: 'primary'
    },
    {
      keywords: ['satisfaction', 'satisfied', 'csat', 'happy', 'unhappy', 'dissatisfied'],
      methodologies: ['csat', 'cx-driver-analysis'],
      weight: 'primary'
    },
    {
      keywords: ['ces', 'customer effort', 'effort score', 'how easy', 'how hard', 'friction', 'ease of use'],
      methodologies: ['ces', 'cx-driver-analysis'],
      weight: 'primary'
    }
  ],

  // Churn and retention
  churn: [
    {
      keywords: [
        'churn', 'churning', 'leaving', 'cancel', 'canceling', 'cancelling',
        'retention', 'retain', 'attrition', 'why did', 'why are',
        'switch', 'switching', 'defect'
      ],
      methodologies: ['exploratory-interviews', 'cx-driver-analysis'],
      weight: 'primary'
    }
  ],

  // Competitive analysis
  competitive: [
    {
      keywords: [
        'competitor', 'competition', 'competitive', 'versus', 'vs',
        'compare', 'comparison', 'alternative', 'why choose',
        'why do customers choose', 'instead of us'
      ],
      methodologies: ['exploratory-interviews', 'brand-tracking'],
      weight: 'primary'
    }
  ],

  // Qualitative exploration
  qualitative: [
    {
      keywords: [
        'why', 'understand', 'explore', 'discover', 'learn about',
        'tell me about', 'what do customers think', 'feedback',
        'in their own words'
      ],
      methodologies: ['exploratory-interviews', 'focus-groups'],
      weight: 'secondary'
    }
  ],

  // Product testing and validation
  productValidation: [
    {
      keywords: [
        'test', 'testing', 'validate', 'validation', 'ready', 'readiness',
        'market fit', 'product-market fit', 'pmf', 'launch ready',
        'launch readiness', 'go-to-market', 'gtm', 'viability'
      ],
      methodologies: ['concept-test', 'exploratory-interviews'],
      weight: 'primary'
    },
    {
      keywords: ['test', 'product', 'feature', 'prototype', 'beta'],
      methodologies: ['concept-test'],
      weight: 'primary'
    }
  ],

  // Observational / service quality
  observational: [
    {
      keywords: [
        'branches', 'stores', 'locations', 'service quality', 'frontline',
        'compliance', 'standards', 'mystery shop', 'secret shopper',
        'service audit', 'branch performance', 'store execution'
      ],
      methodologies: ['mystery-shopping'],
      weight: 'primary'
    },
    {
      keywords: ['nps', 'low', 'satisfaction', 'dropping', 'locations', 'branches'],
      methodologies: ['mystery-shopping', 'cx-driver-analysis'],
      weight: 'primary'
    }
  ],

  // Segmentation and targeting
  segmentation: [
    {
      keywords: [
        'segment', 'segmentation', 'target', 'targeting', 'who',
        'customer groups', 'personas', 'audience', 'market structure',
        'who should we focus', 'which customers'
      ],
      methodologies: ['segmentation', 'exploratory-interviews'],
      weight: 'primary'
    },
    {
      keywords: ['diverse', 'different types', 'various', 'prioritize'],
      methodologies: ['segmentation'],
      weight: 'secondary'
    }
  ],

  // A/B testing and experimentation
  experimentation: [
    {
      keywords: [
        'a/b test', 'ab test', 'split test', 'experiment', 'compare',
        'which version', 'which performs better', 'convert', 'conversion',
        'optimize', 'variant', 'control group', 'treatment'
      ],
      methodologies: ['ab-testing', 'concept-test'],
      weight: 'primary'
    },
    {
      keywords: ['test', 'which email', 'which message', 'which headline', 'which subject line'],
      methodologies: ['ab-testing'],
      weight: 'primary'
    }
  ],

  // NPS and loyalty measurement
  loyalty: [
    {
      keywords: [
        'nps', 'net promoter', 'loyalty', 'recommend', 'promoter',
        'detractor', 'passive', 'advocacy', 'referral', 'word of mouth'
      ],
      methodologies: ['nps', 'cx-driver-analysis'],
      weight: 'primary'
    },
    {
      keywords: ['benchmark', 'loyalty score', 'track loyalty', 'measure loyalty'],
      methodologies: ['nps', 'brand-tracking'],
      weight: 'primary'
    }
  ],

  // Satisfaction measurement
  satisfaction: [
    {
      keywords: [
        'satisfaction', 'satisfied', 'csat', 'happy', 'unhappy',
        'rate', 'rating', 'service quality', 'quality score',
        'post-purchase', 'after purchase', 'feedback score'
      ],
      methodologies: ['csat', 'cx-driver-analysis'],
      weight: 'primary'
    }
  ],

  // Customer effort
  effort: [
    {
      keywords: [
        'effort', 'effort score', 'ces', 'easy', 'difficult', 'friction',
        'seamless', 'smooth', 'frustrating', 'tedious', 'complicated',
        'self-service', 'support effort', 'resolution'
      ],
      methodologies: ['ces', 'cx-driver-analysis', 'mystery-shopping'],
      weight: 'primary'
    }
  ]
}

/**
 * Industry-specific patterns
 * Routes questions based on industry context to appropriate methodologies
 */
interface IndustryPattern {
  keywords: string[]
  methodologies: string[]
  weight: 'primary' | 'secondary'
  industry: string
}

const INDUSTRY_PATTERNS: IndustryPattern[] = [
  // Banking
  {
    keywords: ['bank', 'banking', 'financial', 'wealth', 'account', 'loan', 'credit', 'branch'],
    methodologies: ['brand-tracking', 'mystery-shopping', 'segmentation', 'exploratory-interviews'],
    weight: 'secondary',
    industry: 'banking'
  },
  // Telecom
  {
    keywords: ['telecom', 'mobile', 'plan', 'carrier', 'network', 'data', 'prepaid', 'postpaid'],
    methodologies: ['conjoint', 'brand-tracking', 'mystery-shopping'],
    weight: 'secondary',
    industry: 'telecom'
  },
  // Retail
  {
    keywords: ['retail', 'store', 'shop', 'mall', 'qsr', 'restaurant', 'outlet'],
    methodologies: ['mystery-shopping', 'concept-test', 'cx-driver-analysis'],
    weight: 'secondary',
    industry: 'retail'
  },
  // Hospitality
  {
    keywords: ['hotel', 'hospitality', 'resort', 'guest', 'booking', 'travel', 'tourism'],
    methodologies: ['mystery-shopping', 'maxdiff', 'cx-driver-analysis', 'concept-test'],
    weight: 'secondary',
    industry: 'hospitality'
  },
  // SaaS / Technology
  {
    keywords: ['saas', 'software', 'app', 'digital', 'platform', 'subscription', 'tech'],
    methodologies: ['concept-test', 'maxdiff', 'pricing-research', 'exploratory-interviews'],
    weight: 'secondary',
    industry: 'saas'
  }
]

/**
 * Question intent patterns
 * More sophisticated matching based on question structure and intent
 */
interface IntentPattern {
  pattern: RegExp
  methodologies: string[]
  weight: 'primary' | 'secondary'
  description: string
}

const INTENT_PATTERNS: IntentPattern[] = [
  // "Which X should we Y" questions
  {
    pattern: /which\s+(?:of\s+these|product|feature|concept|idea|option)/i,
    methodologies: ['concept-test', 'maxdiff'],
    weight: 'primary',
    description: 'Selection/prioritization question'
  },

  // "What should we charge/price" questions
  {
    pattern: /what\s+(?:should|can|could)\s+we\s+(?:charge|price)/i,
    methodologies: ['pricing-research', 'conjoint'],
    weight: 'primary',
    description: 'Pricing decision question'
  },

  // "Why are customers" questions - exploration
  {
    pattern: /why\s+(?:are|do|did|is|don't|aren't)\s+(?:customers|users|people|they)/i,
    methodologies: ['exploratory-interviews', 'cx-driver-analysis'],
    weight: 'primary',
    description: 'Causal/explanatory question'
  },

  // "We don't know why" - classic exploration trigger
  {
    pattern: /(?:don't|do not|unsure|uncertain|unclear)\s+(?:know|understand)\s+why/i,
    methodologies: ['exploratory-interviews', 'focus-groups'],
    weight: 'primary',
    description: 'Unknown causation - needs exploration'
  },

  // Problem statements - low/falling/dropping metrics
  {
    pattern: /(?:low|falling|dropping|declining|decreasing|poor|weak)\s+(?:nps|satisfaction|scores|performance|sales|revenue|engagement|retention|awareness|consideration)/i,
    methodologies: ['exploratory-interviews', 'cx-driver-analysis', 'mystery-shopping'],
    weight: 'primary',
    description: 'Performance problem - needs diagnosis'
  },

  // Problem statements - customers leaving/churning
  {
    pattern: /(?:customers|users|clients)\s+(?:are\s+)?(?:leaving|churning|canceling|switching|not\s+returning)/i,
    methodologies: ['exploratory-interviews', 'cx-driver-analysis'],
    weight: 'primary',
    description: 'Churn problem - needs understanding'
  },

  // Problem statements - not interested/engaging
  {
    pattern: /(?:not|don't|aren't)\s+(?:interested|engaging|buying|adopting|using|responding)/i,
    methodologies: ['exploratory-interviews', 'concept-test', 'segmentation'],
    weight: 'primary',
    description: 'Lack of interest - needs exploration'
  },

  // "How satisfied" questions
  {
    pattern: /how\s+satisfied/i,
    methodologies: ['csat', 'cx-driver-analysis'],
    weight: 'primary',
    description: 'Satisfaction measurement'
  },

  // NPS-specific questions
  {
    pattern: /(?:measure|track|improve|increase|benchmark)\s+(?:nps|net promoter|loyalty)/i,
    methodologies: ['nps', 'cx-driver-analysis'],
    weight: 'primary',
    description: 'NPS/loyalty measurement'
  },

  // Effort-specific questions
  {
    pattern: /how\s+(?:easy|hard|difficult|simple)\s+(?:is it|it is)/i,
    methodologies: ['ces', 'cx-driver-analysis'],
    weight: 'primary',
    description: 'Effort measurement'
  },

  // A/B testing questions
  {
    pattern: /(?:which|what)\s+(?:version|variant|option|design|message|email)\s+(?:works|performs|converts)\s+better/i,
    methodologies: ['ab-testing', 'concept-test'],
    weight: 'primary',
    description: 'A/B testing question'
  },

  // "Should we test" questions
  {
    pattern: /should\s+we\s+(?:test|experiment|try|run an? (?:a\/b|ab|split))/i,
    methodologies: ['ab-testing', 'concept-test'],
    weight: 'primary',
    description: 'Experimentation question'
  },

  // "How do we compare" questions
  {
    pattern: /how\s+do\s+we\s+compare/i,
    methodologies: ['brand-tracking', 'exploratory-interviews'],
    weight: 'primary',
    description: 'Competitive comparison'
  },

  // "What's causing" questions
  {
    pattern: /what(?:'s|\s+is)\s+causing/i,
    methodologies: ['exploratory-interviews', 'cx-driver-analysis'],
    weight: 'primary',
    description: 'Root cause analysis'
  },

  // "Should we launch/introduce" questions
  {
    pattern: /should\s+we\s+(?:launch|introduce|release|build|create|offer)/i,
    methodologies: ['concept-test', 'exploratory-interviews'],
    weight: 'primary',
    description: 'Launch decision question'
  },

  // "How do we know if" questions
  {
    pattern: /how\s+(?:do|can|will)\s+we\s+know\s+if/i,
    methodologies: ['concept-test', 'brand-tracking', 'cx-driver-analysis'],
    weight: 'primary',
    description: 'Validation/tracking question'
  },

  // "Who should we target" questions
  {
    pattern: /who\s+should\s+we\s+(?:target|focus|prioritize)/i,
    methodologies: ['segmentation', 'exploratory-interviews'],
    weight: 'primary',
    description: 'Targeting question'
  }
]

/**
 * Normalize question text for matching
 */
function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .replace(/\s+/g, ' ')      // Collapse multiple spaces
}

/**
 * Context signals detected from question
 */
export interface ContextSignals {
  timeline: 'urgent' | 'normal' | 'long-term'
  budget: 'limited' | 'moderate' | 'flexible'
  complexity: 'simple' | 'moderate' | 'complex'
}

/**
 * Trigger patterns for context detection
 */
const TIMELINE_URGENT = ['asap', 'quick', 'fast', 'this week', 'immediately', 'urgent', 'right now', 'need it soon', 'next week', 'by friday']
const TIMELINE_LONGTERM = ['6 months', 'next year', 'comprehensive', 'thorough', 'detailed study', 'long term', 'ongoing']
const BUDGET_LIMITED = ['cheap', 'low cost', 'affordable', 'small budget', 'limited budget', 'tight budget', 'minimal cost', 'under 5k', 'under 10k']
const BUDGET_FLEXIBLE = ['comprehensive', 'thorough', 'best quality', 'dont care about cost', 'unlimited', 'enterprise', 'large scale']
const COMPLEXITY_SIMPLE = ['just need', 'quick check', 'simple question', 'which one', 'a or b', 'yes or no', 'single']
const COMPLEXITY_COMPLEX = ['multiple', 'comprehensive', 'enterprise', 'global', 'multi phase', 'complex', 'several', 'various', 'many factors']

/**
 * Detect business context from question
 */
function detectContext(question: string): ContextSignals {
  const normalized = normalizeQuestion(question)

  let timeline: ContextSignals['timeline'] = 'normal'
  if (TIMELINE_URGENT.some(term => normalized.includes(term))) timeline = 'urgent'
  if (TIMELINE_LONGTERM.some(term => normalized.includes(term))) timeline = 'long-term'

  let budget: ContextSignals['budget'] = 'moderate'
  if (BUDGET_LIMITED.some(term => normalized.includes(term))) budget = 'limited'
  if (BUDGET_FLEXIBLE.some(term => normalized.includes(term))) budget = 'flexible'

  let complexity: ContextSignals['complexity'] = 'moderate'
  if (COMPLEXITY_SIMPLE.some(term => normalized.includes(term))) complexity = 'simple'
  if (COMPLEXITY_COMPLEX.some(term => normalized.includes(term))) complexity = 'complex'

  return { timeline, budget, complexity }
}

/**
 * Extract keywords from question
 */
function extractKeywords(question: string): Set<string> {
  const normalized = normalizeQuestion(question)
  const words = normalized.split(' ')

  // Filter out common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'been', 'be',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'can', 'may', 'might', 'must', 'shall', 'our', 'we', 'us'
  ])

  return new Set(words.filter(word => word.length > 2 && !stopWords.has(word)))
}

/**
 * Match keywords against patterns
 */
function matchKeywords(question: string): Map<string, number> {
  const normalized = normalizeQuestion(question)
  const methodologyScores = new Map<string, number>()

  // Check each category of patterns
  for (const [category, patterns] of Object.entries(KEYWORD_PATTERNS)) {
    for (const pattern of patterns) {
      let matchCount = 0

      // Count keyword matches
      for (const keyword of pattern.keywords) {
        if (normalized.includes(keyword)) {
          matchCount++
        }
      }

      // If we have matches, add score to methodologies
      if (matchCount > 0) {
        const baseScore = matchCount
        const weightMultiplier = pattern.weight === 'primary' ? 2 : 1

        for (const methodology of pattern.methodologies) {
          const currentScore = methodologyScores.get(methodology) || 0
          methodologyScores.set(methodology, currentScore + (baseScore * weightMultiplier))
        }
      }
    }
  }

  return methodologyScores
}

/**
 * Match question intent patterns
 */
function matchIntent(question: string): Map<string, number> {
  const methodologyScores = new Map<string, number>()

  for (const intentPattern of INTENT_PATTERNS) {
    if (intentPattern.pattern.test(question)) {
      const score = intentPattern.weight === 'primary' ? 3 : 1.5

      for (const methodology of intentPattern.methodologies) {
        const currentScore = methodologyScores.get(methodology) || 0
        methodologyScores.set(methodology, currentScore + score)
      }
    }
  }

  return methodologyScores
}

/**
 * Match industry patterns
 * Identifies industry context and boosts relevant methodologies
 */
function matchIndustry(question: string): Map<string, number> {
  const normalized = normalizeQuestion(question)
  const methodologyScores = new Map<string, number>()

  for (const industryPattern of INDUSTRY_PATTERNS) {
    let matchCount = 0

    for (const keyword of industryPattern.keywords) {
      if (normalized.includes(keyword)) {
        matchCount++
      }
    }

    if (matchCount > 0) {
      const score = industryPattern.weight === 'primary' ? 2 : 1

      for (const methodology of industryPattern.methodologies) {
        const currentScore = methodologyScores.get(methodology) || 0
        methodologyScores.set(methodology, currentScore + score)
      }
    }
  }

  return methodologyScores
}

/**
 * Combine and rank methodology scores
 */
function rankMethodologies(
  keywordScores: Map<string, number>,
  intentScores: Map<string, number>,
  industryScores: Map<string, number>
): string[] {
  const combinedScores = new Map<string, number>()

  // Combine keyword scores
  for (const [methodology, score] of keywordScores.entries()) {
    combinedScores.set(methodology, score)
  }

  // Add intent scores (weighted higher)
  for (const [methodology, score] of intentScores.entries()) {
    const currentScore = combinedScores.get(methodology) || 0
    combinedScores.set(methodology, currentScore + (score * 1.5))
  }

  // Add industry scores (boost relevant methodologies for industry context)
  for (const [methodology, score] of industryScores.entries()) {
    const currentScore = combinedScores.get(methodology) || 0
    combinedScores.set(methodology, currentScore + score)
  }

  // Sort by score descending
  return Array.from(combinedScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([methodology]) => methodology)
}

/**
 * Main routing function
 *
 * Takes a user question and returns relevant methodology files to include
 * in the LLM context.
 *
 * @param question - User's research question
 * @param maxPrimary - Maximum primary methodologies to return (default: 2)
 * @param maxSecondary - Maximum secondary methodologies to return (default: 2)
 * @returns MethodologyRoute with primary and secondary methodologies
 */
export function routeQuestion(
  question: string,
  maxPrimary: number = 2,
  maxSecondary: number = 2
): MethodologyRoute {
  // Detect business context from question
  const context = detectContext(question)

  // Get scores from all matching strategies
  const keywordScores = matchKeywords(question)
  const intentScores = matchIntent(question)
  const industryScores = matchIndustry(question)

  // Adjust scores based on detected context
  adjustScoresForContext(keywordScores, context)

  // Rank all methodologies by combined score
  const rankedMethodologies = rankMethodologies(keywordScores, intentScores, industryScores)

  // Split into primary and secondary
  let primary = rankedMethodologies.slice(0, maxPrimary)
  let secondary = rankedMethodologies.slice(maxPrimary, maxPrimary + maxSecondary)

  // FALLBACK: If no methodologies matched, provide default exploratory options
  if (primary.length === 0) {
    primary = ['concept-test', 'exploratory-interviews']
    console.warn('[Method Router] No methodologies matched - using fallback defaults')
  }

  // Generate rationale with context awareness
  const rationale = generateRationale(question, primary, keywordScores, intentScores, context)

  return {
    primary,
    secondary,
    rationale,
    metadata: {
      totalMethodologies: rankedMethodologies.length,
      keywordMatches: Array.from(keywordScores.entries()),
      intentMatches: Array.from(intentScores.entries()),
      context
    }
  }
}

/**
 * Adjust methodology scores based on business context
 */
function adjustScoresForContext(
  scores: Map<string, number>,
  context: ContextSignals
): void {
  // Adjust for timeline urgency
  if (context.timeline === 'urgent') {
    // Reduce scores for slow methods
    scores.set('conjoint', (scores.get('conjoint') || 0) * 0.5)
    scores.set('brand-tracking', (scores.get('brand-tracking') || 0) * 0.5)
    // Boost fast methods
    scores.set('exploratory-interviews', (scores.get('exploratory-interviews') || 0) * 1.2)
    scores.set('concept-test', (scores.get('concept-test') || 0) * 1.2)
    scores.set('maxdiff', (scores.get('maxdiff') || 0) * 1.1)
  }

  // Adjust for budget constraints
  if (context.budget === 'limited') {
    // Reduce expensive methods
    scores.set('conjoint', (scores.get('conjoint') || 0) * 0.7)
    scores.set('focus-groups', (scores.get('focus-groups') || 0) * 0.7)
    // Boost cost-effective methods
    scores.set('exploratory-interviews', (scores.get('exploratory-interviews') || 0) * 1.1)
  }

  // Adjust for complexity
  if (context.complexity === 'simple') {
    // Reduce complex methods
    scores.set('conjoint', (scores.get('conjoint') || 0) * 0.8)
    scores.set('cx-driver-analysis', (scores.get('cx-driver-analysis') || 0) * 0.8)
  } else if (context.complexity === 'complex') {
    // Boost comprehensive methods
    scores.set('conjoint', (scores.get('conjoint') || 0) * 1.2)
    scores.set('cx-driver-analysis', (scores.get('cx-driver-analysis') || 0) * 1.2)
  }
}

/**
 * Generate human-readable rationale for methodology selection
 */
function generateRationale(
  question: string,
  selectedMethodologies: string[],
  keywordScores: Map<string, number>,
  intentScores: Map<string, number>,
  context?: ContextSignals
): string {
  const reasons: string[] = []

  // Add context-based reasoning first
  if (context) {
    if (context.timeline === 'urgent') {
      reasons.push('Prioritizing faster methods due to time constraints')
    } else if (context.timeline === 'long-term') {
      reasons.push('Comprehensive approach suitable for long-term timeline')
    }

    if (context.budget === 'limited') {
      reasons.push('Focusing on cost-effective options given budget constraints')
    } else if (context.budget === 'flexible') {
      reasons.push('Considering premium methodologies given budget flexibility')
    }
  }

  // Analyze question structure
  const normalized = normalizeQuestion(question)

  if (normalized.includes('price') || normalized.includes('pricing')) {
    reasons.push('Question involves pricing decisions')
  }

  if (normalized.includes('feature') || normalized.includes('prioritize')) {
    reasons.push('Question involves feature prioritization')
  }

  if (normalized.includes('why') || normalized.includes('understand')) {
    reasons.push('Question seeks causal understanding (qualitative insight needed)')
  }

  if (normalized.includes('churn') || normalized.includes('leaving')) {
    reasons.push('Question involves customer retention/churn')
  }

  if (normalized.includes('brand') || normalized.includes('perception')) {
    reasons.push('Question involves brand perception')
  }

  if (normalized.includes('which') && normalized.includes('concept')) {
    reasons.push('Question involves concept selection')
  }

  if (reasons.length === 0) {
    // Check if we had no keyword matches at all (fallback case)
    const totalMatches = Array.from(keywordScores.values()).reduce((sum, score) => sum + score, 0) +
                        Array.from(intentScores.values()).reduce((sum, score) => sum + score, 0)

    if (totalMatches === 0) {
      reasons.push('General research question - recommending exploratory methodologies to understand your needs')
    } else {
      reasons.push('General research question')
    }
  }

  return reasons.join('; ')
}

/**
 * Get methodology file path
 *
 * Helper to convert methodology ID to file path
 */
export function getMethodologyPath(methodologyId: string): string {
  return `knowledge/methods/${methodologyId}.md`
}

/**
 * Get all methodology file paths for a route
 */
export function getMethodologyPaths(route: MethodologyRoute): {
  primary: string[]
  secondary: string[]
} {
  return {
    primary: route.primary.map(getMethodologyPath),
    secondary: route.secondary.map(getMethodologyPath)
  }
}

/**
 * FUTURE ENHANCEMENTS:
 *
 * 1. SEMANTIC MATCHING
 *    - Use embeddings to find similar questions
 *    - Train on labeled question-methodology pairs
 *    - Example: OpenAI embeddings or sentence-transformers
 *
 * 2. INDUSTRY-AWARE ROUTING
 *    - Detect industry from question context
 *    - Apply industry-specific routing rules
 *    - Example: Healthcare questions prioritize CX/compliance
 *
 * 3. MULTI-METHOD DETECTION
 *    - Detect when questions need multi-phase research
 *    - Example: "Price and launch" → conjoint + concept-test
 *    - Return recommended sequence, not just list
 *
 * 4. CONFIDENCE SCORES
 *    - Return confidence for each methodology match
 *    - Allow LLM to override low-confidence routes
 *    - Track accuracy over time
 *
 * 5. LEARNING FROM FEEDBACK
 *    - Log which routes led to good vs bad recommendations
 *    - Adjust weights based on performance
 *    - A/B test routing strategies
 *
 * 6. COMPLEXITY ANALYSIS
 *    - Simple questions → single methodology
 *    - Complex questions → multiple methodologies
 *    - Very complex → recommend phased approach
 *
 * 7. FALLBACK STRATEGIES
 *    - If no strong matches, route to exploratory-interviews
 *    - If ambiguous, route to multiple methods and let LLM decide
 *
 * 8. CONTEXT AWARENESS
 *    - Use previous questions in conversation
 *    - Detect follow-up questions
 *    - Maintain routing context across session
 */

/**
 * Example Usage:
 *
 * ```typescript
 * import { routeQuestion, getMethodologyPaths } from './lib/method-router'
 *
 * const question = "What should we charge for our new premium tier?"
 * const route = routeQuestion(question)
 *
 * console.log(route)
 * // {
 * //   primary: ['pricing-research', 'conjoint'],
 * //   secondary: ['maxdiff'],
 * //   rationale: 'Question involves pricing decisions'
 * // }
 *
 * const paths = getMethodologyPaths(route)
 * console.log(paths.primary)
 * // ['knowledge/methods/pricing-research.md', 'knowledge/methods/conjoint.md']
 *
 * // Use these paths to load methodology content and inject into LLM prompt
 * ```
 */
