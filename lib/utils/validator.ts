const MIN_QUERY_LENGTH = 10
const MAX_QUERY_LENGTH = 500

export interface ValidationResult {
  valid: boolean
  errors: string[]
  sanitized: string
}

export function validateQuery(query: string): ValidationResult {
  const errors: string[] = []

  // Check if query exists
  if (!query || typeof query !== 'string') {
    errors.push('Query must be a non-empty string')
    return { valid: false, errors, sanitized: '' }
  }

  // Trim whitespace
  const trimmedQuery = query.trim()

  // Check minimum length
  if (trimmedQuery.length < MIN_QUERY_LENGTH) {
    errors.push(`Query must be at least ${MIN_QUERY_LENGTH} characters`)
  }

  // Check maximum length
  if (trimmedQuery.length > MAX_QUERY_LENGTH) {
    errors.push(`Query must not exceed ${MAX_QUERY_LENGTH} characters`)
  }

  // Check if query contains alphabetic characters
  if (!/[a-zA-Z]/.test(trimmedQuery)) {
    errors.push('Query must contain at least some alphabetic characters')
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: trimmedQuery,
  }
}

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .slice(0, MAX_QUERY_LENGTH) // Truncate if too long
}
