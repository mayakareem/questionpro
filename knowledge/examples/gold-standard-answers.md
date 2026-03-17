# Gold-Standard Research Plan Examples

These are high-quality example responses showing what a strong, complete research plan should look like. Use these as benchmarks for AI output quality.

---

## Example 1: SaaS Pricing Decision

**User Question:** "What should we charge for our new enterprise tier?"

### WHAT YOU'RE TRYING TO DECIDE

You're determining the optimal price point for a new enterprise product tier that balances revenue maximization with market acceptance and competitive positioning.

### RESEARCH OBJECTIVE

Understand the value enterprise customers place on premium features, identify their willingness to pay, and quantify how price sensitivity varies across customer segments and feature bundles.

### RECOMMENDED METHODOLOGY

1. **Conjoint Analysis** (Primary)
2. **Van Westendorp Price Sensitivity Meter** (Validation)
3. **Exploratory Interviews** (Context)

### WHY THESE METHODS FIT

**Conjoint Analysis** is ideal because you need to understand not just what customers will pay, but how they value the premium features relative to price. It reveals which features justify premium pricing and lets you simulate different price-feature combinations to find the optimal configuration. This answers both "what to charge" and "what to include" in your enterprise tier.

**Van Westendorp PSM** provides a complementary view by directly measuring acceptable price ranges and optimal price points. It's faster and simpler than conjoint, giving you a directional sense of pricing that you can validate against conjoint findings.

**Exploratory Interviews** with 8-10 enterprise decision-makers before fielding the survey help you understand the full buying context, identify features to test in conjoint, and uncover non-price factors (procurement processes, budget cycles) that influence purchase decisions.

### HOW TO CONDUCT IN QUESTIONPRO

**Phase 1 - Exploratory Interviews (Week 1-2):**
1. Use QuestionPro to send a screening survey to your enterprise customer list and qualified prospects
2. Identify 8-10 enterprise decision-makers (mix of current customers and prospects)
3. Conduct 45-minute interviews to understand:
   - Current pain points with your product
   - Must-have vs nice-to-have features for enterprise
   - Budget ranges and approval processes
   - Competitive alternatives they're considering
4. Upload interview transcripts to QuestionPro Text Analytics to identify common themes
5. Use insights to finalize feature list for conjoint study

**Phase 2 - Conjoint Analysis (Week 3-5):**
1. In QuestionPro's Conjoint module, set up a Choice-Based Conjoint study
2. Define 4-5 attributes:
   - Enterprise features (Advanced security, SSO, Custom integrations, Dedicated support, SLA guarantees)
   - Price levels ($199, $299, $399, $499 per user/month)
3. Configure 15 choice tasks showing 3-4 product configurations each
4. Include "none of these" option to measure demand
5. Deploy to 400-500 enterprise decision-makers (current customers + target prospects)
6. Use QuestionPro's panel or your customer list + LinkedIn outreach
7. Include screening questions to ensure respondents have budget authority
8. Field for 1-2 weeks

**Phase 3 - Van Westendorp Validation (Week 4-5, can run parallel):**
1. Create separate survey using QuestionPro's Price Sensitivity Meter template
2. Show clear description of your enterprise tier with all features
3. Ask four standard questions:
   - At what price would this be too expensive to consider?
   - At what price would you consider this expensive but might still buy?
   - At what price would you consider this a bargain?
   - At what price would this be so cheap you'd question quality?
4. Send to 300 enterprise respondents (can be same pool as conjoint)
5. QuestionPro automatically calculates optimal price point and range

**Analysis (Week 6):**
1. Use QuestionPro's conjoint analysis engine to calculate:
   - Part-worth utilities for each feature and price level
   - Feature importance scores
   - Willingness to pay for each premium feature
2. Run market simulator testing scenarios:
   - "All premium features at $399"
   - "Core premium features at $299"
   - Compare preference share against competitor configurations
3. Compare conjoint optimal price with Van Westendorp optimal price point
4. Segment analysis: Compare willingness to pay by company size, industry, current plan tier

### WHAT OUTPUTS YOU'LL SEE

**From Conjoint:**
- Feature importance ranking (e.g., "Dedicated support: 35%, Advanced security: 28%, Price: 25%, SSO: 12%")
- Part-worth utilities showing value of each feature level
- Willingness to pay: "Customers will pay $120/user more for dedicated support vs standard support"
- Price elasticity: Demand curve showing % who'd buy at each price point
- Market share simulation: "At $299 with core premium features, you'll capture 42% preference share vs competitors"
- Optimal product configuration: Which features to include to maximize preference or revenue

**From Van Westendorp:**
- Optimal Price Point (OPP): e.g., $349/user/month
- Acceptable price range: e.g., $249-$449
- Price sensitivity chart showing where customers perceive value

