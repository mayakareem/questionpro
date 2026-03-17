# Customer Experience (CX) Driver Analysis

## Plain English Definition

Research that identifies which specific aspects of your customer experience have the biggest impact on satisfaction, loyalty, and outcomes like NPS or retention. Instead of guessing what to fix, driver analysis uses statistical modeling to show you which improvements will move the needle most. Think of it as finding the leverage points in your CX.

## Best Used When

- You're collecting satisfaction data but don't know what to improve first
- You have limited resources and need to prioritize CX investments
- You want to prove ROI of CX improvements with data
- You're tracking NPS/CSAT and need to understand what drives the score
- You have multiple touchpoints and need to know which matters most
- You want to identify "hidden dissatisfiers" that hurt retention
- You need to allocate budget across customer journey stages

## Not Ideal When

- You have very small sample sizes (<100 responses)
- Your CX is so broken that everything needs fixing (just start fixing obvious issues)
- You don't have baseline satisfaction data to analyze
- Your CX rarely changes and you just need one-time measurement
- You already know what the problem is and just need to fix it
- You can't actually act on the insights (e.g., due to tech/resource constraints)

## Typical Business Questions It Answers

- "What's causing our low NPS scores?"
- "Which part of the customer journey has the biggest impact on retention?"
- "Should we invest in faster support response or better product features?"
- "Why are enterprise customers less satisfied than SMB customers?"
- "Which touchpoints drive the most customer effort?"
- "What's the ROI of improving onboarding vs improving support?"
- "Which experience gaps hurt us most vs competitors?"

## Sample / Audience Guidance

**Sample Size:**
- 200-300 minimum for basic driver analysis
- 400-500+ for segment-level analysis
- More complex models need larger samples

**Who to Survey:**
- Current customers (active users)
- Recent customers (to understand retention drivers)
- Post-interaction surveys (to understand touchpoint impact)
- Churned customers (to identify dissatisfiers)

**Timing:**
- Post-interaction: Right after key touchpoints (support, onboarding, purchase)
- Relationship surveys: Quarterly or bi-annually for overall CX health
- Continuous feedback: Ongoing pulse surveys

## Core Design Elements

**Survey Structure:**

1. **Outcome Metric (Dependent Variable)**
   - Overall satisfaction (CSAT)
   - Net Promoter Score (NPS)
   - Likelihood to renew/repurchase
   - Customer Effort Score (CES)

2. **Experience Attributes (Independent Variables)**
   - Specific aspects of the experience (10-20 items)
   - Rate each on same scale (e.g., 1-10 satisfaction)
   - Cover all major touchpoints and journey stages

**Example Attributes:**
- Onboarding experience
- Product ease of use
- Feature availability
- Performance/reliability
- Support responsiveness
- Support quality
- Pricing fairness
- Account management
- Documentation quality
- Billing process

**Survey Format:**
- Ask outcome question first: "Overall, how satisfied are you?" (1-10)
- Then rate each attribute: "How satisfied are you with onboarding?" (1-10)
- Include open-ended "why" question for context
- 10-15 minutes total

**Statistical Approaches:**
- **Correlation analysis:** Simple but limited
- **Regression analysis:** Shows which attributes predict outcome
- **Key driver analysis:** Importance-Performance matrix
- **Relative importance modeling:** Accounts for multicollinearity

## Typical QuestionPro Workflow

1. **Design Survey**
   - Choose outcome metric (NPS, CSAT, CES, etc.)
   - List 10-15 experience attributes to test
   - Build survey in QuestionPro with consistent rating scales
   - Include demographics for segment analysis

2. **Distribute Survey**
   - Send to customers via email (post-interaction or relationship survey)
   - Collect 300-500+ responses
   - Monitor response rate and quality

3. **Collect Data**
   - QuestionPro captures all responses
   - Export to analysis module

4. **Run Driver Analysis**
   - Use QuestionPro's key driver analysis tool
   - System automatically calculates:
     - Correlation between each attribute and outcome
     - Statistical significance
     - Relative importance ranking

5. **Create Action Matrix**
   - Plot attributes on Importance-Performance grid:
     - **High importance, Low performance:** Fix these first (quick wins)
     - **High importance, High performance:** Maintain these (strengths)
     - **Low importance, Low performance:** Low priority
     - **Low importance, High performance:** Potential over-investment

