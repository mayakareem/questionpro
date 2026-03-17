# Conjoint Analysis

## Plain English Definition

A powerful research technique that shows you how customers value different product features, including price, by forcing them to make realistic choices between product configurations. Instead of asking "what do you want?", it simulates real buying decisions to reveal what trade-offs people will actually make. Think of it as "reverse engineering" customer preferences.

## Best Used When

- You need to optimize product configuration (which features to include)
- You want to understand price elasticity for different feature combinations
- You're deciding between multiple product versions or tiers
- You need to predict market share for different product configurations
- You want to quantify the value of each feature in dollars
- You're making high-stakes product or pricing decisions that justify the investment
- You need defendable data for executive or board decisions

## Not Ideal When

- You have fewer than 3 attributes to test (too simple, use MaxDiff or direct questions)
- You have more than 8 attributes (too complex, respondents can't process it)
- Your audience is very small (<200 reachable respondents)
- You need directional insights fast (conjoint takes time and expertise)
- Features are highly technical and hard to explain in a survey
- You just need a ranked list (use MaxDiff, it's simpler)
- Budget is very limited (conjoint is premium research)

## Typical Business Questions It Answers

- "What's the optimal price for our product given its features?"
- "Which features justify a premium price point?"
- "If we add feature X, how much can we charge?"
- "How do we configure a product to beat the competition?"
- "What market share will we capture at different price-feature combinations?"
- "Should we offer good/better/best tiers, and what features go in each?"
- "What's the ROI of building this expensive feature?"

## Sample / Audience Guidance

**Sample Size:**
- 300-500 minimum for reliable results
- 500-800 for segment analysis
- More complex designs need larger samples

**Who to Target:**
- People who actually make purchase decisions (not just influencers)
- Current customers, prospects, and competitive customers
- Segment by key buyer characteristics if needed

**Recruitment:**
- Use QuestionPro panels for broad market reach
- Customer lists for current/lapsed buyers
- Screen carefully—respondents must understand your product category

## Core Design Elements

**Conjoint Types:**

1. **Choice-Based Conjoint (CBC)** - Most Common
   - Show 3-4 product configurations
   - Ask "which would you choose?"
   - Most realistic (mirrors actual shopping)
   - Use this unless you have a specific reason not to

2. **Adaptive Choice-Based Conjoint (ACBC)**
   - Survey adapts based on previous answers
   - Handles more complexity
   - Longer but more accurate for complex products

3. **MaxDiff Conjoint**
   - Hybrid of MaxDiff + pricing
   - Good for simple feature + price optimization

**Attributes & Levels:**
- **Attributes:** The features you're testing (e.g., Storage, Speed, Price)
- **Levels:** The options within each (e.g., 128GB, 256GB, 512GB)
- **3-6 attributes:** Optimal for respondent comprehension
- **2-5 levels per attribute:** More levels = more precision but complexity

**Example Setup:**
- Attribute 1: Storage (128GB, 256GB, 512GB)
- Attribute 2: Processing Speed (Standard, Fast, Ultra-Fast)
- Attribute 3: Camera Quality (12MP, 24MP, 48MP)
- Attribute 4: Price ($599, $799, $999, $1199)

**Task Design:**
- 12-18 choice tasks per respondent
- Each task shows 3-4 product profiles
- Include a "none of these" option (measures demand)

## Typical QuestionPro Workflow

1. **Design Study**
   - Define attributes and levels
   - Decide on CBC vs ACBC
   - Create product profiles (QuestionPro generates them)
   - Set up choice tasks

2. **Build Survey**
   - Use QuestionPro Conjoint module
   - Configure attributes and levels
   - Set number of tasks (12-16 recommended)
   - Add screening and demographic questions
   - Include attention checks

3. **Pilot Test**
   - Run with 20-30 people first
   - Check if tasks make sense
   - Adjust if needed

4. **Field Survey**
   - Deploy to 300-500+ respondents
   - Monitor completion rate and time
   - Typical survey: 10-15 minutes

5. **Analyze Results**
   - QuestionPro automatically calculates:
     - **Part-worth utilities:** Value of each feature level
     - **Feature importance:** Which attributes matter most
     - **Willingness to pay:** $ value of each feature
     - **Preference share:** Market share simulation
   - Run market simulator with different configurations

6. **Report Findings**
   - Export feature importance charts
   - Create what-if scenarios (e.g., "If we price at $X with features Y and Z, we'll capture X% share")
   - Build recommendation for optimal product configuration

## Expected Outputs

- **Part-Worth Utilities:**
  - Numerical value for each feature level
  - Higher = more preferred
  - Example: 512GB storage = +2.5, 128GB = -1.2

- **Feature Importance Scores:**
  - Which attributes drive decisions most (sum to 100%)
  - Example: Price 35%, Storage 30%, Speed 20%, Camera 15%

- **Willingness to Pay:**
  - Dollar value customers place on each feature
  - Example: "Customers will pay $200 more for 512GB vs 256GB"

- **Preference Share Simulation:**
  - Predicted market share for any product configuration
  - Example: "Config A: 35% share, Config B: 25% share, Config C: 40% share"

- **Price Elasticity:**
  - How demand changes as price changes
  - Optimal price point to maximize revenue

- **Segment Differences:**
  - How enterprise vs SMB value features differently
  - Enables targeted product offerings

## How To Interpret The Output

**Feature Importance:**
- Attributes with >30% importance: These drive decisions
- Attributes with <10% importance: May not be worth investing in

**Part-Worth Utilities:**
- Positive number = preferred, negative = dis-preferred
- Larger absolute value = stronger preference
- Use to configure "best" product (highest total utility)

**Willingness to Pay:**
- If feature adds $X value, you can charge up to $X more for it
- ROI check: Does the feature cost less to build than customers will pay?

**Market Simulation:**
- Test scenarios: "What if we price at $999 with premium features vs $799 with fewer features?"
- Choose configuration that maximizes share, revenue, or profit (depending on goal)

**Segment Analysis:**
- Different segments value different features
- May need multiple SKUs or tiered offerings

**Decision Framework:**
- **Revenue maximization:** Price at demand curve peak
- **Market share:** Include high-utility features, price competitively
- **Profitability:** Balance willingness to pay vs feature cost

## Risks / Common Mistakes

**Risk: Overcomplicating the design**
- Too many attributes/levels confuses respondents
- **Mitigation:** Limit to 3-6 attributes, pre-test to ensure comprehension

**Risk: Unrealistic profiles**
- Showing impossible combinations (e.g., "budget price + premium features")
- **Mitigation:** Use QuestionPro constraints to prohibit illogical combos

**Risk: Hypothetical bias**
- People say they value something but won't pay for it
- **Mitigation:** Include realistic price points, validate findings with market data

**Risk: Poor attribute definition**
- Vague descriptions lead to inconsistent interpretation
- **Mitigation:** Be specific (e.g., "2-hour response time" not "fast support")

**Risk: Analysis paralysis**
- So much data you can't make a decision
- **Mitigation:** Focus on top 3 actionable insights, use scenarios to test key decisions

**Risk: Sample quality**
- Responses from people who'd never buy your product
- **Mitigation:** Screen rigorously, use attention checks, exclude speeders/straightliners

## Example Prompt

**User Question:**
"We're launching a new SaaS product and need to decide which features to include and what to charge. We have 5 potential features and 4 price points to consider."

**AI Response Would Include:**
"Use Choice-Based Conjoint Analysis to optimize your product configuration and pricing. Set up a conjoint study in QuestionPro with 5 attributes (your 4 features + price) and their respective levels. Survey 400 target customers, showing each person 15 choice tasks where they pick between different feature-price combinations. QuestionPro will calculate part-worth utilities and feature importance, revealing which features drive the most value and how much customers will pay for each. Expected outputs: (1) Feature importance ranking showing which of the 5 features matter most, (2) Willingness-to-pay showing the dollar value of each feature, (3) Optimal product configuration that maximizes preference, (4) Price elasticity curve showing demand at each price point, (5) Market share simulation comparing your top 3 product-price scenarios. Use this to decide which features to include in your launch SKU and what price maximizes revenue."