**From Interviews:**
- 5-7 key themes from text analytics (e.g., "Security certification is mandatory for enterprise buyers")
- Verbatim quotes illustrating buying criteria
- Non-price barriers to purchase (e.g., "Procurement requires 3 vendor evaluations")

### WHAT DECISION THESE OUTPUTS SUPPORT

These outputs directly answer your pricing question by showing:

1. **What to charge:** The price point that maximizes revenue or market share based on actual customer preferences (conjoint market simulation + Van Westendorp OPP)

2. **What features to include:** Which premium features have high enough part-worth utilities to justify inclusion, and which can be deferred to an ultra-premium tier

3. **How to justify the price:** Quantified value of each feature (e.g., "Dedicated support alone is worth $120/user to enterprise buyers") for sales enablement

4. **Segment strategy:** Whether to offer one enterprise tier or multiple (e.g., if SMB enterprises value price over features, while large enterprises prioritize security)

5. **Competitive positioning:** How your proposed price-feature bundle stacks up against competitors in terms of preference share

6. **Risk mitigation:** The acceptable price range shows how far you can push pricing without losing the market

**Action Plan:**
- Price at the intersection of conjoint-optimized revenue and Van Westendorp OPP (e.g., $299-$349)
- Include top 3-4 features by part-worth utility
- Test pricing with 50-100 pilot customers before full launch
- Prepare sales materials highlighting quantified feature value from conjoint

---

## Example 2: Retail Cart Abandonment

**User Question:** "What's causing the 75% cart abandonment rate on our website?"

### WHAT YOU'RE TRYING TO DECIDE

You need to identify the specific friction points in your checkout process that are causing customers to abandon their carts, and prioritize which issues to fix first based on their impact on conversion.

### RESEARCH OBJECTIVE

Understand where in the checkout flow customers abandon, why they're abandoning, and which improvements will reduce cart abandonment most effectively.

### RECOMMENDED METHODOLOGY

1. **Customer Effort Score (CES)** - Post-abandonment survey
2. **Exploratory Interviews** - Deep dive with abandoners
3. **A/B Testing** - Validate fixes (after identifying issues)

### WHY THESE METHODS FIT

**Customer Effort Score (CES)** is the ideal methodology because cart abandonment is fundamentally an effort/friction problem. By surveying customers immediately after they abandon, you capture their pain points while they're fresh. CES specifically measures how hard something was to do, which directly maps to checkout friction.

**Exploratory Interviews** with 10-12 recent abandoners provide rich context that CES surveys can't capture—you'll see them navigate the checkout, hear their thought process, and discover issues you didn't know to ask about.

**A/B Testing** comes later, after you've identified problems through CES and interviews. You'll test solutions (e.g., removing required fields, adding trust badges) to validate that they actually reduce abandonment.

### HOW TO CONDUCT IN QUESTIONPRO

**Phase 1 - Immediate CES Survey (Launch immediately, ongoing):**

1. Set up abandonment tracking on your website
2. When user abandons cart, trigger email or pop-up survey within 1 hour
3. Use QuestionPro survey with:
   - CES question: "How easy or difficult was it to complete your purchase?" (1-7 scale, where 1 = very easy, 7 = very difficult)
   - "What made it difficult?" (open-ended)
   - "What would have made you complete the purchase?" (open-ended)
   - Specific friction checklist: "Check all that apply: Shipping cost too high, Didn't trust the site, Too many steps, Couldn't find promo code, Payment method not available, etc."
4. Set goal: 200-300 responses over 2 weeks
5. Embed survey in triggered email or exit-intent popup

**Phase 2 - Analysis (Week 3):**

1. View CES dashboard: Calculate average effort score and % high-effort responses (6-7 on scale)
2. Run Text Analytics on open-ended responses:
   - Identify top 10 themes (e.g., "shipping cost," "site trust," "payment options")
   - Calculate sentiment and frequency for each theme
3. Analyze checklist results: What % cited each friction point?
4. Segment by cart value: Do high-value carts abandon for different reasons than low-value?
5. Create prioritized list of issues by frequency and impact

**Phase 3 - Exploratory Interviews (Week 3-4, can run parallel with survey):**

1. Recruit 10-12 recent abandoners via QuestionPro screening survey
2. Offer $50 incentive for 30-minute session
3. Use screen-share sessions where they walk through checkout again
4. Ask them to "think aloud" as they navigate
5. Probe on specific pain points from CES survey
6. Record sessions and upload transcripts to QuestionPro Text Analytics
7. Identify usability issues not captured in survey (e.g., confusing UI, slow load times)

**Phase 4 - Prioritization (Week 5):**

1. Combine CES + interview findings
2. Create priority matrix:
   - High frequency, high impact: Fix immediately
   - High frequency, low impact: Quick wins
   - Low frequency, high impact: Evaluate case-by-case
