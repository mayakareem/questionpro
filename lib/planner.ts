/**
 * Research Plan Generator (Planner)
 *
 * Builds comprehensive prompts for Claude to generate high-quality,
 * schema-aligned research plans based on user questions and retrieved context.
 *
 * The planner is responsible for:
 * - Constructing a detailed system prompt with expert persona and guidelines
 * - Building user prompts with retrieved methodology knowledge
 * - Instructing the LLM to return structured, actionable research plans
 * - Ensuring output aligns with ResearchPlan schema
 */

import type { RetrievedContext } from './retrieval'

/**
 * System prompt for Claude
 *
 * Establishes Claude as an expert research methodology advisor with deep
 * knowledge of QuestionPro and business decision-making.
 */
export const SYSTEM_PROMPT = `You are a research strategist advising business decision-makers who need data to make high-stakes calls about products, pricing, features, and go-to-market strategy.

# WHO YOU'RE ADVISING

Your typical user is:
- A VP of Product, CMO, Director of CX, Operations Manager, or Business Owner
- From banking, telecom, retail, hospitality, SaaS, government, or professional services
- Has $10K-$100K budget for research (not unlimited)
- Needs results in 2-8 weeks (not 6 months)
- Must present findings to skeptical executives who demand "proof"
- Is NOT a research PhD—they need plain English and clear next steps
- Often describes business PROBLEMS, not specific research questions

# THE FIVE BIG QUESTIONS RESEARCH ANSWERS

At the highest level, market research answers five business questions:

1. **What is happening?** (Measurement - quant surveys, tracking)
2. **Why is it happening?** (Exploration - qualitative, interviews, focus groups)
3. **Who is driving it?** (Segmentation, profiling)
4. **What should we do next?** (Optimization - conjoint, MaxDiff, concept testing)
5. **How do we track whether it worked?** (Tracking - brand tracking, CX tracking)

Your job is to translate their business problem into the right research question, then match it to the right methodology.

# YOUR JOB

Give them a research plan they can:
1. **Defend to their CFO** - "Here's why this costs $X and takes Y weeks"
2. **Execute using QuestionPro** - Step-by-step, no research agency needed
3. **Present to executives** - "Here's the one slide that shows what to do"
4. **Use to make million-dollar decisions** - With confidence and data backing

# CRITICAL REQUIREMENTS

Every recommendation MUST include:
- **Budget estimate**: QuestionPro panel costs ($8-15/complete), incentives, time costs
- **Realistic timeline**: Weeks needed with contingencies
- **Specific deliverables**: "You'll get a ranked list of 10 features with scores 0-100"
- **Risk mitigation**: "If results are inconclusive, here's Plan B"
- **Executive summary format**: "Here's how to present this to your CEO"

# HOW TO APPROACH QUESTIONS

## 1. Translate Problem to Decision

Users often describe problems, not decisions. Your first job is translation:

**Problem statement:** "Our branches have low NPS but we don't know why."
**Translation:** "You need to figure out whether the issue is staff behavior, process problems, environment, or something else—so you know where to invest in improvements."

**Problem statement:** "Younger customers don't seem interested in our brand."
**Translation:** "You're deciding whether to launch a youth-targeted product line, refresh messaging, or change channel strategy. You need to understand what younger customers actually value and whether they see you as relevant."

**Problem statement:** "We're launching a new product but unsure about pricing."
**Translation:** "You're deciding what price will maximize revenue without losing too many customers. You need to understand willingness to pay, price sensitivity, and which features justify premium pricing."

## 2. Restate Their REAL Business Decision

Bad: "You want to know about pricing."
Good: "You're deciding whether to raise your SaaS pricing from $99 to $149/mo. You need to know: (a) how many customers you'll lose, (b) whether revenue gain outweighs churn, and (c) which features justify the increase."

## 2. Recommend Methods Based on Constraints

- Don't recommend 6-month conjoint studies when they need results "by end of quarter"
- Don't recommend $75K multi-method approaches to startups
- If they say "quick" or "ASAP" → suggest faster methods even if less precise

## 3. Provide Specific Budget/Timeline

Example:
"This will cost $15-25K:
- QuestionPro panel: 400 respondents × $12 = $4,800
- Your time: 40 hours (survey design, analysis, reporting)
- Timeline: 3 weeks (1 week design, 1 week fielding, 1 week analysis)
- Risk buffer: Add 1 week if sample is hard to reach"

## 4. Give Them the Exec Presentation Template

"When you present to your CEO, lead with this slide:
- **Decision**: Should we raise price from $99 to $149?
- **Finding**: 72% of current customers will stay at $149 if we add features X, Y
- **Revenue impact**: +$2.1M ARR even with 15% churn
- **Recommendation**: Raise price, but bundle in features X and Y to justify increase"

# METHODOLOGY SELECTION FRAMEWORK

Use the explore/measure/observe/optimize/track framework to match methodology to question type:

## EXPLORE (Qualitative) - Understanding the "why"
**When to use:** Customer motivations are unknown, need to discover unmet needs, understand barriers
**Methods:** Exploratory interviews, focus groups
**Outputs:** Themes, quotes, journey maps, hypotheses
**Example:** "Why are customers churning?"

## MEASURE (Quantitative) - Understanding "how many" and "how much"
**When to use:** Need to quantify, measure at scale, compare segments, track trends
**Methods:** Surveys, brand tracking, CX tracking, concept testing
**Outputs:** Percentages, crosstabs, NPS scores, dashboards
**Example:** "What % of customers would buy this?"

## OBSERVE (Behavioral) - Understanding what actually happens
**When to use:** Need to verify reality, measure service delivery, check compliance
**Methods:** Mystery shopping
**Outputs:** Scorecards, compliance rates, location performance
**Example:** "Are our branches following service standards?"

## OPTIMIZE (Trade-off) - Making better decisions
**When to use:** Need to prioritize features, optimize pricing, find best bundle
**Methods:** Conjoint, MaxDiff, pricing research
**Outputs:** Feature rankings, optimal prices, simulations
**Example:** "Which features should we build first?"

## TRACK (Monitoring) - Watching change over time
**When to use:** Need ongoing insights, monitor brand health, track satisfaction
**Methods:** Brand tracking, CX tracking
**Outputs:** Trend lines, movement detection, early warning signals
**Example:** "Is brand awareness increasing?"

---

## Pricing Questions

"What should we charge?" →
- **Budget <$10K**: Van Westendorp (2 weeks, $5K) - gives you price range fast
- **Budget $15-30K**: Conjoint (4 weeks, $20K) - optimizes price + features together
- **Budget <$5K**: Quick survey with Gabor-Granger (2 weeks, $3K)

Decision rule: How much revenue is at stake? Spend 1-2% on research.

## Feature Prioritization

"Which features to build?" →
- **Simple choice** (3-5 features): MaxDiff (2 weeks, $8K) - gives clear ranking
- **Complex optimization** (price + features): Conjoint (4 weeks, $20K)
- **Early exploration**: Interviews (2 weeks, $5K) + MaxDiff validation

## Customer Experience / Churn

"Why are customers leaving?" →
- **Phase 1** (weeks 1-2): Interviews with churned customers (12-15 people, $5K)
- **Phase 2** (weeks 3-4): CX Driver Analysis survey (400 current customers, $10K)
- **Phase 3** (weeks 5-8): Fix issues, then validate with NPS tracking

## Brand Awareness

"How well-known are we?" →
- **Ongoing tracking**: Brand tracking survey (quarterly, 300/wave, $8K/wave)
- **One-time snapshot**: Brand awareness survey (500 people, $10K)

# QUESTIONPRO IMPLEMENTATION

Always provide:
1. Exact QuestionPro features to use ("Use the MaxDiff module in Research Edition")
2. Step-by-step numbered workflow
3. Sample size with rationale ("400 respondents gives you ±5% margin of error")
4. Timeline breakdown by phase
5. Data quality steps ("Add 2 attention check questions, remove speeders <50% median time")

# OUTPUT FORMAT

Structure your response with these 9 sections:

## 1. WHAT YOU'RE TRYING TO DECIDE
Clear restatement of their business decision (not just their question).

## 2. RESEARCH OBJECTIVE
What you need to learn to inform that decision.

## 3. RECOMMENDED METHODOLOGY
**IMPORTANT: Use EXACTLY this format for each method:**

- **[PRIMARY or SUPPORTING]** Method Name (e.g., "Exploratory In-Depth Interviews")
  - **Type:** Qualitative/Quantitative/Mixed
  - **Rationale:** Why this method fits this specific question
  - **Sample Size:** From methodology guide (e.g., "8-12 interviews" or "300-400 respondents")
  - **Timeline:** From methodology guide (e.g., "3-4 weeks")

**CRITICAL RULES:**
- If a methodology appears in the "PRIMARY RECOMMENDATIONS" section of the context, mark it as [PRIMARY]
- If a methodology appears in the "SECONDARY OPTIONS" section of the context, mark it as [SUPPORTING]
- Include the full methodology name (e.g., "Exploratory In-Depth Interviews" not just "Secondary")
- Always include Type, Sample Size, and Timeline for each method
- **Do NOT mark primary methodologies as secondary/supporting!**

## 4. WHY THESE METHODS FIT
Explain why these specific methods match this specific question.
Include: complexity match, budget fit, timeline fit.

## 5. HOW TO CONDUCT IN QUESTIONPRO
Detailed step-by-step workflow:
- QuestionPro plan required (Essential, Advanced, Research, or CX Edition)
- Numbered steps
- Sample size recommendation
- **Timeline estimate (IMPORTANT: Use realistic timelines from methodology guides)**
  - For 200-400 sample surveys: 2-4 weeks total (1-2 weeks data collection, 1-2 weeks analysis)
  - For qualitative interviews (8-12): 3-4 weeks total
  - For segmentation studies: 8-12 weeks
  - **Never suggest timelines longer than what's stated in the methodology files**
- Cost estimate

## 6. WHAT OUTPUTS YOU'LL SEE
Be specific: "You'll receive:
- Feature ranking (scores 0-100)
- Statistical significance testing
- Segment breakdowns (enterprise vs SMB)
- Top 3 features account for 68% of total importance"

## 7. WHAT DECISION THESE OUTPUTS SUPPORT
Explicit connection: "With this data, you can:
- Confidently prioritize Feature A for Q2 (score: 82)
- Deprioritize Features D, E, F (scores <30)
- Justify resource allocation to your exec team"

## 8. ASSUMPTIONS
What you're assuming:
- Budget: "Assuming $15-25K research budget"
- Timeline: "Assuming 4-week timeline is acceptable"
- Audience: "Assuming you can reach 400 target customers"
- Authority: "Assuming research will inform but not dictate decision"

## 9. CAVEATS
Honest limitations:
- "What people say ≠ what they do - validate with pilot test"
- "Sample represents your customers, not entire market"
- "If executives have already decided, research won't change minds"
- "Results valid for 6-12 months, then re-test if market changes"

# TONE AND STYLE

Write like a trusted advisor, not a textbook:
- ✅ "This will cost $15K and take 3 weeks because..."
- ❌ "The methodology requires appropriate sample sizes"

- ✅ "Your CEO will want to see proof this works - here's how to show it"
- ❌ "Stakeholder communication is important"

- ✅ "If results are unclear, run follow-up interviews with 8-10 people ($2K)"
- ❌ "Additional research may be warranted"

# WHAT SUCCESS LOOKS LIKE

After reading your research plan, the user should:
1. Know exactly what to do next ("Log into QuestionPro, go to MaxDiff module...")
2. Know what it will cost and how long it takes
3. Know what they'll get ("ranked list with scores")
4. Know how to present it to their boss
5. Feel confident they can execute this themselves

You're not writing a research methodology textbook. You're helping a business professional make a better decision using data.`

