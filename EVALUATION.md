# Evaluation System for AI Research Guide

A lightweight evaluation framework for testing research plan quality with 20 diverse test prompts.

## 📋 What Gets Evaluated

### 5 Core Criteria (Scored 1-5)

1. **Business Decision Quality**
   - Did the system correctly understand what the user is trying to decide?
   - Is the business decision specific and actionable?

2. **Methodology Relevance**
   - Are the recommended methodologies appropriate for the question?
   - Would a real researcher recommend these methods?

3. **Rationale Clarity**
   - Is the "why this fits" explanation clear and convincing?
   - Does it explain the connection between question and method?

4. **QuestionPro Workflow Practicality**
   - Are the implementation steps realistic and specific?
   - Would someone be able to follow these steps?

5. **Output Clarity**
   - Are the expected outputs practical and well-defined?
   - Would the outputs actually help make the decision?

6. **Overall Score**
   - Overall quality and usefulness

### Additional Validations

- Schema compliance (all required fields present)
- Methodology names are valid
- Sample sizes are reasonable (30-10,000)
- Timelines are realistic (3 days - 1 year)
- Has at least one primary methodology
- Rationale is substantive (>10 chars)
- Expected outputs are specific (>50 chars)
- QuestionPro steps are actionable (≥3 steps)
- Assumptions and caveats are meaningful

## 🧪 Test Suite

### 20 Test Prompts Covering:

**Pricing (4 prompts)**
- Premium tier pricing
- Competitive pricing analysis
- Willingness to pay
- Freemium vs. paid-only

**Feature Prioritization (3 prompts)**
- Roadmap prioritization
- Feature value assessment
- Feature A vs. B decisions

**Customer Experience (4 prompts)**
- Churn analysis
- Cart abandonment
- Satisfaction comparison
- Onboarding pain points

**Brand Research (3 prompts)**
- Brand awareness
- Brand associations
- Rebranding effectiveness

**Market Research (3 prompts)**
- Persona development
- Market segmentation
- Sales decline analysis

**Concept Testing (3 prompts)**
- Packaging design
- Feature launch readiness
- Homepage redesign

## 🚀 Usage

### Run Full Evaluation (All 20 Prompts)

```bash
npm run eval
```

**Output:**
- Console summary with scores
- JSON file saved to `tests/results/eval-{timestamp}.json`

**Expected Duration:** ~5-10 minutes (depends on Claude API speed)

### Run Single Prompt Test

```bash
npm run eval:single "What should we charge for our new premium tier?"
```

**Output:**
- Single test result
- JSON file with detailed evaluation

### Run Schema Tests

```bash
npm run test:schema
```

**Output:**
- 8 schema validation tests
- Advanced validation checks

## 📊 Evaluation Output

### Console Output

```
🧪 Running Evaluation Suite
📊 Total Test Prompts: 20
⏰ Started: 2026-03-17T12:00:00.000Z

📝 Testing: "What should we charge for our new premium tier?"
  ⏳ Retrieving context...
  ⏳ Calling Claude API...
  ⏳ Evaluating response...
  ✅ Complete in 6854ms
  📊 Overall Score: 4/5

...

============================================================
📊 EVALUATION SUMMARY
============================================================

Total Tests: 20
Pass Rate: 85.0% (≥3/5)

Average Scores (out of 5):
  Business Decision Quality: 4.2
  Methodology Relevance:     4.5
  Rationale Clarity:         4.0
  QuestionPro Workflow:      3.8
  Output Clarity:            4.1
  Overall Score:             4.1

============================================================
📝 Individual Results:
============================================================

1. 🟢 What should we charge for our new premium tier?
   Score: 4/5 | Methods: Pricing Research, Conjoint Analysis
   Notes: Strong methodology selection with clear rationale...

2. 🟡 Why are customers churning from our service?
   Score: 3/5 | Methods: CX Driver Analysis, Exploratory Interviews
   Notes: Good method choice but workflow could be more specific...

...
```

### JSON Output Format

```json
{
  "totalTests": 20,
  "averageScores": {
    "businessDecisionQuality": 4.2,
    "methodologyRelevance": 4.5,
    "rationaleClarity": 4.0,
    "questionProWorkflowPracticality": 3.8,
    "outputClarity": 4.1,
    "overallScore": 4.1
  },
  "passRate": 85.0,
  "results": [
    {
      "prompt": {
        "id": "pricing-1",
        "question": "What should we charge for our new premium tier?",
        "expectedMethodologies": ["Pricing Research", "Conjoint Analysis"],
        "category": "pricing",
        "industry": "saas"
      },
      "response": {
        "userQuestion": "...",
        "businessDecision": "...",
        "researchObjective": "...",
        "recommendedMethods": [...],
        "implementation": {...},
        "expectedOutputs": "...",
        "decisionSupport": "...",
        "assumptions": [...],
        "caveats": [...]
      },
      "evaluation": {
        "businessDecisionQuality": 4,
        "methodologyRelevance": 5,
        "rationaleClarity": 4,
        "questionProWorkflowPracticality": 4,
        "outputClarity": 4,
        "overallScore": 4,
        "notes": "Strong methodology selection..."
      },
      "metadata": {
        "methodsIncluded": ["pricing-research", "conjoint"],
        "processingTimeMs": 6854,
        "timestamp": "2026-03-17T12:00:00.000Z"
      }
    }
  ],
  "timestamp": "2026-03-17T12:00:00.000Z"
}
```

## 📈 Interpreting Results

### Score Ranges

| Score | Emoji | Interpretation |
|-------|-------|----------------|
| 4-5   | 🟢    | Excellent - production ready |
| 3-3.9 | 🟡    | Good - minor improvements needed |
| 1-2.9 | 🔴    | Poor - major revisions required |

