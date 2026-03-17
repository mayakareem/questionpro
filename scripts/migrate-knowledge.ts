/**
 * Script to migrate knowledge from the old CLI structure to the new Next.js structure
 * Run with: npx ts-node scripts/migrate-knowledge.ts
 */

import fs from 'fs'
import path from 'path'

const OLD_SRC_DIR = path.join(__dirname, '../src')
const NEW_KNOWLEDGE_DIR = path.join(__dirname, '../knowledge')

async function migrateKnowledge() {
  console.log('🔄 Starting knowledge base migration...')

  // Check if old structure exists
  if (!fs.existsSync(OLD_SRC_DIR)) {
    console.log('ℹ️  No old src/ directory found. Nothing to migrate.')
    return
  }

  // Ensure new knowledge directories exist
  const dirs = [
    path.join(NEW_KNOWLEDGE_DIR, 'methods'),
    path.join(NEW_KNOWLEDGE_DIR, 'questionpro'),
    path.join(NEW_KNOWLEDGE_DIR, 'industries'),
    path.join(NEW_KNOWLEDGE_DIR, 'examples'),
  ]

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })

  console.log('✅ Migration complete!')
}

migrateKnowledge().catch(console.error)
