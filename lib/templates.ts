/**
 * Methodology Templates - PostgreSQL backed
 *
 * Pre-built industry templates + user-created custom templates
 */

import { query, initializeDatabase } from './db'
import crypto from 'crypto'

export interface Template {
  id: string
  name: string
  description: string
  category: string
  questionTemplate: string
  isBuiltin: boolean
  config?: Record<string, unknown>
  createdAt?: string
}

function generateId(): string {
  return 'tpl_' + crypto.randomBytes(4).toString('hex')
}

/**
 * Pre-built industry templates
 */
const BUILTIN_TEMPLATES: Omit<Template, 'createdAt'>[] = [
  {
    id: 'tpl_saas_churn',
    name: 'SaaS Churn Analysis',
    description: 'Understand why customers are churning and identify at-risk segments',
    category: 'SaaS',
    questionTemplate: 'Why are our SaaS customers churning and what segments are most at risk?',
    isBuiltin: true,
    config: { industry: 'SaaS', methods: ['nps', 'survey-design', 'conjoint-analysis'] }
  },
  {
    id: 'tpl_brand_health',
    name: 'Brand Health Tracker',
    description: 'Measure brand awareness, perception, and competitive positioning',
    category: 'Brand',
    questionTemplate: 'How healthy is our brand compared to competitors and what drives brand perception?',
    isBuiltin: true,
    config: { industry: 'General', methods: ['survey-design', 'nps', 'ab-testing'] }
  },
  {
    id: 'tpl_cx_satisfaction',
    name: 'Customer Satisfaction Deep Dive',
    description: 'Measure satisfaction across touchpoints and identify improvement areas',
    category: 'CX',
    questionTemplate: 'How satisfied are our customers across key touchpoints and what should we improve first?',
    isBuiltin: true,
    config: { industry: 'General', methods: ['csat', 'ces', 'nps'] }
  },
  {
    id: 'tpl_product_market_fit',
    name: 'Product-Market Fit Assessment',
    description: 'Validate if your product meets market needs and find gaps',
    category: 'Product',
    questionTemplate: 'Does our product have product-market fit and what gaps should we address?',
    isBuiltin: true,
    config: { industry: 'Tech', methods: ['survey-design', 'conjoint-analysis'] }
  },
  {
    id: 'tpl_pricing_research',
    name: 'Pricing Strategy Research',
    description: 'Determine optimal pricing through willingness-to-pay analysis',
    category: 'Product',
    questionTemplate: 'What is the optimal price point for our product and how price-sensitive are different segments?',
    isBuiltin: true,
    config: { industry: 'General', methods: ['conjoint-analysis', 'maxdiff'] }
  },
  {
    id: 'tpl_employee_engagement',
    name: 'Employee Engagement Survey',
    description: 'Measure employee satisfaction, engagement, and identify retention risks',
    category: 'People',
    questionTemplate: 'How engaged are our employees and what are the biggest drivers of attrition?',
    isBuiltin: true,
    config: { industry: 'HR', methods: ['nps', 'survey-design'] }
  },
  {
    id: 'tpl_market_entry',
    name: 'New Market Entry Assessment',
    description: 'Evaluate market size, competition, and entry strategy for a new geography',
    category: 'Growth',
    questionTemplate: 'Should we enter this new market and what is the addressable opportunity?',
    isBuiltin: true,
    config: { industry: 'General', methods: ['survey-design', 'focus-groups'] }
  },
  {
    id: 'tpl_ux_research',
    name: 'UX Research Plan',
    description: 'Plan usability testing and user research for product improvements',
    category: 'Product',
    questionTemplate: 'What usability issues are preventing users from completing key tasks in our product?',
    isBuiltin: true,
    config: { industry: 'Tech', methods: ['usability-testing', 'survey-design'] }
  },
  {
    id: 'tpl_ad_effectiveness',
    name: 'Ad Campaign Effectiveness',
    description: 'Measure campaign recall, impact on brand metrics, and ROI',
    category: 'Brand',
    questionTemplate: 'How effective is our advertising campaign at driving awareness and purchase intent?',
    isBuiltin: true,
    config: { industry: 'Marketing', methods: ['ab-testing', 'survey-design'] }
  },
  {
    id: 'tpl_nps_program',
    name: 'NPS Program Design',
    description: 'Design a Net Promoter Score program with transactional and relationship surveys',
    category: 'CX',
    questionTemplate: 'How do we set up an NPS program to track loyalty across customer segments?',
    isBuiltin: true,
    config: { industry: 'General', methods: ['nps', 'csat'] }
  },
  {
    id: 'tpl_competitive_intel',
    name: 'Competitive Intelligence Study',
    description: 'Research competitor strengths, weaknesses, and market positioning',
    category: 'Growth',
    questionTemplate: 'How do we compare to our top 3 competitors and where are the gaps we can exploit?',
    isBuiltin: true,
    config: { industry: 'General', methods: ['survey-design', 'focus-groups'] }
  },
  {
    id: 'tpl_concept_testing',
    name: 'Concept Testing',
    description: 'Test new product or feature concepts before development investment',
    category: 'Product',
    questionTemplate: 'Which product concept resonates most with our target audience and why?',
    isBuiltin: true,
    config: { industry: 'General', methods: ['conjoint-analysis', 'maxdiff', 'ab-testing'] }
  },
]

