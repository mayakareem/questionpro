# A/B Testing (Experimental Design)

## Plain English Definition

A controlled experiment that compares two or more variants (A vs B) to determine which performs better on a specific metric. You randomly split your audience, show each group a different variant, and measure which one drives better outcomes. It's the gold standard for causal inference - not "what do customers say they prefer?" but "what actually changes their behavior?"

## Best Used When

- You need to prove causation, not just correlation ("this change CAUSED the improvement")
- You're testing messaging, creative, or positioning before committing to a campaign
- You want to optimize conversion rates, click-through rates, or engagement
- You're deciding between two product features, designs, or flows
- You need to justify a decision with statistically rigorous evidence
- You're testing price points in a live environment
- You want to reduce risk before a full rollout

## Not Ideal When

- You don't have enough traffic or sample size for statistical significance
- You need to test many variables simultaneously (use multivariate testing)
- You're exploring open-ended questions about customer needs (use qualitative)
- The decision doesn't have a clear, measurable outcome metric
- You can't randomly assign audiences (e.g., all customers see the same experience)
- You need results in days but the conversion cycle is months
- Ethical constraints prevent withholding a potentially better experience

## Typical Business Questions It Answers

- "Which email subject line gets more opens and clicks?"
- "Does our new pricing page convert better than the current one?"
- "Which product message resonates more with enterprise buyers?"
- "Will removing this form field increase sign-up completion?"
- "Does free shipping increase average order value enough to offset the cost?"
- "Which onboarding flow leads to higher 30-day retention?"

## Budget & Timeline Reality Check

### Survey-Based A/B Test (Message/Concept)

**Cost:** $5-10K
**Timeline:** 2-3 weeks
**Sample:** 200-400 per variant (400-800 total for 2 variants)
**What you get:** Winner identification, statistical significance, segment-level results

### In-Product/Website A/B Test

**Cost:** $3-8K (tooling + analysis)
**Timeline:** 2-6 weeks depending on traffic volume
**Sample:** Depends on baseline conversion rate and minimum detectable effect
**What you get:** Conversion rate comparison, confidence intervals, revenue impact estimate

### Multi-Variant Test (A/B/C/D)

**Cost:** $10-20K
**Timeline:** 3-6 weeks
**Sample:** 200+ per variant (800+ total for 4 variants)
**What you get:** Ranked variant performance, interaction effects, optimal combination

## How It Works in QuestionPro

### Survey-Based A/B Testing
1. Create survey with randomized question blocks (variant A and variant B)
2. Use QuestionPro's survey flow randomization to assign respondents
3. Show each group a different message, concept, or creative
4. Measure response on identical outcome questions (preference, purchase intent, appeal)
5. Compare results with built-in cross-tabulation and significance testing

### Monadic Design (Cleaner A/B)
1. Create two separate survey versions (each group sees only ONE variant)
2. Randomly assign respondents to Version A or Version B
3. Ask identical evaluation questions after exposure
4. Compare group-level results with statistical testing

### Analysis
- Cross-tabulation of variant vs outcome metrics
- Statistical significance testing (chi-square, t-test)
- Segment-level analysis (does Variant A win with all segments or just some?)
- Effect size calculation (how much better is the winner?)

## What Good Looks Like

- **Clear winner:** p-value < 0.05, meaningful effect size (>5% lift)
- **Inconclusive:** p-value > 0.05 (need more sample or bigger difference)
- **Segment insight:** One variant wins overall, but the other wins with a key segment

## Common Pitfalls

- Stopping the test too early (wait for statistical significance)
- Testing too many things at once in one variant (isolate variables)
- Not defining success metrics before the test starts
- Ignoring practical significance (statistically significant but trivially small difference)
- Not accounting for novelty effects (new things always get temporary attention)
- Running sequential tests without adjusting for multiple comparisons

## Combines Well With

- **Concept Testing** - A/B test the winning concepts from initial concept test
- **MaxDiff** - MaxDiff identifies top features, A/B tests the messaging of those features
- **Exploratory Interviews** - Qualitative insight generates hypotheses, A/B testing validates them
- **Pricing Research** - Van Westendorp identifies price range, A/B tests specific price points
- **CSAT/CES** - A/B test a process change, measure impact via CSAT/CES
