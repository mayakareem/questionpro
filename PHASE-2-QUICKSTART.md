# Phase 2: Quick Start Guide

## TL;DR

**What**: Add market intelligence (pricing benchmarks, competitor analysis, trends) to enhance research plans

**How**: Secondary enrichment layer that NEVER overrides core methodology

**Risk**: Low - with proper guardrails in place

**Timeline**: 6-10 weeks (or 1-2 weeks for lightweight version)

**Cost**: $50-200/month for external APIs

---

## Decision Tree

```
Do users ask industry-specific questions?
  ├─ YES → Phase 2 adds significant value
  └─ NO → Skip Phase 2, focus on Phase 1 improvements

Have budget for external APIs ($50-200/mo)?
  ├─ YES → Proceed with full Phase 2
  └─ NO → Consider Phase 2-Lite (curated data, no APIs)

Can invest 6-10 weeks development time?
  ├─ YES → Full Phase 2 with all enrichment types
  └─ NO → Phase 2-Lite (pricing benchmarks only, 1-2 weeks)
```

---

## Architecture (One Diagram)

```
┌─────────────────────────────────────────────────────────┐
│                    USER QUESTION                         │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Method Router       │ (unchanged)
        │   (rule-based)        │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ Knowledge Retrieval   │ (PRIMARY - unchanged)
        │ (filesystem)          │
        └───────────┬───────────┘
                    │
                    ├─────────────────────────────┐
                    ▼                             ▼
        ┌───────────────────────┐   ┌─────────────────────────┐
        │  Internal Context     │   │ Enrichment Engine (NEW) │
        │  - Methodologies      │   │ - Detect needs          │
        │  - QuestionPro steps  │   │ - Fetch external data   │
        │  - Cost/timeline      │   │ - Validate & filter     │
        └───────────┬───────────┘   └───────────┬─────────────┘
                    │                           │
                    │         ┌─────────────────┘
                    │         │
                    ▼         ▼
        ┌─────────────────────────────────┐
        │         Planner                 │
        │ - Internal = Foundation         │
        │ - External = Context/Examples   │
        └─────────────┬───────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────┐
        │  Response with:                 │
        │  ✓ Methodology (internal)       │
        │  ✓ Market context (external)    │
        │    - Clearly labeled            │
        │    - Source attribution         │
        │    - Confidence scores          │
        └─────────────────────────────────┘
```

---

## Key Safety Guardrails

1. **Separation**: Internal knowledge labeled "PRIMARY", external labeled "SECONDARY"
2. **Attribution**: All external data includes source URL + retrieval date
3. **Confidence**: External data scored as high/medium/low confidence
4. **Conflict Detection**: Flags when external contradicts methodology
5. **Hierarchy**: Prompt explicitly states "methodology always wins"
6. **Opt-in**: User must enable enrichment (default: OFF)

---

## Implementation Phases

### Phase 2.1: Foundation (Week 1-2) ⭐ START HERE
- Build enrichment detector
- Create interfaces and stubs
- Update planner prompt
- **Risk**: LOW - no external APIs
- **Deliverable**: Working architecture with mock data

### Phase 2.2: Web Search (Week 3-4)
- Integrate web search API (Tavily recommended)
- Implement synthesis using Claude
- Add caching layer
- **Risk**: MEDIUM - real API costs
- **Deliverable**: Live external intelligence

### Phase 2.3: Validation (Week 5)
- Add conflict detection
- Implement safety checks
- Add opt-in controls
- **Risk**: LOW - safety only
- **Deliverable**: Production-ready guardrails

### Phase 2.4: Specialized (Week 6-8) - OPTIONAL
- Pricing benchmarks
- Competitor analysis
- Market sizing
- Trend analysis
- **Risk**: MEDIUM - requires careful tuning
- **Deliverable**: High-value enrichments

### Phase 2.5: Polish (Week 9-10) - OPTIONAL
- Performance optimization
- Monitoring & logging
- Documentation
- **Risk**: LOW - polish only
- **Deliverable**: Production ready

---

## Alternative: Phase 2-Lite

**For budget/time constraints**:

- **What**: Pricing benchmarks only (no real-time search)
- **How**: Curated JSON files manually updated quarterly
- **Timeline**: 1-2 weeks
- **Cost**: $0 (no external APIs)
- **Location**: `knowledge/benchmarks/saas-pricing.json`

