/**
 * Project History - PostgreSQL backed
 */

import { query, initializeDatabase } from './db'
import crypto from 'crypto'

function generateId(): string {
  return crypto.randomBytes(6).toString('base64url')
}

/**
 * Save a research plan as a project
 */
export async function saveProject(data: {
  question: string
  plan: Record<string, unknown>
  metadata?: Record<string, unknown>
}): Promise<string> {
  await initializeDatabase()
  const id = generateId()
  await query(
    `INSERT INTO projects (id, question, plan, metadata) VALUES ($1, $2, $3, $4)`,
    [id, data.question, JSON.stringify(data.plan), JSON.stringify(data.metadata || {})]
  )
  console.log('[Projects] Saved project:', id)
  return id
}

/**
 * Get a project by ID
 */
export async function getProject(id: string) {
  await initializeDatabase()
  const result = await query(
    `SELECT id, question, plan, metadata, created_at, updated_at FROM projects WHERE id = $1`,
    [id]
  )
  if (result.rows.length === 0) return null
  const row = result.rows[0]
  return {
    id: row.id,
    question: row.question,
    plan: row.plan,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * List recent projects
 */
export async function listProjects(limit: number = 20) {
  await initializeDatabase()
  const result = await query(
    `SELECT id, question, metadata, created_at FROM projects ORDER BY created_at DESC LIMIT $1`,
    [limit]
  )
  return result.rows.map((row: { id: string; question: string; metadata: Record<string, unknown>; created_at: string }) => ({
    id: row.id,
    question: row.question,
    metadata: row.metadata,
    createdAt: row.created_at,
  }))
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
  await initializeDatabase()
  const result = await query('DELETE FROM projects WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}