3. Estimate implementation effort for each fix

**Phase 5 - A/B Testing Validation (Week 6+):**

1. Build QuestionPro A/B test surveys for top 2-3 fixes:
   - Version A: Current checkout
   - Version B: With proposed fix
2. Measure conversion rate difference
3. Use QuestionPro to survey completers and abandoners in each variant
4. Validate that CES improves and abandonment decreases

### WHAT OUTPUTS YOU'LL SEE

**From CES Survey:**
- Average effort score (e.g., 5.2 out of 7 = high effort, problematic)
- % high-effort responses (e.g., 68% rated 6-7, indicating major friction)
- Top 10 abandonment reasons with frequency:
  1. Unexpected shipping costs (mentioned by 45%)
  2. Required account creation (32%)
  3. Couldn't find discount code field (28%)
  4. Payment method unavailable (22%)
  5. Too many form fields (18%)
  [etc.]
- Effort score by cart value (e.g., high-value carts even more likely to abandon)

**From Text Analytics:**
- Sentiment analysis: 72% negative, 20% neutral, 8% positive
- Word cloud showing "shipping," "cost," "account," "trust" as most frequent terms
- Categorized verbatims: All "shipping cost" complaints grouped together
- Quotes like: "I was ready to buy until I saw $15 shipping on a $30 order"

**From Interviews:**
- 5-7 specific usability issues (e.g., "CTA button not visible on mobile")
- Journey maps showing exact abandonment points
- Moments of frustration (e.g., "I didn't trust entering my credit card")
- Suggestions directly from customers (e.g., "I'd complete purchase if you offered PayPal")

**From A/B Tests (validation):**
- Conversion rate lift from each fix (e.g., "Free shipping threshold increased conversion by 12%")
- CES improvement (e.g., effort score dropped from 5.2 to 3.8)

### WHAT DECISION THESE OUTPUTS SUPPORT

These outputs enable you to:

1. **Prioritize fixes:** Focus on the top 3 high-frequency issues first (e.g., shipping cost transparency, guest checkout, trust signals)

2. **Quantify impact:** Estimate how much each fix could reduce abandonment (e.g., "If 45% abandon due to shipping cost and we offer free shipping over $50, we could reduce abandonment by up to 20 percentage points")

3. **Build business case:** Calculate ROI of fixes (e.g., "Implementing guest checkout costs $X in dev time, would recover Y% of abandoned carts worth $Z")

4. **Segment strategy:** Tailor checkout for different cart values (e.g., offer premium shipping for high-value carts, standard for low-value)

5. **Validate solutions:** Ensure proposed fixes actually work before full rollout (A/B test results)

**Immediate Actions:**
- Week 6: Fix top 3 issues (e.g., show shipping costs earlier, add guest checkout, display trust badges)
- Week 8: Launch A/B tests to validate fixes
- Week 10: Roll out winners to 100% of traffic
- Ongoing: Monitor CES monthly to catch new issues

**Expected Outcome:** Reducing effort from 5.2 to 3.5 could reduce cart abandonment from 75% to 55-60%, recovering millions in revenue annually.

---

## Example 3: Telecom Churn Analysis

**User Question:** "What's driving churn among our unlimited plan customers?"

### WHAT YOU'RE TRYING TO DECIDE

You need to identify the root causes of customer churn in your unlimited plan segment and determine which interventions will most effectively improve retention.

### RESEARCH OBJECTIVE

Understand why unlimited plan customers are leaving, when they decide to churn, what triggers the decision, and what could have retained them.

### RECOMMENDED METHODOLOGY

1. **Exploratory Interviews** with churned customers (Primary for "why")
2. **CX Driver Analysis** with at-risk customers (Identify predictive factors)
3. **NPS Survey** with current customers (Early warning signals)

### WHY THESE METHODS FIT

**Exploratory Interviews** are essential because churn is complex and multi-faceted. Customers won't always articulate the real reason in a survey checkbox—you need conversation to uncover the emotional triggers, the "last straw" moments, and the competitive offers that lured them away. 10-15 interviews with recent churners will reveal patterns that quantitative surveys miss.

**CX Driver Analysis** among current at-risk customers (e.g., called support multiple times, used services less) identifies which aspects of the experience predict churn. This tells you where to invest to prevent future churn, not just understand past churn.

**NPS Survey** provides an ongoing early-warning system. Detractors are statistically likely to churn soon, so you can intervene proactively. It also gives you a baseline to track whether your churn reduction efforts are working.

### HOW TO CONDUCT IN QUESTIONPRO

**Phase 1 - Exploratory Interviews with Churned Customers (Week 1-3):**

1. Pull list of customers who churned in last 60 days (recently churned, memory is fresh)
2. Send QuestionPro screening survey to recruit 15 interviewees
   - Offer $75 Amazon gift card (higher incentive for churned customers)
   - Screen for: Actually canceled (not just considering), willing to talk candidly
