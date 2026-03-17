# Phase 2: External Market Intelligence Integration

## Design Philosophy

**Core Principle**: Methodology integrity comes first. External intelligence enhances context but never overrides research best practices.

---

## Architecture Overview

### Current (Phase 1) Flow
```
User Question
  → Method Router (rule-based)
  → Knowledge Retrieval (filesystem)
  → Planner (generates plan with internal knowledge)
  → Response
```

### Proposed (Phase 2) Flow
```
User Question
  → Method Router (rule-based)
  → Knowledge Retrieval (filesystem) [PRIMARY]
  → Context Enrichment Engine [SECONDARY]
      ├─ Detect enrichment needs
      ├─ Fetch external intelligence (if relevant)
      ├─ Validate & filter
      └─ Package as "market context"
  → Planner (combines internal + external)
      ├─ Internal knowledge = methodology foundation
      └─ External context = market-specific examples
  → Response
```

---

## Safe Architecture Design

### 1. Separation of Concerns

**Primary Layer (Unchanged)**
- File: `lib/planner.ts`
- Role: Methodology recommendations, QuestionPro workflows, cost/timeline guidance
- Source: Internal knowledge files (100% controlled)

**Secondary Layer (New)**
- File: `lib/enrichment-engine.ts`
- Role: Market context, competitor examples, industry benchmarks
- Source: External APIs (web search, company databases)

**Key Principle**: External data is ALWAYS clearly labeled and separated from methodology advice.

### 2. Request Flow

```typescript
// Step 1: Core methodology planning (same as Phase 1)
const coreContext = await retrieveContext(question)
const coreMethodologies = coreContext.methodologies

// Step 2: Enrichment (NEW - only if relevant)
const enrichmentNeeds = detectEnrichmentNeeds(question, coreMethodologies)
const externalContext = enrichmentNeeds.shouldEnrich
  ? await fetchExternalContext(enrichmentNeeds)
  : null

// Step 3: Combined planning
const prompt = buildPrompt({
  system: SYSTEM_PROMPT,  // Same as Phase 1
  coreKnowledge: coreContext,  // Primary
  marketContext: externalContext,  // Secondary, clearly labeled
  question: question
})
```

---

## What Gets Enriched (Use Cases)

### ✅ Good Use Cases for External Intelligence

1. **Industry Benchmarks**
   - Question: "What should we charge for our SaaS product?"
   - Enrichment: Fetch pricing benchmarks for SaaS products in that vertical
   - Example: "Market data shows B2B SaaS tools in HR tech typically range $50-200/user/month"

2. **Competitor Examples**
   - Question: "Which features should we prioritize?"
   - Enrichment: Identify top 3 competitors and their feature sets
   - Example: "Your competitors (Qualtrics, SurveyMonkey, Typeform) all prioritize X, Y, Z"

3. **Market Trends**
   - Question: "Should we invest in AI-powered analytics?"
   - Enrichment: Research adoption rates of AI in survey tools
   - Example: "65% of enterprise survey platforms added AI features in 2024-2025"

4. **Sample Size Validation**
   - Question: "Testing pricing with enterprise customers"
   - Enrichment: Market size data for enterprise segment
   - Example: "Your addressable market is ~5,000 companies, so 300-sample recommendation is 6% penetration"

5. **Timeline Reality Checks**
   - Question: "When can we launch this research?"
   - Enrichment: Industry hiring/fieldwork timelines
   - Example: "Holiday season (Nov-Dec) typically adds 2-3 weeks to panel fielding"

### ❌ Bad Use Cases (Never Enrich These)

1. **Methodology Selection** - Always use internal rules
2. **QuestionPro Workflows** - Only from controlled knowledge base
3. **Statistical Validity** - Only from research best practices docs
4. **Budget Estimates** - Only from internal cost models

---

## Technical Architecture

### Components to Build

#### 1. Enrichment Engine (`lib/enrichment-engine.ts`)