**Example**:
```json
{
  "vertical": "SaaS - B2B",
  "category": "Survey Tools",
  "updated": "2024-Q1",
  "benchmarks": {
    "per_user_pricing": {
      "enterprise": { "min": 150, "max": 400, "unit": "USD/user/month" },
      "mid_market": { "min": 8, "max": 25, "unit": "USD/user/month" }
    },
    "examples": [
      { "company": "Qualtrics", "price": "$200/user/month", "tier": "enterprise" },
      { "company": "Culture Amp", "price": "$2/employee/month", "tier": "mid-market" }
    ]
  }
}
```

---

## Tools Required

### Required for Phase 2.2+

**Web Search API** (choose one):
- **Tavily AI** (recommended): $0.002-0.005/search - https://tavily.com
- **Serper.dev** (budget): $0.001/search - https://serper.dev
- **Brave Search**: $0.0005/search - https://brave.com/search/api/

### Optional (Phase 2.4+)

**Competitor Database**:
- Crunchbase API: $99-299/month (skip initially, use web search)

**Market Data**:
- Statista API: Enterprise pricing (skip initially)

---

## Example Output

### Before Phase 2
```
RECOMMENDED METHOD: Van Westendorp ($5-8K, 2-3 weeks)

You'll get:
- Optimal price point
- Acceptable range
- Price floor/ceiling

[QuestionPro workflow...]
```

### After Phase 2
```
RECOMMENDED METHOD: Van Westendorp ($5-8K, 2-3 weeks)

You'll get:
- Optimal price point
- Acceptable range
- Price floor/ceiling

[QuestionPro workflow...]

─────────────────────────────────────────

📊 MARKET CONTEXT (External Intelligence)

[Pricing Benchmark | Confidence: High | SaaS Pricing 2025]

B2B HR survey tools charge $8-25/employee/month (mid-market)
and $150-400/user/month (enterprise).

Examples:
- Culture Amp: $2/employee/month
- Qualtrics: $200/user/month

Note: This informs your Van Westendorp design (test range
$1-10/employee/month), but your research validates YOUR
specific pricing.

Sources: saas-pricing-2025.pdf, culture-amp.com/pricing
Retrieved: 2024-03-17
```

---

## Testing Checklist

### Adversarial Tests (CRITICAL)

- [ ] External says "50 respondents OK" but methodology needs 200 → System recommends 200
- [ ] External data is 4 years old → System warns it's outdated
- [ ] External sources contradict each other (low confidence) → System excludes or warns
- [ ] External API fails → System gracefully degrades (internal only)
- [ ] User question contains company name → System sanitizes before external query

### Quality Tests

- [ ] 100% of external data includes source attribution
- [ ] 100% of external data includes confidence score
- [ ] 95%+ conflict detection accuracy
- [ ] 90%+ synthesis accuracy (human review)

### Performance Tests

- [ ] Enrichment adds <3 seconds latency (with cache)
- [ ] Cache hit rate >60%
- [ ] API cost <$0.50 per enriched response

---

## Success Metrics

**After Phase 2.1** (mock data):
- Enrichment detector identifies 30-50% of questions as enrichable
- Prompt formatting works correctly with external data
- No methodology corruption in evaluation tests

**After Phase 2.2** (real data):
- Synthesis quality rated "good" or "excellent" by human review (90%+)
- API costs within budget (<$100/month for 200 requests)
- Cache hit rate >60%

**After Phase 2.3** (validation):
- Conflict detection catches 95%+ of methodology contradictions
- Users opt-in at 40%+ rate
- Trust in methodology recommendations remains >90%

---

## Recommendation

**For QuestionPro AI Research Guide**:

1. ✅ **Implement Phase 2.1** (Foundation) - Validates architecture, low risk
2. ⏸️ **Pause after Phase 2.1** - Get user feedback on mock enrichment
3. ✅ **If valuable, proceed to Phase 2.2** (Web search) - Real intelligence
4. ⏸️ **Pause after Phase 2.3** (Validation) - Assess quality & user adoption
5. ⚠️ **Phase 2.4+ only if strong user demand** - Avoid scope creep

**Or, if time/budget constrained**:

1. ✅ **Implement Phase 2-Lite** (Curated pricing data) - 1-2 weeks, $0 cost
2. 📊 **Measure user value** - Do users cite pricing context as helpful?
3. ✅ **Upgrade to full Phase 2 if needed** - Based on data, not assumptions

---

## Next Steps

**Ready to start Phase 2?**

Reply with one of:
- "Start Phase 2.1" → I'll implement foundation with mock data
- "Build Phase 2-Lite" → I'll create curated pricing benchmarks
- "Not yet" → We'll focus on Phase 1 improvements instead

**Questions before starting?**

- How do I choose between full Phase 2 vs Phase 2-Lite?
- What are the exact API costs?
- How do I test for methodology corruption?
- Can I see code examples for the enrichment engine?