6. **Analyze by Segment**
   - Compare drivers for enterprise vs SMB
   - Identify segment-specific pain points

7. **Report & Prioritize**
   - Export driver ranking
   - Create action plan focusing on high-impact, low-performing areas
   - Share with CX, product, and support teams

## Expected Outputs

- **Driver Ranking:**
  - List of attributes sorted by impact on outcome
  - Example: "Support quality is the #1 driver of NPS, onboarding is #2"

- **Importance Scores:**
  - Each attribute gets an importance score (0-100%)
  - Scores sum to 100 across all attributes

- **Performance Scores:**
  - Current satisfaction rating for each attribute
  - Shows where you're doing well vs poorly

- **Importance-Performance Matrix:**
  - Visual quadrant chart showing what to focus on
  - "Fix first" vs "Maintain" vs "Low priority" vs "Over-investment"

- **Statistical Significance:**
  - Which relationships are real vs noise

- **Segment Differences:**
  - How drivers differ for enterprise vs SMB, new vs tenured customers, etc.

- **Predicted Impact:**
  - "If we improve support quality by 1 point, NPS increases by X points"

## How To Interpret The Output

**High Impact Drivers (Focus Here):**
- Attributes with importance >15%
- Strong correlation with outcome metric
- These are your leverage points—improve these first

**Performance Gaps (Quick Wins):**
- High importance + Low performance = urgent priority
- Example: Support quality is critical (importance: 25%) but rated poorly (6/10)

**Strengths (Maintain):**
- High importance + High performance = keep doing this well
- Don't divert resources from these

**Low Priority:**
- Low importance + Low performance = fix later (or not at all)
- Don't waste resources here

**Over-Investment?**
- Low importance + High performance = you might be over-delivering here
- Consider reallocating resources

**Segment Insights:**
- Enterprise cares about security, SMB cares about ease of use
- Tailor CX improvements to segment priorities

**ROI Estimation:**
- If improving Attribute X by 1 point increases NPS by 5 points, calculate customer lifetime value impact

## Risks / Common Mistakes

**Risk: Multicollinearity**
- Attributes are correlated with each other, skewing importance scores
- **Mitigation:** Use relative importance modeling, not simple correlation

**Risk: Missing key drivers**
- Survey doesn't include the actual problem area
- **Mitigation:** Use qualitative research first to identify candidate drivers

**Risk: Sample bias**
- Only happy (or angry) customers respond
- **Mitigation:** Boost response rates, weight responses if needed

**Risk: Too many attributes**
- Testing 30+ attributes = survey fatigue and unreliable data
- **Mitigation:** Limit to 10-15 most relevant attributes

**Risk: Ignoring open-ended feedback**
- Relying only on numbers misses context
- **Mitigation:** Read verbatims to understand "why" behind scores

**Risk: Analysis paralysis**
- Waiting for perfect data instead of acting on insights
- **Mitigation:** Start with top 3 drivers, test and iterate

**Risk: Not validating findings**
- Assuming model is correct without testing
- **Mitigation:** Run A/B tests on improvements to validate impact

## Example Prompt

**User Question:**
"Our NPS score is 25 and we don't know what to fix first. We're getting feedback on everything from product features to support to pricing. Where should we focus?"

**AI Response Would Include:**
"Run a CX driver analysis to identify which specific experience attributes have the biggest impact on your NPS. Survey 400 customers using QuestionPro, asking them to rate overall satisfaction (your outcome metric) and 12-15 specific attributes (onboarding, product ease of use, support responsiveness, pricing, etc.) on the same 1-10 scale. Use QuestionPro's key driver analysis tool to calculate which attributes most strongly predict NPS. Expected outputs: (1) Ranked list of drivers showing, for example, that support quality has 30% importance, onboarding has 20%, pricing has 15%, etc., (2) Importance-Performance matrix showing which high-impact areas you're underperforming on, (3) Predicted NPS lift from improving each driver. Focus your resources on the top 2-3 high-importance, low-performance drivers—these are your quick wins that will move NPS fastest."
