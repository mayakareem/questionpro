import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsSummary } from '@/lib/analytics'
import { query, initializeDatabase } from '@/lib/db'

export async function GET(request: NextRequest) {
  // Health check mode: /api/analytics?health=1
  const health = request.nextUrl.searchParams.get('health')

  if (health) {
    try {
      await initializeDatabase()
      const result = await query('SELECT NOW() as now, COUNT(*) as search_count FROM searches')
      return NextResponse.json({
        status: 'ok',
        dbConnected: true,
        serverTime: result.rows[0].now,
        searchCount: parseInt(result.rows[0].search_count, 10),
        databaseUrl: process.env.DATABASE_URL ? 'set (' + process.env.DATABASE_URL.substring(0, 30) + '...)' : 'NOT SET',
      })
    } catch (error) {
      return NextResponse.json({
        status: 'error',
        dbConnected: false,
        error: error instanceof Error ? error.message : String(error),
        databaseUrl: process.env.DATABASE_URL ? 'set (' + process.env.DATABASE_URL.substring(0, 30) + '...)' : 'NOT SET',
      }, { status: 500 })
    }
  }

  try {
    const summary = await getAnalyticsSummary()
    return NextResponse.json(summary)
  } catch (error) {
    console.error('[Analytics API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
