/**
 * Single Project API
 *
 * GET    /api/projects/[id]  - Get a project by ID (shareable URL)
 * DELETE /api/projects/[id]  - Delete a project
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProject, deleteProject } from '@/lib/projects'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await getProject(params.id)

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, project })
  } catch (error) {
    console.error('[Projects API] Get error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteProject(params.id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Projects API] Delete error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