```typescript
export interface EnrichmentRequest {
  question: string
  selectedMethodologies: string[]
  detectedIndustry?: string
  detectedCompetitors?: string[]
  userContext?: {
    companySize?: string
    vertical?: string
  }
}

export interface ExternalContext {
  type: 'benchmark' | 'competitor' | 'trend' | 'market-size'
  source: string  // e.g., "web-search-2024-03-17"
  confidence: 'high' | 'medium' | 'low'
  data: {
    summary: string
    examples?: string[]
    numbers?: { metric: string, value: string, source: string }[]
  }
  rawSources: string[]  // URLs for transparency
  retrievedAt: string
}

export interface EnrichmentResponse {
  contexts: ExternalContext[]
  metadata: {
    queriesExecuted: number
    totalRetrievalTimeMs: number
    cached: boolean
  }
}

// Detect if enrichment would add value
export function detectEnrichmentNeeds(
  question: string,
  methodologies: string[]
): { shouldEnrich: boolean, reasons: string[], types: string[] }

// Fetch external intelligence
export async function fetchExternalContext(
  request: EnrichmentRequest
): Promise<EnrichmentResponse>

// Validate and filter external data
export function validateExternalContext(
  context: ExternalContext
): { valid: boolean, issues?: string[] }
```

#### 2. Enrichment Detector (`lib/enrichment-detector.ts`)

```typescript
// Detects patterns that benefit from external context
export const ENRICHMENT_TRIGGERS = {
  // Industry/vertical mentions
  industryMentions: ['saas', 'healthcare', 'fintech', 'retail', 'b2b', 'b2c', 'enterprise'],

  // Competitive context
  competitorSignals: ['competitor', 'market leader', 'vs', 'compared to', 'industry standard'],

  // Pricing/benchmark questions
  pricingSignals: ['charge', 'price', 'pricing', 'cost to customer', 'willingness to pay'],

  // Market sizing
  marketSignals: ['market size', 'tam', 'addressable market', 'how many customers'],

  // Trend questions
  trendSignals: ['trend', 'popular', 'growing', 'declining', 'future of']
}

export function detectEnrichmentNeeds(
  question: string,
  methodologies: Methodology[]
): EnrichmentNeeds {
  const normalized = question.toLowerCase()

  const needs: EnrichmentNeeds = {
    shouldEnrich: false,
    reasons: [],
    types: []
  }

  // Check for industry context
  if (ENRICHMENT_TRIGGERS.industryMentions.some(term => normalized.includes(term))) {
    needs.reasons.push('Industry-specific context detected')
    needs.types.push('benchmark')
  }

  // Check for competitor context
  if (ENRICHMENT_TRIGGERS.competitorSignals.some(term => normalized.includes(term))) {
    needs.reasons.push('Competitive intelligence requested')
    needs.types.push('competitor')
  }

  // Only enrich if we have valid reasons
  needs.shouldEnrich = needs.types.length > 0

  return needs
}
```

#### 3. Web Research Service (`lib/services/web-research.ts`)

```typescript
import Anthropic from '@anthropic-ai/sdk'

export interface WebResearchQuery {
  query: string
  maxResults: number
  timeRange?: 'day' | 'week' | 'month' | 'year'
}

export interface WebResearchResult {
  title: string
  url: string
  snippet: string
  publishedDate?: string
  relevanceScore: number
}

// Use Claude Code's WebSearch tool or external APIs
export async function searchWeb(
  query: WebResearchQuery
): Promise<WebResearchResult[]> {
  // Implementation using web search API
  // Returns structured results
}

// Use LLM to synthesize search results into structured insights
export async function synthesizeResearchResults(
  results: WebResearchResult[],
  originalQuestion: string,
  anthropic: Anthropic
): Promise<ExternalContext> {
  const synthesisPrompt = `You are a research analyst synthesizing web search results.

ORIGINAL QUESTION: ${originalQuestion}

SEARCH RESULTS:
${results.map((r, i) => `${i + 1}. ${r.title}\n   ${r.snippet}\n   Source: ${r.url}`).join('\n\n')}

Extract ONLY factual, verifiable information relevant to the question.

Return JSON:
{
  "summary": "2-3 sentence summary of key findings",
  "numbers": [
    {"metric": "metric name", "value": "value with unit", "source": "URL"}
  ],
  "examples": ["example 1", "example 2"],
  "confidence": "high|medium|low"
}

