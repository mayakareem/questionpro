/**
 * Analytics Logger
 *
 * In-memory analytics to track search queries.
 * Works on ephemeral filesystems like Railway.
 * Data resets on redeploy but persists during runtime.
 */

interface SearchLog {
  timestamp: string
  question: string
  success: boolean
  methods?: string[]
  error?: string
}

// In-memory store - persists for the lifetime of the server process
const searchLogs: SearchLog[] = []

/**
 * Log a search query
 */
export function logSearch(data: {
  question: string
  success: boolean
  methods?: string[]
  error?: string
}) {
  try {
    const log: SearchLog = {
      timestamp: new Date().toISOString(),
      question: data.question,
      success: data.success,
      ...(data.methods && { methods: data.methods }),
      ...(data.error && { error: data.error })
    }

    searchLogs.push(log)

    // Cap at 10,000 entries to prevent memory bloat
    if (searchLogs.length > 10000) {
      searchLogs.splice(0, searchLogs.length - 10000)
    }

    console.log('[Analytics] Logged search:', data.question.substring(0, 50) + '...')
  } catch (error) {
    console.error('[Analytics] Failed to log search:', error)
  }
}

/**
 * Get total search count
 */
export function getSearchCount(): number {
  return searchLogs.length
}

/**
 * Get recent searches
 */
export function getRecentSearches(limit: number = 100): SearchLog[] {
  return searchLogs.slice(-limit)
}

/**
 * Get analytics summary
 */
export function getAnalyticsSummary() {
  return {
    totalSearches: searchLogs.length,
    successfulSearches: searchLogs.filter(s => s.success).length,
    failedSearches: searchLogs.filter(s => !s.success).length,
    recentSearches: searchLogs.slice(-10).reverse(),
  }
}