/**
 * Seed built-in templates into the database (idempotent)
 */
export async function seedBuiltinTemplates() {
  await initializeDatabase()

  for (const tpl of BUILTIN_TEMPLATES) {
    await query(
      `INSERT INTO templates (id, name, description, category, question_template, is_builtin, config)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         category = EXCLUDED.category,
         question_template = EXCLUDED.question_template,
         config = EXCLUDED.config,
         updated_at = NOW()`,
      [tpl.id, tpl.name, tpl.description, tpl.category, tpl.questionTemplate, true, JSON.stringify(tpl.config || {})]
    )
  }
}

/**
 * List all templates (built-in first, then custom)
 */
export async function listTemplates(category?: string) {
  await initializeDatabase()
  await seedBuiltinTemplates()

  let sql = `SELECT id, name, description, category, question_template, is_builtin, config, created_at
             FROM templates`
  const params: (string | boolean)[] = []

  if (category) {
    sql += ' WHERE category = $1'
    params.push(category)
  }

  sql += ' ORDER BY is_builtin DESC, created_at DESC'

  const result = await query(sql, params)
  return result.rows.map((row: Record<string, unknown>) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    questionTemplate: row.question_template,
    isBuiltin: row.is_builtin,
    config: row.config,
    createdAt: row.created_at,
  }))
}

/**
 * Get a single template
 */
export async function getTemplate(id: string) {
  await initializeDatabase()
  const result = await query('SELECT * FROM templates WHERE id = $1', [id])
  if (result.rows.length === 0) return null
  const row = result.rows[0]
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    questionTemplate: row.question_template,
    isBuiltin: row.is_builtin,
    config: row.config,
    createdAt: row.created_at,
  }
}

/**
 * Save a custom template (user-created)
 */
export async function saveTemplate(data: {
  name: string
  description: string
  category: string
  questionTemplate: string
  config?: Record<string, unknown>
}): Promise<string> {
  await initializeDatabase()
  const id = generateId()
  await query(
    `INSERT INTO templates (id, name, description, category, question_template, is_builtin, config)
     VALUES ($1, $2, $3, $4, $5, false, $6)`,
    [id, data.name, data.description, data.category, data.questionTemplate, JSON.stringify(data.config || {})]
  )
  return id
}

/**
 * Delete a custom template (cannot delete built-in)
 */
export async function deleteTemplate(id: string): Promise<boolean> {
  await initializeDatabase()
  const result = await query('DELETE FROM templates WHERE id = $1 AND is_builtin = false', [id])
  return (result.rowCount ?? 0) > 0
}
