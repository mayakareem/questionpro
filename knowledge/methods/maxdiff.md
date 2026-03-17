# MaxDiff (Maximum Difference Scaling)

## Plain English Definition

A research technique that forces people to make trade-offs by repeatedly choosing the "best" and "worst" options from a set. Instead of rating everything as "important" on a scale, MaxDiff reveals what people *actually* prioritize when they can't have it all. It's like asking "what would you grab first if your house was on fire?"

## Best Used When

- You have a list of features, benefits, or attributes and need to prioritize them
- You want to avoid rating scale bias (where everything gets rated 8/10)
- You need a clear, ranked list to guide product or marketing decisions
- You have 8-25 items to compare (sweet spot: 10-15 items)
- You want to force realistic trade-offs rather than wishlist thinking
- You need to identify what truly differentiates offerings in customers' minds
- You're allocating limited resources and need data to back priorities

## Not Ideal When

- You have fewer than 5 items (just ask directly which is best)
- You have more than 30 items (survey becomes tedious)
- You need to understand *why* people prefer something (use interviews for that)
- Items are too similar to meaningfully differentiate
- You need to test bundles or configurations (use conjoint instead)
- You want to understand the relationship between items (use factor analysis)

## Typical Business Questions It Answers

- "Which features should we build first in our product roadmap?"
- "What do customers value most when choosing our type of product?"
- "Which benefits should we highlight in our marketing messaging?"
- "What are the top reasons customers would switch to our competitor?"
- "How do we prioritize improvements to our customer experience?"
- "Which brand attributes matter most to our target audience?"
- "What product claims resonate most strongly with buyers?"

## Sample / Audience Guidance

**Sample Size:**
- 150-200 minimum for reliable results
- 300-400 if you need segment analysis
- Larger sample if testing across multiple markets

**Who to Target:**
- Current customers (what keeps them engaged?)
- Target prospects (what drives purchase decisions?)
- Decision-makers if B2B (their priorities may differ from users)

**Recruitment:**
- Email invitation to customer list
- QuestionPro panel for broader market
- Screen to ensure they're familiar with your product category

## Core Design Elements

**How MaxDiff Works:**

1. You have a list of items (features, benefits, attributes)
2. Respondents see sets of 4-5 items at a time
3. They pick the BEST and WORST from each set
4. Items are rotated through multiple sets
5. Statistical analysis calculates relative importance scores

**Best Practices:**
- **10-15 items total:** Manageable for respondents, enough to differentiate
- **4-5 items per set:** Optimal for trade-off decisions
- **8-12 sets per respondent:** Enough data without fatigue
- **Balanced design:** Ensure each item appears same number of times
- **Clear, distinct items:** Avoid overlapping or confusing options
- **Keep language consistent:** All features or all benefits, not mixed

**Item Guidelines:**
- Be specific: "24/7 customer support" not "good support"
- Keep length similar: Long items stand out and get picked more
- Avoid double-barreled: "Fast and reliable" should be two items
- Test items people can realistically compare

## Typical QuestionPro Workflow

1. **Prepare Item List**
   - Brainstorm all features/benefits/attributes
   - Narrow to 10-15 most relevant items
   - Write clear, consistent descriptions

2. **Build MaxDiff Survey**
   - Use QuestionPro MaxDiff module
   - Enter your item list
   - Configure: 4 items per set, 10-12 sets
   - System auto-generates balanced design

3. **Add Context**
   - Include introduction explaining the exercise
   - Add demographic or firmographic questions
   - Keep survey under 10 minutes total

4. **Distribute**
   - Send to target audience (200-400 respondents)
   - Monitor response rate via dashboard

5. **Analyze Results**
   - QuestionPro automatically calculates:
     - Relative importance scores (0-100 scale)
     - Item rankings (1st to last)
     - Statistical significance of differences
   - View by segments (e.g., enterprise vs SMB)

6. **Export & Report**
   - Download ranked list with scores
   - Create charts showing priority gaps
   - Share with product and exec teams

## Expected Outputs

- **Ranked Priority List:** Items sorted from most to least important

- **Relative Importance Scores:**
  - Each item gets a score (typically 0-100 scale)
  - Top item might score 85, bottom item 12
  - Scores sum to 100 across all items

- **Priority Tiers:**
  - **Must-haves:** Top 3-5 items with significantly higher scores
  - **Nice-to-haves:** Middle items
  - **Low priority:** Bottom items with minimal differentiation

- **Segment Differences:**
  - How enterprise vs SMB prioritize differently
  - How current customers vs prospects differ

- **Statistical Confidence:**
  - Which differences are meaningful vs noise
  - Error ranges for each score

## How To Interpret The Output

**Reading the Scores:**
- **Score >60:** Clear priority, must include
- **Score 40-60:** Important but not critical
- **Score 20-40:** Nice-to-have, lower priority
- **Score <20:** Can likely deprioritize or remove

**Identifying Clear Winners:**
- Look for gaps between items
- Top 3 items significantly higher than the rest? Those are your priorities
- Scores clustered together? Items are similarly valued (harder to prioritize)

**Segment Analysis:**
- Do enterprise customers prioritize security while SMBs prioritize ease of use?
- Segment differences reveal the need for targeted messaging or tiered offerings

**Actionable Insights:**
- **Product:** Build top 3-5 features first
- **Marketing:** Highlight top benefits in messaging
- **Sales:** Lead with top attributes in pitches
- **CX:** Fix bottom items only after addressing top priorities

**Red Flags:**
- All scores very similar: Items too alike or respondents not engaged
- Unexpected bottom rankers: Might be poorly worded or misunderstood
- Segment conflicts: May need different products for different audiences

## Risks / Common Mistakes

**Risk: Too many items**
- 25+ items = survey fatigue and unreliable data
- **Mitigation:** Keep to 10-15 items; if more, run separate studies

**Risk: Poorly worded items**
- Confusing or overlapping items skew results
- **Mitigation:** Pre-test items with small group, ensure clarity and distinctiveness

**Risk: Not actionable**
- Testing items you can't actually change or implement
- **Mitigation:** Only include items that are decision-relevant

**Risk: Missing context**
- People prioritize differently when they understand constraints
- **Mitigation:** Provide realistic scenario (e.g., "for a product in the $X price range")

**Risk: Ignoring "why"**
- MaxDiff tells you *what* matters, not *why*
- **Mitigation:** Follow up with open-ended questions or interviews for context

**Risk: Sample bias**
- Surveying the wrong audience
- **Mitigation:** Screen for people who actually make these decisions

## Example Prompt

**User Question:**
"We have 12 features on our roadmap but can only build 3 this quarter. How do we decide which ones to prioritize?"

**AI Response Would Include:**
"Use MaxDiff analysis to let customers prioritize for you. Survey 300 target customers using QuestionPro's MaxDiff module. Present all 12 features in rotating sets of 4, asking respondents to pick the most and least important from each set. QuestionPro will calculate relative importance scores for each feature, ranking them from must-have to nice-to-have. Expected output: A ranked list showing your top 3 features with scores significantly higher than the rest, statistical confidence that these are true priorities, and segment analysis showing if enterprise vs SMB customers have different priorities. Build the top 3, then validate your decision by monitoring adoption rates once launched."
