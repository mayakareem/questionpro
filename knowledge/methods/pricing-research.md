# Pricing Research

## Plain English Definition

Research designed to understand what customers are willing to pay for your product or service, which price points maximize revenue or adoption, and how price-sensitive different customer segments are. It's about finding the sweet spot between value capture and market acceptance.

## Best Used When

- You're launching a new product and don't know what to charge
- You're considering a price increase or change and want to understand impact
- You need to justify pricing to stakeholders with data
- You want to understand how much value each feature adds to willingness to pay
- You're entering a new market or segment with different pricing dynamics
- You need to optimize pricing tiers or packaging
- You want to understand competitive price positioning

## Not Ideal When

- Your pricing is already set by market standards or regulations
- You're selling a commodity where price is the only differentiator
- You have very limited data or small market (can't get reliable sample)
- Price is not a primary decision factor for your customers
- You need immediate pricing decisions (pricing research takes time)
- You're testing enterprise deals that are all custom-negotiated

## Typical Business Questions It Answers

- "What should we charge for our new premium tier?"
- "How much will we lose in customers if we raise our price by 20%?"
- "What's the maximum price customers will pay before switching to competitors?"
- "Which features justify a higher price point?"
- "Should we offer monthly vs annual pricing, and at what discount?"
- "How price-sensitive are enterprise customers vs SMBs?"
- "What's the optimal price to maximize revenue?"

## Budget & Timeline Reality Check

### Van Westendorp Price Sensitivity Study

**Cost:** $5-8K total
- QuestionPro license: Research Edition required ($299/mo)
- Panel respondents: 200-300 × $10-12 per complete = $2,000-3,600
- Your time: 15-20 hours @ $150/hr = $2,250-3,000

**Timeline:** 2-3 weeks
- Week 1: Survey design, questionnaire
- Week 2: Field survey
- Week 3: Analysis and reporting

**Best for:** Quick pricing decisions, revenue impact <$500K

### Conjoint Analysis for Pricing + Features

**Cost:** $20-35K total
- QuestionPro license: Research Edition ($299/mo)
- Panel: 400-500 × $12-15 = $4,800-7,500
- Your time: 40-50 hours @ $150/hr = $6,000-7,500
- Analysis complexity: May need expert help (+$5-10K)

**Timeline:** 4-6 weeks
- Week 1-2: Design (complex - needs expertise)
- Week 3-4: Field survey
- Week 5-6: Analysis and market simulation

**Best for:** High-stakes decisions >$2M impact, optimizing price + features

### ROI Rule of Thumb

**Spend 1-2% of decision value on research:**
- Launching $10M product → justify $100-200K research
- Testing $50/mo price change affecting 1,000 customers ($600K annual impact) → $6-12K study is appropriate
- Pricing a $5 product with 100 customers → probably skip formal research, do customer interviews instead

## Sample / Audience Guidance

**Sample Size:**
- Van Westendorp: 200-300 minimum (simple pricing questions)
- Conjoint Analysis: 300-500+ (testing features + price)
- Gabor-Granger: 200+ per price point tested

**Who to Target:**
- Current customers (will they stay at new price?)
- Target prospects (will they buy at this price?)
- Churned customers (was price a factor?)
- Competitor customers (what price would make them switch?)

**Recruitment:**
- Use customer email lists
- QuestionPro panels for market reach
- Ensure respondents match your buyer profile (not just anyone)

## Core Design Elements

**Pricing Research Methods:**

1. **Van Westendorp (Price Sensitivity Meter)**
   - 4 questions: too cheap, cheap, expensive, too expensive
   - Identifies acceptable price range
   - Fast and easy but doesn't account for features/competition

2. **Gabor-Granger**
   - Show price, ask "would you buy?"
   - Test multiple price points
   - Estimates demand curve
   - Simple but doesn't show trade-offs

3. **Conjoint Analysis (Best for Complex Pricing)**
   - Test price alongside features in choice scenarios
   - Shows how much each feature contributes to value
   - Reveals optimal price-feature bundles
   - See separate Conjoint method guide for details

4. **Direct Question (Risky but Fast)**
   - "What would you pay for this?"
   - People under-estimate what they'd actually pay
   - Use only for directional input, not final pricing

## Typical QuestionPro Workflow

**Van Westendorp Approach:**

1. **Build Survey**
   - Describe your product clearly
   - Ask four price questions:
     - "At what price would this be so expensive you would not consider it?"
     - "At what price would you consider this expensive but still consider it?"
     - "At what price would you consider this a bargain?"
     - "At what price would this be so cheap you'd question the quality?"

2. **Distribute**
   - Send to 200-300 target customers via QuestionPro
   - Ensure sample represents your market

3. **Analyze**
   - QuestionPro PSM module automatically calculates:
     - Optimal Price Point (OPP)
     - Indifference Price Point (IPP)
     - Acceptable price range
   - View price sensitivity charts

4. **Interpret**
   - Optimal price = where "too expensive" and "too cheap" lines cross
   - Acceptable range = between "too cheap" and "too expensive"
   - Test prices within this range

**Gabor-Granger Approach:**

1. **Build Survey**
   - Show product description
   - Ask "Would you buy this at $X?"
   - If yes, ask again at higher price
   - If no, ask at lower price
   - Continue until you find their threshold

2. **Analyze**
   - Plot % willing to buy at each price
   - Calculate revenue curve (price × demand)
   - Identify price that maximizes revenue

**For Complex Scenarios:** Use Conjoint (see conjoint.md)

## Expected Outputs

- **Optimal Price Point:** The price that maximizes revenue or market share
- **Price Range:** Minimum and maximum acceptable prices
- **Demand Curve:** How many people buy at each price point
- **Revenue Curve:** Which price generates the most revenue
- **Price Elasticity:** How sensitive customers are to price changes
- **Segment Differences:** How price sensitivity varies by customer type
- **Feature Value:** How much each feature contributes to willingness to pay (conjoint)

## How To Interpret The Output

**Van Westendorp:**
- **Optimal Price Point (OPP):** Start here as your base price
- **Range of Acceptable Prices:** Don't price outside this range
- **Indifference Point:** Price where equal numbers find it cheap vs expensive
- **Wide range:** You have pricing flexibility
- **Narrow range:** Market has strong price expectations

**Gabor-Granger:**
- **Steep drop-off:** Customers are price-sensitive
- **Gradual decline:** More pricing power
- **Revenue peak:** Price that balances volume and margin
- **Consider:** Revenue max vs market share goals

**General Insights:**
- Premium segments have higher willingness to pay
- New products can command higher prices if differentiated
- Match price to perceived value (too cheap = suspicious quality)

**Decision Framework:**
- If revenue maximization: Choose price at revenue peak
- If market share goal: Price below OPP
- If premium positioning: Price at high end of acceptable range
- If freemium: Price paid tier where value > free tier significantly

## Risks / Common Mistakes

**Risk: Hypothetical bias**
- What people say they'll pay ≠ what they actually pay
- **Mitigation:** Test pricing in real market (A/B test on website), use realistic scenarios

**Risk: Context matters**
- Pricing in isolation ignores competition, alternatives, value perception
- **Mitigation:** Show competitive context, mention alternatives, explain value clearly

**Risk: Survey design flaws**
- Confusing questions, unrealistic scenarios
- **Mitigation:** Use established methods (Van Westendorp, Gabor-Granger), pilot test first

**Risk: Wrong sample**
- Surveying people who won't actually buy
- **Mitigation:** Screen for real buyers, match demographics to target market

**Risk: Ignoring segments**
- One price doesn't fit all customers
- **Mitigation:** Analyze by segment, consider tiered pricing

**Risk: Feature confusion**
- Price alone without understanding features
- **Mitigation:** Use conjoint to test price + features together

## Example Prompt

**User Question:**
"We're launching a new SaaS premium tier and don't know what to charge. How do we figure out pricing?"

**AI Response Would Include:**
"Run pricing research using Van Westendorp for a quick price range, then validate with conjoint analysis if you have multiple features to test. Survey 300-400 target customers (current users + prospects who fit premium profile). Use QuestionPro's PSM module to ask the four Van Westendorp questions about your premium tier. This will give you an optimal price point and acceptable range. If your premium tier includes multiple features, follow up with conjoint analysis to understand which features justify premium pricing. Expected outputs: recommended price point (e.g., $199/month), acceptable range ($149-$249), and demand curve showing how many customers you'll lose/gain at different prices. Test the recommended price with a small beta group before full launch."
