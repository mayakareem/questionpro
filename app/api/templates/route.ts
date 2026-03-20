/**
 * Templates API
 *
 * GET  /api/templates         - List all templates (optional ?category=SaaS)
 * POST /api/templates         - Create a custom template
 * DELETE /api/templates?id=x  - Delete a custom template
 */

import { NextRequest, NextResponse } from 'next/server'
import { listTemplates, saveTemplate, deleteTemplate } from '@/lib/templates'

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category') || undefined
    const templates = await listTemplates(category)
    return NextResponse.json({ success: true, templates })
  } catch (error) {
    console.error('[Templates API] List error:', error)
    return NextResponse.json({ error: 'Failed to list templates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.questionTemplate) {
      return NextResponse.json(
        { error: 'Missing required fields: name, questionTemplate' },
        { status: 400 }
      )
    }

    const id = await saveTemplate({
      name: body.name,
      description: body.description || '',
      category: body.category || 'Custom',
      questionTemplate: body.questionTemplate,
      config: body.config,
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('[Templates API] Save error:', error)
    return NextResponse.json({ error: 'Failed to save template' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing template ID' }, { status: 400 })
    }

    const deleted = await deleteTemplate(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Template not found or is built-in' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Templates API] Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}
