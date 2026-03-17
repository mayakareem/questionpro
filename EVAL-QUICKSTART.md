# Evaluation System - Quick Start

## ✅ What Was Created

### Files Created (3)

1. **`scripts/eval-runner.ts`** (500+ lines)
   - Main evaluation runner
   - Uses LLM-as-judge for scoring
   - Saves results to JSON
   - Comprehensive console output

2. **`tests/prompts.test.ts`** (150+ lines)
   - 20 diverse test prompts
   - Covers 6 categories (pricing, features, CX, brand, market, concept)
   - Helper functions for filtering by category/industry

3. **`tests/schema.test.ts`** (300+ lines)
   - Schema validation tests
   - Advanced validation (sample size, timeline, methodology names)
   - Detailed validation reporting

### Supporting Files

- `tests/results/.gitkeep` - Results directory
- `tests/results/.gitignore` - Ignore eval outputs
- `EVALUATION.md` - Complete documentation
- `package.json` - Updated with new scripts

### NPM Scripts Added

```json
{
  "eval": "tsx scripts/eval-runner.ts",
  "eval:single": "tsx scripts/eval-runner.ts --prompt",
  "test:schema": "tsx tests/schema.test.ts"
}
```

### Dependencies Installed

- `tsx` (4.21.0) - For running TypeScript scripts

## 🎯 How It Works

### Evaluation Flow

```
User Question
  ↓
Method Router (selects methodologies)
  ↓
Retrieval (loads knowledge files)
  ↓
Planner (builds prompt)
  ↓
Claude API (generates research plan)
  ↓
LLM-as-Judge (evaluates quality)
  ↓
Results Saved to JSON
```

### Evaluation Criteria (1-5 each)

1. **Business Decision Quality** - Did it understand the decision?
2. **Methodology Relevance** - Are methods appropriate?
3. **Rationale Clarity** - Is the "why" clear?
4. **QuestionPro Workflow** - Are steps practical?
5. **Output Clarity** - Are outputs useful?
6. **Overall Score** - General quality

## 🚀 Quick Commands

### Run All 20 Test Prompts

```bash
npm run eval
```

**Duration:** ~5-10 minutes
**Output:** `tests/results/eval-{timestamp}.json`

### Test Single Question

```bash
npm run eval:single "What should we charge for our premium tier?"
```

**Duration:** ~20-30 seconds
**Output:** Single test result + JSON file

### Run Schema Tests

```bash
npm run test:schema
```

**Duration:** <1 second
**Output:** Validation test results

## 📊 Expected Output

### Console

```
🧪 Running Evaluation Suite
📊 Total Test Prompts: 20

📝 Testing: "What should we charge for our premium tier?"
  ⏳ Retrieving context...
  ⏳ Calling Claude API...
  ⏳ Evaluating response...
  ✅ Complete in 6854ms
  📊 Overall Score: 4/5

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
```

### JSON Output

Saved to `tests/results/eval-{timestamp}.json`:

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
  "results": [...]
}
```

## 📝 The 20 Test Prompts

### Pricing (4)
- "What should we charge for our new premium tier SaaS product?"
- "Are our current subscription prices competitive?"
- "How much would customers pay for expedited shipping?"
- "Should we offer freemium or paid-only?"

### Features (3)
- "Which features should we prioritize on our roadmap?"
- "What do enterprise customers value most in our app?"
- "Should we build dark mode or analytics first?"

### Customer Experience (4)
- "Why are customers churning after the first month?"
- "What's causing 75% cart abandonment?"
- "How satisfied are enterprise vs. SMB customers?"
- "What are the biggest onboarding pain points?"

### Brand (3)
- "How well-known is our brand vs. competitors?"
- "What do customers associate with our brand?"
- "Is our rebranding improving perception?"

### Market (3)
- "Who is our ideal customer persona?"
- "What market segments should we target?"
- "Why are Q4 sales declining?"

### Concept (3)
- "Will customers prefer new packaging?"
- "Should we launch AI search now or wait?"
- "Which homepage redesign will drive conversions?"

## 🎓 Usage Examples

### Example 1: Baseline Before Changes

```bash
# Establish baseline
npm run eval

# Review results
cat tests/results/eval-*.json | jq '.averageScores'
```

### Example 2: Test After Prompt Changes

```bash
# Make changes to lib/planner.ts
# ...

# Re-run evaluation
npm run eval

# Compare before/after
```

### Example 3: Debug Single Failing Prompt

```bash
# Identify failing prompt from full eval
npm run eval

# Test it individually
npm run eval:single "Why are customers churning?"

# Review detailed output
cat tests/results/eval-*.json | jq '.results[0].evaluation'
```

### Example 4: Quick Smoke Test

```bash
# Test just pricing questions
# Edit scripts/eval-runner.ts to use getPromptsByCategory('pricing')
npm run eval
```

## 🎯 Success Metrics

### Target for Production

- **Overall Score:** ≥4.0
- **Pass Rate:** ≥85%
- **All Criteria:** ≥3.5

### Interpretation

| Score | Status | Action |
|-------|--------|--------|
| 4-5   | 🟢 Excellent | Production ready |
| 3-3.9 | 🟡 Good | Minor improvements |
| 1-2.9 | 🔴 Poor | Major revisions needed |

## 💰 Cost Estimate

**Per Full Evaluation (20 prompts):**
- 20 research plans × ~45k tokens = 900k tokens
- 20 evaluations × ~1k tokens = 20k tokens
- **Total:** ~920k tokens
- **Cost:** ~$2.70 (Claude Sonnet 3.5 pricing)

**Per Single Test:**
- ~$0.14

## ⚡ Quick Start in 3 Steps

### 1. Ensure API Key is Set

```bash
# Check .env has ANTHROPIC_API_KEY
cat .env | grep ANTHROPIC_API_KEY
```

### 2. Run Evaluation

```bash
npm run eval
```

### 3. Review Results

```bash
# View summary in console (already displayed)

# View detailed JSON
cat tests/results/eval-*.json | jq '.averageScores'
```

## 🐛 Troubleshooting

### Issue: "Module not found"

```bash
# Reinstall dependencies
npm install
```

### Issue: "ANTHROPIC_API_KEY not set"

```bash
# Add to .env
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env
```

### Issue: Evaluation hangs

```bash
# Check API key credits
# Check rate limits
# Reduce number of test prompts
```

## 📚 Learn More

- **Full Documentation:** `EVALUATION.md`
- **Test Prompts:** `tests/prompts.test.ts`
- **Eval Runner:** `scripts/eval-runner.ts`
- **Schema Tests:** `tests/schema.test.ts`

## ✅ What's Next

1. **Run baseline evaluation** to establish current performance
2. **Review individual failing tests** using evaluation notes
3. **Iterate on prompts** in `lib/planner.ts`
4. **Re-run evaluation** to measure improvement
5. **Track metrics over time** by committing results

---

**Ready to start?**

```bash
npm run eval
```

Results will be saved to `tests/results/eval-{timestamp}.json`
