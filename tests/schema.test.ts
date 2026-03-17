/**
 * Schema Validation Tests
 *
 * Tests for validating:
 * - Response structure matches expected schema
 * - All required fields are present
 * - Field types are correct
 * - Methodology names are valid
 * - Sample sizes are reasonable
 * - Timelines are realistic
 */

import { validateResearchPlan } from '../lib/schemas'

/**
 * Mock response for testing
 */
const mockValidResponse = {
  userQuestion: 'What should we charge for our new premium tier?',
  businessDecision: 'Determining the optimal price point for a new premium subscription tier',
  researchObjective: 'Understand customer willingness to pay and feature valuation to set a competitive yet profitable price',
  recommendedMethods: [
    {
      name: 'Pricing Research',
      isPrimary: true,
      rationale: 'Directly measures willingness to pay across customer segments'
    },
    {
      name: 'Conjoint Analysis',
      isPrimary: false,
      rationale: 'Identifies feature importance and price sensitivity'
    }
  ],
  implementation: {
    questionProSteps: '1. Create Van Westendorp PSM survey\n2. Add four standard price questions\n3. Segment by customer type',
    sampleSize: '400-500 respondents',
    timeline: '3-4 weeks'
  },
  expectedOutputs: '- Optimal price point\n- Acceptable price range\n- Too expensive threshold',
  decisionSupport: 'These outputs enable you to set a price that maximizes revenue while staying within customer expectations',
  assumptions: [
    'Target audience has budget authority',
    'Pricing is a primary purchase driver'
  ],
  caveats: [
    'What people say they\'ll pay ≠ actual behavior',
    'Market conditions may change'
  ]
}

/**
 * Test suite for schema validation
 */
export const schemaTests = [
  {
    name: 'Valid response passes validation',
    input: mockValidResponse,
    shouldPass: true,
    description: 'A well-formed response with all required fields should pass validation'
  },
  {
    name: 'Missing business decision fails',
    input: { ...mockValidResponse, businessDecision: '' },
    shouldPass: false,
    description: 'Response missing business decision should fail validation'
  },
  {
    name: 'Missing research objective fails',
    input: { ...mockValidResponse, researchObjective: '' },
    shouldPass: false,
    description: 'Response missing research objective should fail validation'
  },
  {
    name: 'Empty methods array fails',
    input: { ...mockValidResponse, recommendedMethods: [] },
    shouldPass: false,
    description: 'Response with no recommended methods should fail validation'
  },
  {
    name: 'Missing implementation steps fails',
    input: {
      ...mockValidResponse,
      implementation: { ...mockValidResponse.implementation, questionProSteps: '' }
    },
    shouldPass: false,
    description: 'Response missing QuestionPro steps should fail validation'
  },
  {
    name: 'Missing expected outputs fails',
    input: { ...mockValidResponse, expectedOutputs: '' },
    shouldPass: false,
    description: 'Response missing expected outputs should fail validation'
  },
  {
    name: 'Missing decision support fails',
    input: { ...mockValidResponse, decisionSupport: '' },
    shouldPass: false,
    description: 'Response missing decision support should fail validation'
  },
  {
    name: 'Valid with minimal assumptions/caveats passes',
    input: {
      ...mockValidResponse,
      assumptions: ['Single assumption'],
      caveats: ['Single caveat']
    },
    shouldPass: true,
    description: 'Response with minimal assumptions and caveats should still pass'
  }
]

/**
 * Run schema validation tests
 */
export function runSchemaTests(): void {
  console.log('\n🧪 Running Schema Validation Tests\n')

  let passed = 0
  let failed = 0

  schemaTests.forEach((test, idx) => {
    const result = validateResearchPlan(test.input)
    const isPass = test.shouldPass ? result.success : !result.success

    if (isPass) {
      console.log(`✅ Test ${idx + 1}: ${test.name}`)
      passed++
    } else {
      console.log(`❌ Test ${idx + 1}: ${test.name}`)
      console.log(`   Expected: ${test.shouldPass ? 'pass' : 'fail'}`)
      console.log(`   Got: ${result.success ? 'pass' : 'fail'}`)
      if (!result.success) {
        console.log(`   Errors: ${JSON.stringify(result.error)}`)
      }
      failed++
    }
  })

  console.log(`\n📊 Schema Tests: ${passed} passed, ${failed} failed\n`)
}

/**
 * Validate methodology names are from known set
 */
export const validMethodologyNames = [
  'Exploratory Interviews',
  'Focus Groups',
  'Concept Test',
  'Pricing Research',
  'MaxDiff',
  'Conjoint Analysis',
  'Brand Tracking',
  'CX Driver Analysis'
]

/**
 * Check if methodology name is valid
 */
export function isValidMethodology(name: string): boolean {
  return validMethodologyNames.some(valid =>
    name.toLowerCase().includes(valid.toLowerCase())
  )
}

/**
 * Validate sample size is reasonable
 */
export function isReasonableSampleSize(sampleSize: string): {
  valid: boolean
  reason?: string
} {
  // Extract numbers from sample size string
  const numbers = sampleSize.match(/\d+/g)?.map(Number) || []

  if (numbers.length === 0) {
    return { valid: false, reason: 'No sample size specified' }
  }

  const minSize = Math.min(...numbers)
  const maxSize = Math.max(...numbers)

  // Sample size checks
  if (minSize < 30) {
    return { valid: false, reason: 'Sample size too small (< 30)' }
  }

  if (maxSize > 10000) {
    return { valid: false, reason: 'Sample size unrealistically large (> 10,000)' }
  }

  // Common reasonable ranges
  if (minSize >= 30 && maxSize <= 10000) {
    return { valid: true }
  }

  return { valid: false, reason: 'Sample size outside reasonable range' }
}

