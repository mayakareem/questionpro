/**
 * Unit tests for query validator
 */

import { validateQuery } from '@/lib/utils/validator'

describe('validateQuery', () => {
  it('should accept valid queries', () => {
    const result = validateQuery('What should we charge for our premium tier?')
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should reject empty queries', () => {
    const result = validateQuery('')
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should reject queries that are too short', () => {
    const result = validateQuery('Price?')
    expect(result.valid).toBe(false)
  })

  it('should reject queries that are too long', () => {
    const longQuery = 'a'.repeat(600)
    const result = validateQuery(longQuery)
    expect(result.valid).toBe(false)
  })

  it('should sanitize input by trimming whitespace', () => {
    const result = validateQuery('  What is the optimal pricing?  ')
    expect(result.sanitized).toBe('What is the optimal pricing?')
  })
})