Rules:
- If data is contradictory, mark confidence as "low"
- If data is recent (<6 months), mark confidence as "high"
- Only include numbers with clear sources
- Mark as "medium" confidence if sources are blogs (not research reports)
`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    temperature: 0.3,  // Lower temperature for factual synthesis
    messages: [{
      role: 'user',
      content: synthesisPrompt
    }]
  })

  // Parse and structure response
  // Return ExternalContext object
}
```

#### 4. Caching Layer (`lib/enrichment-cache.ts`)

```typescript
// Simple file-based cache to avoid repeated API calls
export interface CacheEntry {
  key: string
  data: ExternalContext[]
  createdAt: string
  expiresAt: string
}

// Cache external data for 24 hours
export async function getCachedContext(
  key: string
): Promise<ExternalContext[] | null>

export async function setCachedContext(
  key: string,
  data: ExternalContext[],
  ttlHours: number = 24
): Promise<void>

// Generate cache key from question + methodologies
export function generateCacheKey(
  question: string,
  methodologies: string[]
): string {
  const normalized = question.toLowerCase().trim()
  const hash = createHash('md5').update(normalized + methodologies.join(',')).digest('hex')
  return `enrichment_${hash}`
}
```

---

## Prompt Engineering Changes

### Updated System Prompt

Add this section to `SYSTEM_PROMPT` in `lib/planner.ts`:

```typescript
# EXTERNAL MARKET CONTEXT (When Available)

You may receive SUPPLEMENTARY market intelligence from external sources:
- Industry benchmarks (pricing, sample sizes, timelines)
- Competitor examples (features, methodologies they use)
- Market trends (adoption rates, emerging practices)

**CRITICAL RULES FOR EXTERNAL DATA:**

1. **Methodology Primacy**
   - NEVER let external data override research best practices
   - If external data conflicts with methodology, trust methodology
   - Example: External source says "50 users is enough" but MaxDiff needs 200+ → recommend 200+

2. **Clear Attribution**
   - Always cite external data with source and date
   - Mark confidence level (high/medium/low)
   - Example: "Market data (SaaS Benchmarks Report, March 2024) shows..."

3. **Contextualize, Don't Prescribe**
   - Use external data to provide examples, not directives
   - Example: ✅ "For context, Qualtrics charges $X-Y for similar research"
   - Example: ❌ "You should charge $X because competitors do"

4. **Acknowledge Uncertainty**
   - If confidence is "low", explicitly warn the user
   - If data is old (>1 year), mention it may be outdated
   - If contradictory, present both sides

**FORMAT FOR EXTERNAL CONTEXT:**

When you include external data in your response, format it as:

```
📊 MARKET CONTEXT (External Intelligence)

[Type: Pricing Benchmark | Confidence: High | Source: SaaS Pricing Study 2024]

Finding: B2B survey tools in healthcare typically charge $150-300/user/month for enterprise plans.

Examples:
- Qualtrics Healthcare: $250/user/month (enterprise)
- Verint Patient Feedback: $180/user/month (mid-market)

Note: This is market context to inform your decision, not a prescription. Your research should validate pricing for YOUR specific value proposition.
```

5. **When to Ignore External Data**
   - If it's not recent enough (>2 years old for fast-moving markets)
   - If confidence is "low" and contradicts methodology
   - If source is not credible (blogs, forums, anonymous)
```

### Updated Planner Prompt Template

Modify `buildPrompt()` in `lib/planner.ts`:

```typescript
export function buildPrompt(
  question: string,
  context: RetrievedContext,
  externalContext?: ExternalContext[] | null
): { system: string, user: string } {

  const userPrompt = `
USER QUESTION:
${question}

INTERNAL KNOWLEDGE (Primary - Always Trust This):
${context.methodologies.map(m => `
## ${m.metadata.name}
${m.content}
`).join('\n')}