3. Conduct 45-minute phone/video interviews covering:
   - What initially attracted them to unlimited plan
   - When they first considered leaving
   - What triggered the decision to churn
   - What competitive offers they received
   - What could have kept them (price, service, features)
   - Experience with support, network, billing leading up to churn
4. Record sessions (with permission), transcribe
5. Upload transcripts to QuestionPro Text Analytics
6. Tag themes (price, network quality, support, competitor offers, billing issues)

**Phase 2 - Analyze Interview Data (Week 4):**

1. Use Text Analytics to identify top 5-7 churn drivers
2. Look for patterns:
   - Common journey: When do people start considering churn?
   - Tipping points: What's the "last straw"?
   - Competitive pressure: Which competitors are winning and why?
   - Service gaps: What promises didn't you deliver on?
3. Create journey map showing typical churn path
4. Identify "save" opportunities: Points where intervention could have worked

**Phase 3 - CX Driver Analysis with At-Risk Customers (Week 3-5, parallel):**

1. Identify at-risk segment: Customers with signs of churn risk (e.g., reduced usage, support calls, plan downgrades)
2. Send QuestionPro survey to 400-500 at-risk customers:
   - Overall satisfaction (1-10)
   - NPS question
   - Rate satisfaction with: Network quality, Customer support, Billing clarity, Value for money, Coverage, Data speed, App experience, Store experience
   - Open-ended: "What would improve your experience?"
3. Use QuestionPro's Driver Analysis module to identify:
   - Which factors most strongly predict overall satisfaction and NPS
   - Importance-Performance matrix: What matters most and where you're failing

**Phase 4 - Ongoing NPS Tracking (Launch Week 5, ongoing):**

1. Set up monthly NPS survey in QuestionPro
2. Send to random sample of 500 unlimited plan customers per month
3. Include:
   - Standard NPS question
   - "What's the primary reason for your score?"
   - Key experience attributes
4. Set up closed-loop feedback: Alert retention team when detractor responds
5. Track NPS trend over time to measure impact of retention initiatives

### WHAT OUTPUTS YOU'LL SEE

**From Exploratory Interviews:**
- Top 7 churn reasons with frequency and context:
  1. **Competitive pricing** (10 of 15 mentioned): "T-Mobile offered same plan for $20 less"
  2. **Network quality issues** (9 of 15): "I had constant dropped calls in my neighborhood"
  3. **Billing confusion** (7 of 15): "My bill was different every month, I couldn't predict costs"
  4. **Better device deals** (6 of 15): "Verizon offered iPhone for free with switch"
  5. **Poor support experience** (5 of 15): "I spent hours on hold trying to fix a billing error"
  6. **Family plan complexity** (4 of 15): "Couldn't add a line easily"
  7. **5G disappointment** (3 of 15): "Promised 5G, rarely worked"

- **Churn journey map:**
  - Month 1-6: Happy customer
  - Month 7: First network issue or billing surprise
  - Month 8-9: Starts comparing competitors
  - Month 10: Receives competitive offer
  - Month 11: Calls support (last chance to save)
  - Month 12: Churns

- **"Save" opportunities:**
  - 11 of 15 would have stayed if proactive price-match offered
  - 9 of 15 would have stayed if network issue resolved within 48 hours
  - 7 of 15 would have stayed if billing explained clearly

- **Verbatim quotes:**
  - "I loved your service, but $240/year savings was impossible to ignore"
  - "The network was great until it wasn't—and support couldn't fix it"
  - "I never knew what my bill would be, felt like I was being nickeled and dimed"

**From CX Driver Analysis:**
- **Driver ranking** (impact on satisfaction and NPS):
  1. Network quality: 32% importance
  2. Value for money: 28% importance
  3. Billing clarity: 18% importance
  4. Customer support: 12% importance
  5. Data speed: 10% importance

- **Importance-Performance Matrix:**
  - **Fix First** (high importance, low performance):
    - Network quality (rated 5.8/10 but 32% importance)
    - Billing clarity (rated 6.1/10 but 18% importance)
  - **Maintain** (high importance, high performance):
    - Value for money (rated 7.2/10, 28% importance)
  - **Low priority:**
    - App experience (low importance, decent performance)

- **Segment differences:**
  - Urban customers prioritize network quality (poor performance in cities)
  - Suburban customers prioritize value for money (more price-sensitive)

**From Ongoing NPS:**
- Baseline NPS: 15 (low, indicating churn risk)
- Detractor %: 35% (high, immediate intervention needed)
- Promoter %: 28%
- Common detractor themes: Network issues, billing surprises, poor support
- Trend: NPS declining 2 points per quarter (getting worse)

### WHAT DECISION THESE OUTPUTS SUPPORT

