/**
 * Analytics Logger
 *
 * In-memory analytics using globalThis singleton pattern
 * (same approach Prisma uses for Next.js).
 * Always reads/writes via getter to avoid stale references
 * across separately-bundled API route chunks.
 */

interface SearchLog {
  timestamp: string
  question: string
  success: boolean
  methods?: string[]
  error?: string
}

// Use a unique symbol-like key to avoid collisions
const STORE_KEY = '__researchguide_analytics_v1'

/**
 * Always access the store through this getter -
 * never cache the reference in a module-level variable
 */
function getStore(): SearchLog[] {
  const g = globalThis as Record<string, unknown>
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = []
  }
  return g[STORE_KEY] as SearchLog[]
}

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
    const store = getStore()
    const log: SearchLog = {
      timestamp: new Date().toISOString(),
      question: data.question,
      success: data.success,
      ...(data.methods && { methods: data.methods }),
      ...(data.error && { error: data.error })
    }

    store.push(log)

    // Cap at 10,000 entries to prevent memory bloat
    if (store.length > 10000) {
      store.splice(0, store.length - 10000)
    }

    console.log(`[Analytics] Logged search (total: ${store.length}):`, data.question.substring(0, 50) + '...')
  } catch (error) {
    console.error('[Analytics] Failed to log search:', error)
  }
}

/**
 * Get total search count
 */
export function getSearchCount(): number {
  return getStore().length
}

/**
 * Get recent searches
 */
export function getRecentSearches(limit: number = 100): SearchLog[] {
  return getStore().slice(-limit)
}

/**
 * Get analytics summary
 */
export function getAnalyticsSummary() {
  const store = getStore()
  console.log(`[Analytics] Summary requested. Store has ${store.length} entries.`)
  return {
    totalSearches: store.length,
    successfulSearches: store.filter(s => s.success).length,
    failedSearches: store.filter(s => !s.success).length,
    recentSearches: store.slice(-10).reverse(),
  }
}
