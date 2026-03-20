/**
 * PostgreSQL Database Connection
 *
 * Singleton pool using the Prisma-style globalThis pattern
 * to prevent connection leaks during Next.js hot reloads.
 */

import { Pool, QueryResult } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL

const globalForDb = globalThis as unknown as { dbPool: Pool | undefined }

function getPool(): Pool {
  if (!globalForDb.dbPool) {
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    globalForDb.dbPool = new Pool({
      connectionString: DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })

    globalForDb.dbPool.on('error', (err) => {
      console.error('[DB] Unexpected pool error:', err)
    })

    console.log('[DB] Connection pool created')
  }

  return globalForDb.dbPool
}

/**
 * Execute a parameterized query
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query(text: string, params?: any[]): Promise<QueryResult<any>> {
  return getPool().query(text, params)
}

/**
 * Initialize database schema
 * Called once on first request - creates tables if they don't exist
 */
export async function initializeDatabase() {
  const g = globalThis as Record<string, unknown>
  if (g.__dbInitialized) return

  try {
    await getPool().query(`
      CREATE TABLE IF NOT EXISTS searches (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        success BOOLEAN NOT NULL DEFAULT true,
        methods TEXT[],
        error TEXT,
        ip_hash TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        plan JSONB NOT NULL,
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        question_template TEXT NOT NULL,
        is_builtin BOOLEAN NOT NULL DEFAULT false,
        config JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_searches_created_at ON searches(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
      CREATE INDEX IF NOT EXISTS idx_templates_builtin ON templates(is_builtin);
    `)

    g.__dbInitialized = true
    console.log('[DB] Schema initialized')
  } catch (error) {
    console.error('[DB] Failed to initialize schema:', error)
    throw error
  }
}
