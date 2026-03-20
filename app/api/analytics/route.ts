import { NextResponse } from 'next/server'
import { getAnalyticsSummary } from '@/lib/analytics'

export async function GET() {
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