### Pass Rate

- **≥80%**: System is performing well
- **60-79%**: System needs improvement
- **<60%**: System requires significant work

### Target Metrics

**For Production Readiness:**
- Overall Score: ≥4.0
- Pass Rate: ≥85%
- All individual criteria: ≥3.5

**Current Baseline (to be established):**
- Run initial evaluation to set baseline
- Track improvements over time
- Compare before/after prompt changes

## 🔧 Customization

### Add New Test Prompts

Edit `tests/prompts.test.ts`:

```typescript
export const testPrompts: TestPrompt[] = [
  // ... existing prompts
  {
    id: 'custom-1',
    question: 'Your new test question',
    expectedMethodologies: ['Method 1', 'Method 2'],
    category: 'pricing',
    industry: 'saas'
  }
]
```

### Modify Evaluation Criteria

Edit `scripts/eval-runner.ts`:

```typescript
// Adjust scoring in evaluateResponse()
// Change evaluation prompt
// Add new criteria
```

### Run Subset of Tests

Edit `tests/prompts.test.ts`:

```typescript
// Get prompts by category
const pricingTests = getPromptsByCategory('pricing')

// Get random subset
const randomTests = getRandomPrompts(5)

// Get specific prompts
const specificTests = testPrompts.filter(p =>
  ['pricing-1', 'cx-1', 'brand-1'].includes(p.id)
)
```

## 🎯 Use Cases

### 1. Regression Testing

Run before and after changes:

```bash
# Before prompt changes
npm run eval > baseline.txt

# Make changes to prompts/knowledge

# After changes
npm run eval > updated.txt

# Compare
diff baseline.txt updated.txt
```

### 2. A/B Testing Prompts

```bash
# Test variant A
npm run eval
mv tests/results/eval-*.json tests/results/variant-a.json

# Switch to variant B
# Edit lib/planner.ts with new prompt

# Test variant B
npm run eval
mv tests/results/eval-*.json tests/results/variant-b.json

# Compare results
node scripts/compare-evals.js variant-a.json variant-b.json
```

### 3. Continuous Monitoring

```bash
# Run weekly
crontab -e
0 9 * * 1 cd /path/to/ai-research-guide && npm run eval

# Track over time
git add tests/results/eval-*.json
git commit -m "Weekly eval results"
```

### 4. Debugging Single Prompt

```bash
# Test specific question
npm run eval:single "Why are customers churning?"

# Review detailed output
cat tests/results/eval-*.json | jq '.results[0]'
```

## 🐛 Troubleshooting

### Issue: Evaluation takes too long

**Solution:**
- Reduce number of test prompts
- Use `getRandomPrompts(5)` for quick tests
- Run in parallel (future enhancement)

### Issue: Scores are consistently low

**Solution:**
- Review evaluation notes in JSON output
- Check if methodologies are in `knowledge/methods/`
- Verify prompt engineering in `lib/planner.ts`
- Check QuestionPro documentation is complete

### Issue: LLM evaluation fails

**Solution:**
- Check `ANTHROPIC_API_KEY` is set
- Verify API key has sufficient credits
- Check for rate limiting
- Review error messages in console

### Issue: Schema validation fails

**Solution:**
- Check response parsing in `scripts/eval-runner.ts`
- Verify LLM is following output format
- Review `lib/planner.ts` for format instructions

## 📝 Best Practices

1. **Run baseline before major changes**
   - Establishes performance benchmark
   - Validates improvements

2. **Review failed tests individually**
   - Each failure has evaluation notes
   - Use notes to improve prompts

3. **Track metrics over time**
   - Commit eval results to Git
   - Monitor trends

4. **Test edge cases**
   - Add ambiguous questions
   - Add questions outside domain
   - Test with very short/long questions

5. **Use schema tests during development**
   - Fast feedback loop
   - Catches format issues early

## 🔮 Future Enhancements

### Planned

- [ ] Parallel execution for faster runs
- [ ] Comparison tool for A/B testing
- [ ] Automated regression detection
- [ ] Human evaluation interface
- [ ] Cost tracking per eval run
- [ ] Integration with CI/CD

### Considered

- [ ] Golden dataset creation
- [ ] Fine-tuning on high-quality examples
- [ ] Semantic similarity scoring
- [ ] Multi-model evaluation (GPT-4 vs Claude)

## 📚 Files

```
tests/
├── prompts.test.ts          # 20 test prompts
├── schema.test.ts           # Schema validation tests
└── results/                 # Evaluation outputs
    ├── .gitkeep
    └── eval-{timestamp}.json

scripts/
└── eval-runner.ts           # Main evaluation runner
```

## 🎓 Examples

### Example 1: Run Full Eval

```bash
npm run eval
```

### Example 2: Test Pricing Questions Only

```typescript
// In scripts/eval-runner.ts or create custom script
import { getPromptsByCategory } from '../tests/prompts.test'

const pricingPrompts = getPromptsByCategory('pricing')
const summary = await runEvaluation(pricingPrompts)
```

### Example 3: Quick Smoke Test

```bash
# Test 3 random prompts
npm run eval:single "What should we charge for our premium tier?"
npm run eval:single "Why are customers churning?"
npm run eval:single "Which features should we prioritize?"
```

## 💡 Tips

- **Start small**: Test 3-5 prompts initially
- **Iterate quickly**: Use schema tests for fast feedback
- **Review notes**: LLM evaluator provides valuable insights
- **Track changes**: Commit eval results to see trends
- **Cost-conscious**: Each full eval costs ~$0.50-1.00 in API credits

---

**Ready to evaluate?**

```bash
npm run eval
```

See results in `tests/results/eval-{timestamp}.json`