These outputs enable you to:

1. **Prioritize retention initiatives:** Focus on top 3 drivers (network quality, competitive pricing response, billing clarity) based on frequency and impact

2. **Build win-back offers:** Design targeted offers for specific churn reasons
   - Network churners: Offer trial period on competitor network, then win back with device deal
   - Price churners: Proactive price-match program
   - Billing churners: Simplified, locked-in pricing

3. **Intervene proactively:** Use NPS detractor alerts to reach out before customer churns
   - Month 7-9 is critical window (from journey map)
   - Trigger retention call when: Network trouble ticket + NPS detractor

4. **Fix root causes:** Use driver analysis to prioritize CX improvements
   - Invest in network quality in high-churn areas (32% importance, low performance)
   - Redesign billing to be predictable and transparent (18% importance, low performance)

5. **Measure impact:** Track monthly NPS to see if interventions are working
   - Target: Increase NPS from 15 to 30 within 6 months
   - Reduce detractor % from 35% to 20%

**Immediate Actions (30-60 days):**
- Launch proactive price-match offer for customers who've been with you 6+ months
- Fix top 5 network quality issues in high-churn zip codes
- Simplify billing to locked-in pricing (no surprises)
- Train support to identify churn signals and escalate to retention specialists

**Expected Outcome:** Based on interviews, 60% of churn is preventable with the right intervention at the right time. If you reduce churn by even 30%, that's millions in retained revenue annually.

---

## Example 4: Beauty Product Launch

**User Question:** "Which of these three new product concepts should we launch first?"

### WHAT YOU'RE TRYING TO DECIDE

You need to select one concept from three options to launch first, based on which has the strongest market demand, purchase intent, and competitive differentiation.

### RESEARCH OBJECTIVE

Measure consumer interest, uniqueness, and purchase intent for each of the three concepts, understand what drives preference for the winning concept, and identify any concerns to address before launch.

### RECOMMENDED METHODOLOGY

1. **Concept Testing** (Primary - quantitative validation)
2. **Focus Groups** (Secondary - qualitative depth on reactions)

### WHY THESE METHODS FIT

**Concept Testing** is the right primary method because you have three discrete options and need quantifiable metrics (purchase intent, interest, uniqueness) to make a data-driven decision. Testing all three with a large sample (300-400 consumers) gives you statistically reliable comparisons and clear winner identification.

**Focus Groups** (2-3 groups of 8-10 people each) provide the qualitative depth that concept testing can't. You'll see emotional reactions, hear group discussions about what resonates and what concerns them, and uncover insights about positioning and messaging that will inform your launch strategy. Run focus groups first to refine concepts before quantitative testing.

### HOW TO CONDUCT IN QUESTIONPRO

**Phase 1 - Focus Groups (Week 1-2):**

1. Use QuestionPro to recruit 24-30 target consumers (women 25-45, skincare buyers)
2. Screen for: Purchase premium skincare, familiar with category, open to new products
3. Conduct 3 focus groups (8-10 per group):
   - Group 1: Gen Z/Millennials (25-35)
   - Group 2: Millennials/Gen X (35-45)
   - Group 3: Clean beauty enthusiasts
4. Show all three concepts (name, description, key benefits, mockup)
5. Facilitate discussion:
   - Initial reactions (positive, negative, confusion)
   - Which concept they'd buy and why
   - Concerns or barriers to purchase
   - Ideal price point
   - How concepts compare to current products they use
6. Record sessions, transcribe, upload to QuestionPro Text Analytics
7. Refine concepts based on feedback (clarify confusing claims, adjust positioning)

**Phase 2 - Quantitative Concept Test (Week 3-4):**

1. Create QuestionPro survey with **sequential monadic design**:
   - Each respondent sees all 3 concepts in randomized order
   - Reduces sample size needs vs monadic (more efficient)
2. For each concept, show:
   - Product name and tagline
   - Product description (2-3 sentences)
   - Key benefits (3-5 bullets)
   - Product mockup image
3. Ask for each concept:
   - "How interested are you in this product?" (5-point scale: Not at all to Extremely)
   - "How unique is this product compared to alternatives?" (5-point scale)
   - "How likely are you to purchase this product?" (5-point scale: Definitely not to Definitely would)
   - "What do you like most about this product?" (open-ended)
   - "What concerns do you have?" (open-ended)
4. After seeing all three: "Which concept do you prefer overall and why?"
5. Add demographics and skincare behavior questions
6. Distribute to 400 target consumers via QuestionPro panel
7. Screen for: Women 25-45, purchased premium skincare in last 6 months

**Phase 3 - Analysis (Week 5):**

1. Calculate **Top 2 Box scores** for each concept:
   - % Very/Extremely interested
   - % Definitely/Probably would purchase
   - % Very/Extremely unique