${externalContext && externalContext.length > 0 ? `
EXTERNAL MARKET CONTEXT (Secondary - Use for Examples Only):

${externalContext.map(ctx => `
### ${ctx.type.toUpperCase()} | Confidence: ${ctx.confidence} | Source: ${ctx.source}

${ctx.data.summary}

${ctx.data.numbers && ctx.data.numbers.length > 0 ? `
Numbers:
${ctx.data.numbers.map(n => `- ${n.metric}: ${n.value} (${n.source})`).join('\n')}
` : ''}

${ctx.data.examples && ctx.data.examples.length > 0 ? `
Examples:
${ctx.data.examples.map(e => `- ${e}`).join('\n')}
` : ''}

Retrieved: ${ctx.retrievedAt}
Raw Sources: ${ctx.rawSources.join(', ')}
`).join('\n\n')}

REMINDER: External context is supplementary. Your methodology recommendations must be based on research best practices from INTERNAL KNOWLEDGE, not external benchmarks.
` : ''}

Generate a research plan following the 9-section structure defined in the system prompt.
`

  return {
    system: SYSTEM_PROMPT,
    user: userPrompt
  }
}
```

---

## Risk Analysis & Mitigation

### Risk 1: Hallucination Amplification
**Threat**: External web data may contain incorrect info that LLM treats as fact.

**Mitigation**:
- ✅ **Confidence scoring**: Mark all external data with confidence levels
- ✅ **Source attribution**: Always include URLs for fact-checking
- ✅ **Prompt guardrails**: Explicit instruction to flag contradictions
- ✅ **Validation layer**: Check for contradictory claims before including
- ✅ **Human review flag**: If confidence < medium, warn user to verify

### Risk 2: Methodology Corruption
**Threat**: External "best practices" override sound research methodology.

**Mitigation**:
- ✅ **Separation in prompt**: Label internal knowledge as "PRIMARY" and external as "SECONDARY"
- ✅ **Conflict detection**: If external data contradicts methodology, flag it
- ✅ **Explicit hierarchy**: System prompt states methodology always wins
- ✅ **Testing**: Evaluation suite includes adversarial external data

### Risk 3: Stale Data
**Threat**: Cached external data becomes outdated.

**Mitigation**:
- ✅ **TTL**: Cache expires after 24 hours
- ✅ **Timestamp display**: Show retrieval date to user
- ✅ **Freshness checks**: Prefer sources <6 months old
- ✅ **Version tracking**: Log when data was fetched

### Risk 4: API Costs
**Threat**: External API calls (web search, synthesis) add significant cost.

**Mitigation**:
- ✅ **Selective enrichment**: Only enrich when high value (not every question)
- ✅ **Caching**: 24-hour cache prevents repeated calls
- ✅ **Rate limiting**: Max 3 web searches per request
- ✅ **User control**: Optional flag to disable enrichment

### Risk 5: Latency
**Threat**: Fetching external data slows response time.

**Mitigation**:
- ✅ **Async enrichment**: Fetch external data in parallel with internal retrieval
- ✅ **Timeout**: 5-second max for external calls
- ✅ **Graceful degradation**: If external fails, continue with internal only
- ✅ **Progressive disclosure**: Return core plan first, then append market context

### Risk 6: Privacy/Compliance
**Threat**: Sending user questions to external APIs may leak sensitive info.

**Mitigation**:
- ✅ **Query sanitization**: Strip company names, internal project names
- ✅ **User consent**: Opt-in checkbox "Enhance with market intelligence"
- ✅ **Audit log**: Track what was sent to external APIs
- ✅ **Anonymization**: Generic queries only (e.g., "SaaS pricing benchmarks" not "Acme Corp pricing")

---

## Implementation Roadmap

### Phase 2.1: Foundation (Week 1-2)
**Goal**: Basic enrichment infrastructure without external APIs

**Tasks**:
1. Create `lib/enrichment-detector.ts`
   - Implement trigger detection
   - Add unit tests for 20 test questions
   - Verify it correctly identifies enrichment opportunities

2. Create `lib/enrichment-engine.ts` (stub)
   - Define interfaces
   - Implement mock enrichment (returns fake data)
   - Test integration with planner

3. Update `lib/planner.ts`
   - Add external context parameter
   - Update prompt template
   - Add clear labeling for external data

4. Add evaluation tests
   - Test with mock external data
   - Verify methodology isn't corrupted
   - Verify external data is properly attributed

**Deliverable**: System that detects when to enrich and formats external data correctly (using mocked data).

**Risk**: Low - no external APIs yet

---