/**
 * Validate timeline is realistic
 */
export function isRealisticTimeline(timeline: string): {
  valid: boolean
  reason?: string
} {
  // Extract duration
  const match = timeline.match(/(\d+)[-–]?(\d+)?\s*(week|day|month)/i)

  if (!match) {
    return { valid: false, reason: 'No timeline specified' }
  }

  const duration = parseInt(match[1])
  const unit = match[3].toLowerCase()

  // Convert to weeks for comparison
  let weeksEstimate = duration
  if (unit === 'day') {
    weeksEstimate = duration / 7
  } else if (unit === 'month') {
    weeksEstimate = duration * 4
  }

  // Timeline checks
  if (weeksEstimate < 0.5) {
    return { valid: false, reason: 'Timeline too short (< 3 days)' }
  }

  if (weeksEstimate > 52) {
    return { valid: false, reason: 'Timeline too long (> 1 year)' }
  }

  return { valid: true }
}

/**
 * Advanced validation tests
 */
export const advancedValidationTests = [
  {
    name: 'Methodology names are valid',
    validator: (response: typeof mockValidResponse) => {
      const invalidMethods = response.recommendedMethods.filter(
        m => !isValidMethodology(m.name)
      )
      return {
        valid: invalidMethods.length === 0,
        message: invalidMethods.length > 0
          ? `Invalid methodologies: ${invalidMethods.map(m => m.name).join(', ')}`
          : 'All methodologies are valid'
      }
    }
  },
  {
    name: 'Sample size is reasonable',
    validator: (response: typeof mockValidResponse) => {
      const result = isReasonableSampleSize(response.implementation.sampleSize)
      return {
        valid: result.valid,
        message: result.reason || 'Sample size is reasonable'
      }
    }
  },
  {
    name: 'Timeline is realistic',
    validator: (response: typeof mockValidResponse) => {
      const result = isRealisticTimeline(response.implementation.timeline)
      return {
        valid: result.valid,
        message: result.reason || 'Timeline is realistic'
      }
    }
  },
  {
    name: 'At least one primary methodology',
    validator: (response: typeof mockValidResponse) => {
      const hasPrimary = response.recommendedMethods.some(m => m.isPrimary)
      return {
        valid: hasPrimary,
        message: hasPrimary ? 'Has primary methodology' : 'Missing primary methodology'
      }
    }
  },
  {
    name: 'Rationale is not empty',
    validator: (response: typeof mockValidResponse) => {
      const hasRationale = response.recommendedMethods.every(m => m.rationale && m.rationale.length > 10)
      return {
        valid: hasRationale,
        message: hasRationale ? 'All methods have rationale' : 'Some methods missing rationale'
      }
    }
  },
  {
    name: 'Expected outputs are specific',
    validator: (response: typeof mockValidResponse) => {
      const hasOutputs = response.expectedOutputs.length > 50
      return {
        valid: hasOutputs,
        message: hasOutputs ? 'Outputs are detailed' : 'Outputs are too brief'
      }
    }
  },
  {
    name: 'QuestionPro steps are actionable',
    validator: (response: typeof mockValidResponse) => {
      const hasSteps = response.implementation.questionProSteps.split('\n').length >= 3
      return {
        valid: hasSteps,
        message: hasSteps ? 'Has multiple steps' : 'Not enough implementation steps'
      }
    }
  },
  {
    name: 'Assumptions are present',
    validator: (response: typeof mockValidResponse) => {
      const hasAssumptions = response.assumptions.length > 0 &&
        !response.assumptions[0].toLowerCase().includes('no specific')
      return {
        valid: hasAssumptions,
        message: hasAssumptions ? 'Has meaningful assumptions' : 'Missing assumptions'
      }
    }
  },
  {
    name: 'Caveats are present',
    validator: (response: typeof mockValidResponse) => {
      const hasCaveats = response.caveats.length > 0 &&
        !response.caveats[0].toLowerCase().includes('no specific')
      return {
        valid: hasCaveats,
        message: hasCaveats ? 'Has meaningful caveats' : 'Missing caveats'
      }
    }
  }
]

/**
 * Run advanced validation tests on a response
 */
export function runAdvancedValidation(response: typeof mockValidResponse): {
  passed: number
  failed: number
  results: Array<{ name: string; valid: boolean; message: string }>
} {
  const results = advancedValidationTests.map(test => ({
    name: test.name,
    ...test.validator(response)
  }))

  const passed = results.filter(r => r.valid).length
  const failed = results.filter(r => !r.valid).length

  return { passed, failed, results }
}

/**
 * Print advanced validation results
 */
export function printAdvancedValidationResults(
  response: typeof mockValidResponse,
  promptInfo?: { id: string; question: string }
): void {
  console.log('\n🔍 Advanced Validation Results')
  if (promptInfo) {
    console.log(`Prompt: ${promptInfo.id} - "${promptInfo.question}"`)
  }
  console.log('─'.repeat(60))

  const validation = runAdvancedValidation(response)

  validation.results.forEach(result => {
    const emoji = result.valid ? '✅' : '❌'
    console.log(`${emoji} ${result.name}`)
    if (!result.valid) {
      console.log(`   → ${result.message}`)
    }
  })

  console.log('─'.repeat(60))
  console.log(`Passed: ${validation.passed}/${validation.results.length}`)
  console.log('')
}

// Export for use in eval-runner
export { mockValidResponse }

// Run tests if called directly
if (require.main === module) {
  runSchemaTests()
  console.log('\n🔍 Advanced Validation Example:\n')
  printAdvancedValidationResults(mockValidResponse, {
    id: 'test-1',
    question: 'What should we charge for our new premium tier?'
  })
}