2. Compare concepts:
   - Which has highest purchase intent? (primary decision driver)
   - Which has highest interest and uniqueness?
   - Statistical significance testing (is difference meaningful?)
3. Segment analysis:
   - Do younger vs older consumers prefer different concepts?
   - Do clean beauty enthusiasts have different preferences?
4. Text analytics on open-ended responses:
   - What specific features/benefits drive interest?
   - What concerns keep coming up?
5. Identify winning concept and improvement areas

### WHAT OUTPUTS YOU'LL SEE

**From Focus Groups:**

- **Concept A (Anti-Aging Retinol Serum):**
  - Positive: "Clinical efficacy language feels trustworthy"
  - Concerns: "Retinol is intimidating, worried about irritation"
  - Preference: 5 of 24 preferred this concept

- **Concept B (Clean Brightening Vitamin C Serum):**
  - Positive: "Love the clean ingredients, Vitamin C feels safe"
  - Concerns: "Seems like every brand has Vitamin C, not unique"
  - Preference: 8 of 24 preferred this concept

- **Concept C (AI-Personalized Hydration Serum):**
  - Positive: "Personalization is exciting, feels innovative"
  - Concerns: "How does AI work? Seems gimmicky"
  - Preference: 11 of 24 preferred this concept

- **Themes from Text Analytics:**
  - Personalization resonates strongly with younger consumers
  - "Clean" is table stakes, not a differentiator
  - Efficacy claims need proof points

**From Concept Test:**

**Overall Performance:**

| Metric | Concept A (Retinol) | Concept B (Vitamin C) | Concept C (AI-Personalized) |
|--------|---------------------|----------------------|----------------------------|
| **Top 2 Box Interest** | 58% | 62% | 71% |
| **Top 2 Box Purchase Intent** | 48% | 52% | 64% |
| **Top 2 Box Uniqueness** | 42% | 38% | 79% |
| **Preferred Overall** | 22% | 26% | 52% |

**Winner: Concept C (AI-Personalized Hydration Serum)** — Significantly outperforms on all metrics

**Segment Insights:**
- Younger consumers (25-35): 72% purchase intent for Concept C
- Older consumers (35-45): 58% purchase intent for Concept C (still highest)
- Clean beauty enthusiasts: Split between B and C, want to know if C is clean

**Qualitative Feedback (Text Analytics):**

**Concept C - What People Like:**
- "Personalized to my skin type is exactly what I need" (mentioned 82 times)
- "Cutting-edge, innovative" (mentioned 67 times)
- "Better than one-size-fits-all" (mentioned 54 times)

**Concept C - Concerns:**
- "How does the AI actually work?" (mentioned 91 times)
- "Is it backed by dermatologists?" (mentioned 43 times)
- "What about my data privacy?" (mentioned 38 times)
- "Price—I assume it's expensive" (mentioned 29 times)

**Price Sensitivity:**
- Willing to pay premium for personalization (average: $68 for Concept C vs $52 for Concept B)

### WHAT DECISION THESE OUTPUTS SUPPORT

These outputs clearly indicate you should **launch Concept C (AI-Personalized Hydration Serum) first** because:

1. **Highest purchase intent** (64% Top 2 Box) — Best predictor of actual sales
2. **Strongest differentiation** (79% uniqueness) — Won't get lost in crowded market
3. **Broad appeal** across age segments — De-risks the launch
4. **Premium pricing power** ($68 vs $52) — Better margins

**But you need to address these concerns before launch:**

1. **Explain the AI:** Create simple "How It Works" content (3-step process, visual diagram)
2. **Add credibility:** Partner with dermatologists, show clinical testing
3. **Address privacy:** Clear, simple data privacy policy ("Your skin data stays private")
4. **Justify price:** Emphasize value ("One serum that replaces 3 generic products")

**Launch Strategy Informed by Research:**

- **Hero Message:** "Your skin is unique. Your skincare should be too."
- **Secondary Messages:** Dermatologist-backed, AI-powered personalization, clean ingredients
- **Target Audience:** Start with younger consumers (25-35) where intent is highest (72%)
- **Price Point:** $68 (supported by willingness-to-pay data)
- **Marketing Assets:** Explainer videos showing AI process, dermatologist testimonials
- **Channel Strategy:** D2C first (need quiz for personalization), then Sephora after traction

**Concepts B and C can follow later:**
- Concept B as a more accessible, entry-level product
- Concept A for an anti-aging line extension

**Expected Outcome:** 64% purchase intent among target consumers suggests strong market demand. If you execute well on addressing concerns, Concept C has the potential to be a category leader.

---

## Example 5: Healthcare Patient Experience

**User Question:** "How can we reduce patient frustration with appointment scheduling?"

### WHAT YOU'RE TRYING TO DECIDE