/**
 * Build user prompt with question and retrieved context
 *
 * Combines user question with methodology knowledge, QuestionPro documentation,
 * and examples to create a comprehensive prompt for Claude.
 */
export function buildUserPrompt(
  question: string,
  context: RetrievedContext
): string {
  const sections: string[] = []

  // Introduction
  sections.push('# RESEARCH QUESTION\n')
  sections.push(`The user has asked the following research question:\n`)
  sections.push(`> "${question}"\n`)
  sections.push('Please analyze this question and provide a comprehensive research plan.\n')

  // Methodology Knowledge
  sections.push('---\n')
  sections.push('# AVAILABLE METHODOLOGIES\n')
  sections.push(
    'Based on the question, these methodologies have been identified as potentially relevant:\n'
  )

  // Primary methodologies
  if (context.methodologies.filter(m => m.isPrimary).length > 0) {
    sections.push('\n## PRIMARY RECOMMENDATIONS (Most Likely to Fit)\n')
    context.methodologies
      .filter(m => m.isPrimary)
      .forEach(method => {
        sections.push(`\n### ${formatMethodName(method.id)}\n`)
        sections.push(method.content)
        sections.push('\n')
      })
  }

  // Secondary methodologies
  if (context.methodologies.filter(m => !m.isPrimary).length > 0) {
    sections.push('\n## SECONDARY OPTIONS (Consider If Appropriate)\n')
    context.methodologies
      .filter(m => !m.isPrimary)
      .forEach(method => {
        sections.push(`\n### ${formatMethodName(method.id)}\n`)
        sections.push(method.content)
        sections.push('\n')
      })
  }

  // QuestionPro Implementation Guidance
  sections.push('---\n')
  sections.push('# QUESTIONPRO PLATFORM GUIDANCE\n')
  sections.push(
    'Use this information to provide accurate, platform-specific implementation steps:\n'
  )

  if (context.questionProWorkflows) {
    sections.push('\n## Workflows\n')
    sections.push(context.questionProWorkflows)
    sections.push('\n')
  }

  if (context.questionProCapabilities) {
    sections.push('\n## Capabilities\n')
    sections.push(context.questionProCapabilities)
    sections.push('\n')
  }

  if (context.questionProOutputs) {
    sections.push('\n## Expected Outputs\n')
    sections.push(context.questionProOutputs)
    sections.push('\n')
  }

  // Examples (if included)
  if (context.examples.length > 0) {
    sections.push('---\n')
    sections.push('# EXAMPLE RESEARCH PLANS\n')
    sections.push(
      'Use these as reference for the structure, depth, and quality expected:\n'
    )
    context.examples.forEach((example, idx) => {
      sections.push(`\n## Example Set ${idx + 1}\n`)
      sections.push(example)
      sections.push('\n')
    })
  }

  // Instructions for response
  sections.push('---\n')
  sections.push('# YOUR RESPONSE\n')
  sections.push('Please provide a comprehensive research plan with the following sections:\n\n')

  sections.push('## 1. WHAT YOU\'RE TRYING TO DECIDE\n')
  sections.push(
    'Clearly restate the business decision or question. Be specific about the outcome they need.\n\n'
  )

  sections.push('## 2. RESEARCH OBJECTIVE\n')
  sections.push(
    'Define the specific research goal that will inform the decision. Focus on what needs to be learned, not the method.\n\n'
  )

  sections.push('## 3. RECOMMENDED METHODOLOGY\n')
  sections.push(
    'List 1-3 research methods that fit this question. For each method, state whether it is primary or supporting.\n\n'
  )

  sections.push('## 4. WHY THESE METHODS FIT\n')
  sections.push(
    'Explain why each recommended method is appropriate for this objective. Connect method strengths to the specific decision need. Be concise but substantive.\n\n'
  )

  sections.push('## 5. HOW TO CONDUCT IN QUESTIONPRO\n')
  sections.push(
    'Provide step-by-step guidance for executing the research using QuestionPro features:\n'
  )
  sections.push('- Be specific about which tools/modules to use\n')
  sections.push('- Include key configuration details\n')
  sections.push('- Mention sample size guidance with rationale\n')
  sections.push('- Provide timeline estimates (design, fielding, analysis)\n')
  sections.push('- Use numbered steps for clarity\n\n')

  sections.push('## 6. WHAT OUTPUTS YOU\'LL SEE\n')
  sections.push(
    'List the specific deliverables and data the user will receive:\n'
  )
  sections.push(
    '- Be concrete (e.g., "NPS score from -100 to +100" not just "scores")\n'
  )
  sections.push('- Include dashboards, reports, metrics, and insights\n')
  sections.push('- Provide examples of what the data looks like\n\n')

  sections.push('## 7. WHAT DECISION THESE OUTPUTS SUPPORT\n')
  sections.push(
    'Explicitly connect the outputs back to the original decision:\n'
  )
  sections.push('- Show how the data enables action\n')
  sections.push('- Be specific about what they can decide with this information\n')
  sections.push('- Include next steps and success criteria\n\n')

  sections.push('## 8. ASSUMPTIONS\n')
  sections.push('List key assumptions you are making:\n')
  sections.push('- About the target audience\n')
  sections.push('- About budget and resources\n')
  sections.push('- About timeline and urgency\n')
  sections.push('- About access to respondents\n\n')

  sections.push('## 9. CAVEATS\n')
  sections.push('Acknowledge limitations:\n')
  sections.push('- What this research will NOT tell them\n')
  sections.push('- Methodological limitations\n')
  sections.push('- Risks or potential issues\n')
  sections.push('- When they should use a different approach\n\n')

  sections.push('---\n')
  sections.push('# IMPORTANT REMINDERS\n\n')

  sections.push('**Quality over quantity:**\n')
  sections.push('- Focus on 1-2 primary methods for most questions\n')
  sections.push('- Add supporting methods only if they add clear value\n')
  sections.push('- Don\'t over-complicate simple questions\n\n')

  sections.push('**Be specific:**\n')
  sections.push('- Include numbers (sample sizes, timelines, scores)\n')
  sections.push('- Reference actual QuestionPro features by name\n')
  sections.push('- Provide realistic estimates\n\n')

  sections.push('**Be practical:**\n')
  sections.push('- Focus on what\'s implementable\n')
  sections.push('- Acknowledge trade-offs\n')
  sections.push('- Think about the end-user\'s constraints\n\n')

  sections.push('**Be honest:**\n')
  sections.push('- Don\'t oversell what the research can deliver\n')
  sections.push('- Surface assumptions and limitations\n')
  sections.push('- Recommend alternative approaches if this isn\'t the right fit\n\n')

  sections.push('Begin your research plan now.\n')

  return sections.join('\n')
}

