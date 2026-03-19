/**
 * Analytics Logger
 *
 * Simple file-based analytics to track search queries.
 * Logs are stored in /logs/searches.jsonl (JSON Lines format)
 */

import fs from 'fs'
import path from 'path'

interface SearchLog {
  timestamp: string
  question: string
  success: boolean
  methods?: string[]
  error?: string
}

const LOGS_DIR = path.join(process.cwd(), 'logs')
const SEARCHES_LOG = path.join(LOGS_DIR, 'searches.jsonl')

/**
 * Ensure logs directory exists
 */
function ensureLogsDir() {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true })
  }
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
    ensureLogsDir()

    const log: SearchLog = {
      timestamp: new Date().toISOString(),
      question: data.question,
      success: data.success,
      ...(data.methods && { methods: data.methods }),
      ...(data.error && { error: data.error })
    }

    // Append to JSONL file (one JSON object per line)
    fs.appendFileSync(SEARCHES_LOG, JSON.stringify(log) + '\n', 'utf-8')

    console.log('[Analytics] Logged search:', data.question.substring(0, 50) + '...')
  } catch (error) {
    console.error('[Analytics] Failed to log search:', error)
    // Don't throw - analytics shouldn't break the app
  }
}

/**
 * Get total search count
 */
export function getSearchCount(): number {
  try {
    if (!fs.existsSync(SEARCHES_LOG)) {
      return 0
    }

    const content = fs.readFileSync(SEARCHES_LOG, 'utf-8')
    const lines = content.trim().split('\n').filter(line => line.length > 0)
    return lines.length
  } catch (error) {
    console.error('[Analytics] Failed to get search count:', error)
    return 0
  }
}

/**
 * Get recent searches
 */
export function getRecentSearches(limit: number = 100): SearchLog[] {
  try {
    if (!fs.existsSync(SEARCHES_LOG)) {
      return []
    }

    const content = fs.readFileSync(SEARCHES_LOG, 'utf-8')
    const lines = content.trim().split('\n').filter(line => line.length > 0)

    // Get last N lines
    const recentLines = lines.slice(-limit)

    // Parse each line
    return recentLines.map(line => JSON.parse(line))
  } catch (error) {
    console.error('[Analytics] Failed to get recent searches:', error)
    return []
  }
}

/**
 * Get analytics summary
 */
export function getAnalyticsSummary() {
  try {
    const searches = getRecentSearches(1000) // Get last 1000

    return {
      totalSearches: searches.length,
      successfulSearches: searches.filter(s => s.success).length,
      failedSearches: searches.filter(s => !s.success).length,
      recentSearches: searches.slice(-10).reverse(), // Last 10, most recent first
    }
  } catch (error) {
    console.error('[Analytics] Failed to get analytics summary:', error)
    return {
      totalSearches: 0,
      successfulSearches: 0,
      failedSearches: 0,
      recentSearches: []
    }
  }
}