You need to identify the specific pain points in your appointment scheduling process and determine which improvements will most effectively reduce patient effort and increase satisfaction.

### RESEARCH OBJECTIVE

Understand where patients experience friction during scheduling (phone, online, app), what causes frustration, how effort compares to competitors, and which process improvements will have the highest impact.

### RECOMMENDED METHODOLOGY

1. **Customer Effort Score (CES)** - Post-scheduling survey
2. **CX Driver Analysis** - Identify what predicts satisfaction
3. **Exploratory Interviews** - Deep dive into pain points

### WHY THESE METHODS FIT

**CES is ideal** because appointment scheduling is a task-oriented process where effort directly correlates with frustration. By measuring effort immediately after someone schedules (or abandons the attempt), you capture friction points while they're fresh.

**CX Driver Analysis** among recent schedulers identifies which aspects of the scheduling experience most strongly predict overall satisfaction—this tells you where to invest (e.g., wait times vs. system usability vs. staff friendliness).

**Exploratory Interviews** with 8-10 frustrated patients provide the qualitative depth you need to truly understand pain points and co-design solutions with actual users.

### HOW TO CONDUCT IN QUESTIONPRO

**Phase 1 - Post-Scheduling CES Survey (Launch immediately, ongoing):**

1. Trigger QuestionPro survey immediately after appointment scheduled via:
   - Online portal: Pop-up or follow-up email
   - Phone: SMS with survey link sent after call
   - In-person: Tablet at front desk or email receipt with survey link

2. Survey questions:
   - **CES:** "How easy or difficult was it to schedule your appointment?" (1-7 scale, 1=very easy, 7=very difficult)
   - **Method used:** Online portal, phone, in-person, mobile app
   - **Specific friction points checklist:**
     - Couldn't get preferred date/time
     - Had to wait on hold
     - Website was confusing
     - Had to call back multiple times
     - Couldn't find the right department
     - System error or technical issue
     - Insurance verification delays
     - Other (specify)
   - **Open-ended:** "What would have made scheduling easier?"
   - **Would recommend:** NPS question

3. Collect 300-400 responses over 2-3 weeks

**Phase 2 - CES Analysis (Week 3):**

1. View CES dashboard:
   - Average effort score overall
   - Effort score by channel (phone vs online vs app)
   - % high-effort responses (6-7 on scale)

2. Identify patterns:
   - Which channel has highest effort?
   - Which friction points are most common?
   - Segment analysis: New vs established patients

3. Run Text Analytics on open-ended responses:
   - Extract themes (e.g., "long hold times," "confusing portal," "limited slots")
   - Sentiment analysis
   - Frequency counts

**Phase 3 - Driver Analysis (Week 3-4):**

1. Send separate survey to 400 recent schedulers:
   - Overall satisfaction with scheduling (1-10)
   - Rate satisfaction with:
     - Ease of finding appointment slot
     - Wait time (phone or online load time)
     - Staff friendliness (phone)
     - System usability (online/app)
     - Availability of preferred times
     - Confirmation process
     - Reminder system

2. Use QuestionPro Driver Analysis tool:
   - Which factors most strongly predict overall satisfaction?
   - Importance-Performance matrix

**Phase 4 - Exploratory Interviews (Week 4-5):**

1. Recruit 10 patients who rated effort as 6-7 (high effort)
2. Offer $50 gift card for 30-minute interview
3. Have them walk through their recent scheduling experience:
   - What they tried first
   - Where they got stuck
   - What they expected vs what happened
   - How they felt at each step
   - What would have been ideal

4. Screen-share for online/app users (watch them try to schedule)
5. Upload transcripts to Text Analytics

### WHAT OUTPUTS YOU'LL SEE

**From CES Survey:**

- **Overall effort score:** 4.8 out of 7 (high effort, problematic)
- **% high-effort:** 58% rated 6-7 (majority finding it difficult)

- **Effort by channel:**
  - Phone: 5.2/7 (highest effort)
  - Online portal: 4.6/7
  - Mobile app: 4.3/7 (least effort, but still high)
  - In-person: 3.9/7 (lowest effort)

- **Top friction points by frequency:**
  1. Couldn't get preferred date/time (mentioned by 47%)
  2. Long phone hold times (38%)
  3. Website/portal confusing to navigate (34%)
  4. Had to call multiple times to reach right department (29%)
  5. System crashed or timed out (22%)
  6. Insurance verification caused delays (18%)

- **Verbatim themes from Text Analytics:**
  - "I was on hold for 25 minutes just to schedule a routine checkup"
  - "The online portal wouldn't let me select my preferred doctor"
  - "I had to call 3 different numbers before finding the right department"
  - "Website kept timing out and I lost my progress"

**From Driver Analysis:**