/**
 * Format methodology ID into readable name
 */
function formatMethodName(methodId: string): string {
  return methodId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Build complete prompt for Claude
 *
 * Combines system prompt and user prompt into a single structure
 * ready for the Anthropic API.
 */
export function buildPrompt(
  question: string,
  context: RetrievedContext
): {
  system: string
  user: string
  metadata: {
    methodsIncluded: string[]
    questionProDocsIncluded: boolean
    examplesIncluded: boolean
    retrievedAt: Date
  }
} {
  return {
    system: SYSTEM_PROMPT,
    user: buildUserPrompt(question, context),
    metadata: {
      methodsIncluded: context.methodologies.map(m => m.id),
      questionProDocsIncluded:
        !!context.questionProWorkflows ||
        !!context.questionProCapabilities ||
        !!context.questionProOutputs,
      examplesIncluded: context.examples.length > 0,
      retrievedAt: context.metadata.retrievedAt
    }
  }
}

/**
 * Build lightweight prompt (for faster responses)
 *
 * Excludes examples and secondary methods to reduce token count.
 * Useful when speed > comprehensive depth.
 */
export function buildLightweightPrompt(
  question: string,
  context: RetrievedContext
): {
  system: string
  user: string
} {
  // Filter to only primary methodologies
  const lightweightContext: RetrievedContext = {
    ...context,
    methodologies: context.methodologies.filter(m => m.isPrimary),
    examples: [] // Exclude examples
  }

  return {
    system: SYSTEM_PROMPT,
    user: buildUserPrompt(question, lightweightContext)
  }
}

/**
 * Validate prompt token count
 *
 * Estimates token count and warns if it exceeds recommended limits.
 * Rough estimation: 1 token ≈ 4 characters for English text.
 *
 * @param prompt - The full prompt object
 * @returns Token count estimate and warning if needed
 */
export function estimateTokens(prompt: { system: string; user: string }): {
  estimatedTokens: number
  warning?: string
} {
  const totalChars = prompt.system.length + prompt.user.length
  const estimatedTokens = Math.ceil(totalChars / 4)

  let warning: string | undefined

  // Claude 3.5 Sonnet has 200K context window
  // Leave room for response (~8K tokens)
  const MAX_PROMPT_TOKENS = 180000

  if (estimatedTokens > MAX_PROMPT_TOKENS) {
    warning = `Prompt is very large (${estimatedTokens} tokens). Consider using lightweight mode or fewer methodologies.`
  } else if (estimatedTokens > 100000) {
    warning = `Prompt is large (${estimatedTokens} tokens). Response time may be slower.`
  }

  return {
    estimatedTokens,
    warning
  }
}

/**
 * FUTURE ENHANCEMENTS:
 *
 * 1. DYNAMIC PROMPT CONSTRUCTION
 *    - Adjust prompt structure based on question complexity
 *    - Simple questions get shorter, more direct prompts
 *    - Complex questions get comprehensive guidance
 *
 * 2. INDUSTRY-SPECIFIC PROMPTS
 *    - Inject industry context and terminology
 *    - Reference industry-specific examples
 *    - Adjust methodology priorities by industry
 *
 * 3. PERSONA ADAPTATION
 *    - Adjust tone based on user role (executive, researcher, PM)
 *    - Tailor depth based on research expertise level
 *
 * 4. MULTI-TURN CONVERSATIONS
 *    - Include previous conversation context
 *    - Reference prior recommendations
 *    - Build on earlier questions
 *
 * 5. STRUCTURED OUTPUT ENFORCEMENT
 *    - Use Claude's JSON mode for schema compliance
 *    - Add examples of properly formatted JSON
 *    - Validate structure before returning
 *
 * 6. ITERATIVE REFINEMENT
 *    - Include "refine my recommendation" prompts
 *    - Support follow-up questions
 *    - Allow methodology swapping
 *
 * 7. COST OPTIMIZATION
 *    - Track token usage per query
 *    - Optimize retrieval based on cost/quality tradeoff
 *    - Cache expensive prompt components
 *
 * 8. A/B TEST PROMPTS
 *    - Test different system prompts
 *    - Measure quality metrics (user satisfaction, clarity)
 *    - Iterate based on performance
 */

/**
 * Example Usage:
 *
 * ```typescript
 * import { buildPrompt, estimateTokens } from './lib/planner'
 * import { retrieveContext } from './lib/retrieval'
 *
 * // Retrieve relevant context
 * const question = "What should we charge for our new premium tier?"
 * const context = await retrieveContext(question)
 *
 * // Build prompt
 * const prompt = buildPrompt(question, context)
 *
 * // Check token count
 * const { estimatedTokens, warning } = estimateTokens(prompt)
 * console.log(`Prompt size: ${estimatedTokens} tokens`)
 * if (warning) console.warn(warning)
 *
 * // Send to Claude
 * const response = await anthropic.messages.create({
 *   model: 'claude-sonnet-4-6',
 *   max_tokens: 8000,
 *   system: prompt.system,
 *   messages: [{ role: 'user', content: prompt.user }]
 * })
 * ```
 */
