/**
 * Analytics Logger - Persistent via PostgreSQL
 */

import { query, initializeDatabase } from './db'

/**
 * Log a search query
 */
export async function logSearch(data: {
  question: string
  success: boolean
  methods?: string[]
  error?: string
  ipHash?: string
}) {
  try {
    await initializeDatabase()
    await query(
      `INSERT INTO searches (question, success, methods, error, ip_hash)
       VALUES ($1, $2, $3, $4, $5)`,
      [data.question, data.success, data.methods || null, data.error || null, data.ipHash || null]
    )
    console.log('[Analytics] Logged search:', data.question.substring(0, 50) + '...')
  } catch (error) {
    console.error('[Analytics] Failed to log search:', error)
  }
}

/**
 * Get total search count
 */
export async function getSearchCount(): Promise<number> {
  try {
    await initializeDatabase()
    const result = await query('SELECT COUNT(*) as count FROM searches')
    return parseInt(result.rows[0].count, 10)
  } catch (error) {
    console.error('[Analytics] Failed to get search count:', error)
    return 0
  }
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary() {
  try {
    await initializeDatabase()

    const [totals, recent] = await Promise.all([
      query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE success = true) as successful,
          COUNT(*) FILTER (WHERE success = false) as failed
        FROM searches
      `),
      query(`
        SELECT question, success, methods, error, created_at as timestamp
        FROM searches
        ORDER BY created_at DESC
        LIMIT 10
      `)
    ])

    const row = totals.rows[0]
    return {
      totalSearches: parseInt(row.total, 10),
      successfulSearches: parseInt(row.successful, 10),
      failedSearches: parseInt(row.failed, 10),
      recentSearches: recent.rows.map((r: { question: string; success: boolean; methods: string[] | null; error: string | null; timestamp: string }) => ({
        question: r.question,
        success: r.success,
        methods: r.methods,
        error: r.error,
        timestamp: r.timestamp,
      })),
    }
  } catch (error) {
    console.error('[Analytics] Failed to get analytics summary:', error)
    return {
      totalSearches: 0,
      successfulSearches: 0,
      failedSearches: 0,
      recentSearches: [],
    }
  }
}
