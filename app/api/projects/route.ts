/**
 * Projects API
 *
 * GET  /api/projects       - List recent projects
 * POST /api/projects       - Save a new project
 */

import { NextRequest, NextResponse } from 'next/server'
import { saveProject, listProjects } from '@/lib/projects'

export async function GET() {
  try {
    const projects = await listProjects(50)
    return NextResponse.json({ success: true, projects })
  } catch (error) {
    console.error('[Projects API] List error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to list projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.question || !body.plan) {
      return NextResponse.json(
        { success: false, error: 'Missing question or plan' },
        { status: 400 }
      )
    }

    const id = await saveProject({
      question: body.question,
      plan: body.plan,
      metadata: body.metadata,
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('[Projects API] Save error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save project' },
      { status: 500 }
    )
  }
}