### Phase 2.2: Web Search Integration (Week 3-4)
**Goal**: Real web search, human-verified synthesis

**Tasks**:
1. Create `lib/services/web-research.ts`
   - Integrate web search API (Tavily, Serper, or Brave Search)
   - Implement search result filtering
   - Add deduplication logic

2. Implement synthesis
   - Use Claude to extract structured insights from search results
   - Lower temperature (0.3) for factual accuracy
   - Return confidence scores

3. Add caching layer `lib/enrichment-cache.ts`
   - File-based cache (`.enrichment-cache/` directory)
   - 24-hour TTL
   - Cache key generation

4. Testing with real queries
   - Start with 10 safe test queries
   - Human review all synthesized results
   - Tune synthesis prompt based on quality

**Deliverable**: Working web search → synthesis → structured context pipeline.

**Risk**: Medium - requires API key and cost monitoring

---

### Phase 2.3: Validation & Safety (Week 5)
**Goal**: Prevent bad external data from corrupting responses

**Tasks**:
1. Implement validation layer
   - Check for contradictions within external data
   - Check for conflicts with internal methodology
   - Flag low-confidence sources

2. Add conflict detection
   - If external says "50 respondents OK" but methodology says "200 minimum", flag it
   - Show warning in response: "⚠️ External benchmark conflicts with research best practices"

3. Implement progressive disclosure
   - Return core methodology plan first
   - Append market context as optional section
   - User can expand/collapse

4. Add opt-in control
   - Checkbox in UI: "Include market intelligence"
   - Default: OFF (only internal knowledge)
   - User explicitly enables enrichment

**Deliverable**: Robust safety guardrails preventing methodology corruption.

**Risk**: Low - safety layer only

---

### Phase 2.4: Specialized Enrichments (Week 6-8)
**Goal**: High-value enrichment types

**Tasks**:
1. **Pricing Benchmarks**
   - Query: "SaaS pricing [vertical]"
   - Sources: Public pricing pages, SaaS pricing reports
   - Output: Price ranges by tier

2. **Competitor Analysis**
   - Query: "Top survey tools [vertical]"
   - Sources: G2, Capterra, product websites
   - Output: Competitor list with key features

3. **Market Sizing**
   - Query: "Market size [product category] [geography]"
   - Sources: Industry reports, analyst firms
   - Output: TAM/SAM estimates with sources

4. **Trend Analysis**
   - Query: "Adoption rates [technology] in [industry]"
   - Sources: Tech blogs, analyst reports, LinkedIn surveys
   - Output: Trend direction + adoption %

**Deliverable**: 4 specialized enrichment types with high accuracy.

**Risk**: Medium - requires careful source selection

---

### Phase 2.5: Polish & Optimization (Week 9-10)
**Goal**: Production-ready enrichment system

**Tasks**:
1. Performance optimization
   - Parallel external calls
   - Reduce synthesis token usage
   - Optimize cache hits

2. Error handling
   - Graceful degradation if APIs fail
   - Retry logic for transient failures
   - User-friendly error messages

3. Monitoring & logging
   - Track enrichment hit rate
   - Monitor external API costs
   - Log synthesis quality scores

4. Documentation
   - User guide: "When market intelligence adds value"
   - Developer docs: "Adding new enrichment types"
   - Examples: "Before/after with enrichment"

**Deliverable**: Production-ready Phase 2 with docs and monitoring.

**Risk**: Low - polish only

---

## Tools Needed

### 1. Web Search API
**Options** (ranked by quality):

**Option A: Tavily AI Search** (Recommended)
- Pros: Built for AI apps, returns structured data, filters low-quality sources
- Cost: $0.002-0.005 per search
- API: https://tavily.com

**Option B: Serper.dev**
- Pros: Fast, Google-backed results, affordable
- Cost: $0.001 per search
- API: https://serper.dev

**Option C: Brave Search API**
- Pros: Privacy-focused, no tracking
- Cost: $0.0005 per search
- API: https://brave.com/search/api/

**Recommended**: Start with Tavily (best for AI synthesis), fall back to Serper for cost savings.

### 2. Company/Competitor Database
**Options**:

**Option A: Crunchbase API** (For competitor intelligence)
- Data: Company info, funding, employee count, tech stack
- Cost: $99-299/month
- Use: Competitor identification

**Option B: BuiltWith API** (For tech stack)
- Data: Technologies used by websites
- Cost: $295/month
- Use: "What survey tools do competitors use?"

**Recommended**: Start without this (use web search), add later if needed.

### 3. Market Data APIs
**Options**:

**Option A: Statista API** (Market sizing)
- Data: Industry statistics, market sizes
- Cost: Enterprise pricing (expensive)
- Use: TAM/SAM estimates

**Recommended**: Skip for now - web search sufficient for Phase 2.1-2.3.

### 4. Caching & Storage
**Current Setup**: File-based cache in `.enrichment-cache/`

**Future**: Redis for production (faster, distributed)

---

## Example: Before vs. After Enrichment

### Question
"What should we charge for our B2B SaaS product that helps HR teams run employee surveys?"

### Phase 1 Response (Current)
```
RECOMMENDED METHOD:
- Budget <$10K: Van Westendorp (2-3 weeks, $5-8K)
- Budget $15-30K: Conjoint (4-6 weeks, $20-35K)

VAN WESTENDORP APPROACH:
Cost: $5,500-7,000
Timeline: 3 weeks
Sample: 300 respondents

You'll get:
- Optimal price point
- Acceptable range
- Price floor/ceiling

[...QuestionPro workflow...]
```

### Phase 2 Response (With Enrichment)
```
RECOMMENDED METHOD:
- Budget <$10K: Van Westendorp (2-3 weeks, $5-8K)
- Budget $15-30K: Conjoint (4-6 weeks, $20-35K)

VAN WESTENDORP APPROACH:
Cost: $5,500-7,000
Timeline: 3 weeks
Sample: 300 respondents

You'll get:
- Optimal price point
- Acceptable range
- Price floor/ceiling

[...QuestionPro workflow...]

---

📊 MARKET CONTEXT (External Intelligence)

[Type: Pricing Benchmark | Confidence: High | Source: SaaS Pricing 2025 Report]

Finding: B2B HR survey tools typically charge $8-25 per employee/month for mid-market (100-1000 employees) and $150-400/user/month for enterprise admin seats.

Examples:
- Culture Amp: $3,600/year for 150 employees (~$2/employee/month)
- Officevibe: $5/employee/month (mid-market)
- Qualtrics EmployeeXM: $200/user/month (enterprise admin)

Pricing Models:
- Per-employee: Common for companies <500 employees
- Per-admin + employee tier: Common for enterprise (1000+ employees)
- Per-survey: Less common, typically $500-2000/survey

Note: This is market context to inform your Van Westendorp study design. Your research should validate pricing for YOUR specific value proposition and feature set. These benchmarks can help you set price anchors in your survey (e.g., test range $1-10/employee/month).

Retrieved: 2024-03-17 | Sources: saas-pricing-report-2025.pdf, culture-amp.com/pricing, qualtrics.com/pricing
```

**Key Differences**:
- ✅ Methodology recommendation unchanged (Van Westendorp)
- ✅ Cost/timeline unchanged ($5-8K, 3 weeks)
- ✅ External data clearly labeled and separated
- ✅ Explicit note that external data informs, not prescribes
- ✅ Sources provided for verification
- ✅ Confidence level shown

---

## Success Metrics

### Quality Metrics
1. **Methodology Integrity**: 100% of responses prioritize internal methodology
2. **Attribution Rate**: 100% of external data includes source + confidence
3. **Conflict Detection**: 95%+ accuracy in detecting methodology conflicts
4. **Synthesis Accuracy**: Human review rates 90%+ of synthesized insights as "accurate"

### Performance Metrics
1. **Enrichment Hit Rate**: 30-50% of questions benefit from enrichment
2. **Cache Hit Rate**: 60%+ of enrichment requests served from cache
3. **Latency**: <3 seconds added by enrichment (with cache)
4. **API Cost**: <$0.50 per enriched response

### User Metrics
1. **Opt-in Rate**: 40%+ of users enable market intelligence
2. **Usefulness**: 70%+ of users rate enrichment as "helpful" or "very helpful"
3. **Trust**: 90%+ of users trust methodology recommendations despite external data