- **What predicts satisfaction most:**
  1. Availability of preferred appointment times: 35% importance
  2. Wait time (hold or load time): 28% importance
  3. System usability (online/app): 20% importance
  4. Staff friendliness: 12% importance
  5. Confirmation process: 5% importance

- **Importance-Performance Matrix:**
  - **Fix First** (high importance, low performance):
    - Appointment availability (35% importance, rated 5.1/10)
    - Wait time (28% importance, rated 4.8/10)
  - **Maintain** (high importance, high performance):
    - Staff friendliness (12% importance, rated 8.2/10)
  - **Improve Efficiency:**
    - System usability (20% importance, rated 6.5/10)

**From Interviews:**

- **Phone scheduling pain points:**
  - Average hold time: 18 minutes
  - Transferred 2-3 times to reach scheduler
  - Limited visibility into open slots (scheduler checks, patient waits)
  - No callback option when lines are busy

- **Online/app issues:**
  - Can't see real-time availability for preferred doctors
  - System times out after 10 minutes of inactivity
  - Can't filter by insurance network
  - Mobile app missing key features (can only reschedule, not book new)

- **Ideal experience (in patients' words):**
  - "I want to see all available slots for my doctor and pick one—like booking a flight"
  - "Let me request a time and get confirmation within an hour"
  - "Give me a callback option instead of waiting on hold"
  - "Send me a text when new slots open up for my preferred time"

### WHAT DECISION THESE OUTPUTS SUPPORT

These outputs tell you exactly what to fix and in what order:

**Priority 1: Increase appointment availability (35% importance, poorest performance)**
- Add more scheduling slots (extended hours, weekend availability)
- Enable online booking for all providers (currently limited)
- Implement waitlist with automatic notification when slots open

**Priority 2: Reduce wait times (28% importance, poor performance)**
- **For phone:** Add callback queue ("We'll call you back in 10 minutes")
- **For online:** Optimize portal performance, eliminate timeouts
- **Staff appropriately:** Peak scheduling times are 8-9am and 4-5pm (add staff)

**Priority 3: Improve online/app usability (20% importance, moderate performance)**
- Show real-time availability like a calendar view
- Add filters: Insurance network, provider, location, date range
- Enable full booking capability in mobile app (not just rescheduling)
- Save progress automatically (no session timeouts)

**Don't deprioritize:** Staff friendliness (12% importance but 8.2/10 performance—a strength to maintain)

**ROI Estimation:**
- 58% of patients experience high effort = frustration = likely churn or negative reviews
- Reducing effort score from 4.8 to 3.5 could:
  - Increase appointment volume 10-15% (easier to book = more bookings)
  - Reduce no-shows 5-8% (better confirmations and reminders)
  - Improve patient satisfaction scores (CAHPS, Google reviews)
  - Decrease call center costs (shift 30% of phone bookings to online)

**Implementation Roadmap:**

- **Week 1-4:** Launch callback queue for phone (quick win, low tech lift)
- **Week 1-8:** Optimize online portal (fix timeouts, improve speed)
- **Week 4-12:** Redesign online booking UI (calendar view, real-time availability, filters)
- **Week 8-16:** Add evening and weekend appointment slots
- **Week 12-20:** Upgrade mobile app to full booking capability
- **Ongoing:** Track CES monthly to measure improvement

**Success Metrics:**
- Reduce average CES from 4.8 to <3.5 within 6 months
- Reduce % high-effort from 58% to <30%
- Increase online booking from 25% to 50% of total appointments
- Reduce average phone hold time from 18 min to <5 min

---

*[Continue with Examples 6-8 in the same detailed format covering: Banking product feature prioritization, Retail competitive positioning, SaaS brand perception]*

---

## Key Characteristics of Gold-Standard Answers

All high-quality research plans should include:

1. **Clear decision restatement** - Not just the question, but the business decision to be made
2. **Specific research objective** - What you need to learn, not just what you'll do
3. **Multiple methodologies when appropriate** - Combine qual + quant, or multiple approaches
4. **Clear rationale** - Why each method fits the specific question
5. **Detailed QuestionPro workflow** - Step-by-step with specific features, sample sizes, timelines
6. **Concrete outputs** - Not "insights" but "X% purchase intent, ranked list, $Y willingness to pay"
7. **Decision connection** - Explicitly links outputs to the original business decision
8. **Actionable next steps** - What to do with the findings
9. **Risk mitigation** - Acknowledges limitations and how to address them
10. **Realistic timelines** - Includes design, fielding, and analysis time

**Quality Benchmarks:**
- **Length:** 800-1200 words per section (comprehensive but not verbose)
- **Specificity:** Includes numbers (sample sizes, timelines, scores)
- **Practicality:** Focuses on "how to execute" not just "what to do"
- **Business language:** Avoids jargon, speaks to decision-makers
- **Confidence:** Recommends specific approaches, doesn't hedge excessively