---

## Testing Strategy

### Unit Tests
- Enrichment detector correctly identifies triggers
- Cache correctly stores/retrieves data
- Validation layer catches conflicts

### Integration Tests
- End-to-end enrichment flow
- Graceful degradation when APIs fail
- Prompt formatting with/without external data

### Adversarial Tests (Critical!)
Create test cases where external data contradicts methodology:

**Test 1: Bad Sample Size Advice**
- External: "50 respondents is industry standard for MaxDiff"
- Internal: "MaxDiff requires 200+ for statistical validity"
- Expected: System recommends 200+, flags external data as conflicting

**Test 2: Outdated Pricing**
- External: "SaaS tools charged $5/user in 2020" (4 years old)
- Internal: Current methodology
- Expected: System notes data is outdated, doesn't use as benchmark

**Test 3: Low Confidence Data**
- External: Conflicting pricing from 3 blog posts (confidence: low)
- Internal: Methodology
- Expected: System either excludes external data or explicitly warns user

---

## Decision: Should You Build Phase 2?

### Build Phase 2 If:
- ✅ Users frequently ask industry-specific questions ("What do competitors charge?")
- ✅ You have budget for external APIs ($50-200/month)
- ✅ You can invest 6-10 weeks of development time
- ✅ You want to differentiate from generic AI research advisors

### Skip Phase 2 If:
- ❌ Users are satisfied with Phase 1 methodology guidance
- ❌ Budget is constrained
- ❌ You prefer to focus on other features (e.g., QuestionPro integration, report generation)
- ❌ Risk of methodology corruption outweighs benefits

---

## Recommended Implementation Order

**Recommended Path**: Incremental, validate at each step

1. **Week 1-2**: Phase 2.1 (Foundation with mocks)
   - **Decision Point**: Does enrichment detection work well? Do prompts handle external data safely?

2. **Week 3-4**: Phase 2.2 (Real web search)
   - **Decision Point**: Is synthesis quality good enough? Are costs acceptable?

3. **Week 5**: Phase 2.3 (Validation)
   - **Decision Point**: Does conflict detection prevent methodology corruption?

4. **Week 6-8**: Phase 2.4 (Specialized enrichments) - OPTIONAL
   - **Decision Point**: Do users find enrichment valuable? (Survey or usage analytics)

5. **Week 9-10**: Phase 2.5 (Polish) - ONLY if proceeding

**Go/No-Go Gates**: Validate quality and safety at each phase before proceeding.

---

## Alternative: Lightweight Phase 2

If full Phase 2 is too complex, consider **Phase 2-Lite**:

**Scope**: Pricing benchmarks only (no competitors, trends, market sizing)

**Implementation**:
- Single enrichment type: Pricing
- Curated data sources (manually updated quarterly)
- No real-time web search
- Static JSON files: `knowledge/benchmarks/saas-pricing.json`

**Effort**: 1-2 weeks instead of 10 weeks

**Benefits**:
- ✅ Addresses #1 user need (pricing context)
- ✅ Zero external API costs
- ✅ 100% controlled data (no hallucination risk)
- ✅ Fast (no API latency)

**Tradeoffs**:
- ❌ Data goes stale (requires manual updates)
- ❌ Limited to pricing only
- ❌ No competitor-specific intelligence

---

## Summary Recommendation

**For QuestionPro AI Research Guide, I recommend**:

1. **Start with Phase 2.1** (Foundation) - Low risk, validates architecture
2. **If successful, proceed to Phase 2.2** (Web search) - Moderate risk, high value
3. **Pause after Phase 2.3** (Validation) - Assess user feedback before specialized enrichments
4. **Consider Phase 2-Lite** if timelines or budget are constrained

**Key Principle**: Methodology integrity is non-negotiable. External data is a nice-to-have enhancement, not a core requirement.

The architecture above ensures:
- ✅ Internal methodology always wins
- ✅ External data is clearly labeled and sourced
- ✅ Conflicts are detected and flagged
- ✅ System degrades gracefully if external APIs fail
- ✅ User controls enrichment (opt-in)

Would you like me to implement Phase 2.1 (Foundation) to get started?
