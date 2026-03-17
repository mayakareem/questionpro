# Concept Testing

## Plain English Definition

A research method where you show people descriptions, mockups, or prototypes of a product, feature, or message before you build it, then measure their interest, understanding, and likelihood to use it. Think of it as a "market test" before investing in full development.

## Best Used When

- You have multiple concepts and need to pick the best one
- You want to validate demand before building something expensive
- You need to understand if people "get" your idea and find it valuable
- You're choosing between different value propositions or messaging approaches
- You want to identify which features drive the most interest
- You need stakeholder buy-in backed by data (not just opinions)
- You're about to launch and want to reduce risk

## Not Ideal When (And What to Do Instead)

**Your concept is too complex to explain without a live demo:**
- Problem: B2B software with deep technical features, multi-step workflows
- Use instead: Prototype testing + screen-sharing (8-10 users, 2 weeks, $3-5K)
- Or: Create explainer video + concept test (better comprehension)
- Or: Interactive prototype testing (Figma/mockup walkthrough, 10-15 users)

**You need actual usage behavior, not hypothetical interest:**
- Problem: "Would you use this?" ≠ "Will you actually use this?"
- Use instead: Beta test with 50-100 users (4-6 weeks, track real usage metrics)
- Or: A/B test in your product if you can build lightweight version
- Or: Free trial with limited features (measure conversion not stated intent)

**Concept requires hands-on experience:**
- Problem: Physical products, complex UX, experiential services (e.g., VR app, cooking tool)
- Use instead: In-person usability testing (10-15 users, $8-12K)
- Or: Ship prototypes for at-home testing (longer timeline, $10-15K)
- Or: Focus groups with physical demos (6-8 people × 3 groups, $8-10K)

**Testing subtle, incremental improvements:**
- Problem: "Current button" vs "New button" too subtle for concept test
- Use instead: A/B test in production (2-4 weeks, low cost, real behavior)
- Or: Eye-tracking if you need to understand WHY (15-20 users, $8-12K)
- Or: Session recording analysis (Hotjar/FullStory, qualitative insights)

**Very limited audience (<200 reachable people):**
- Problem: Niche B2B (e.g., hospital CIOs, CFOs of Fortune 500)
- Use instead: Exploratory interviews with available sample (10-15 people, $5-8K)
- Then: Use proxy audience for concept test (IT directors vs CIOs, mid-market CFOs)
- Or: Accept qualitative-only insights (themes, not statistical validation)

**You need pricing sensitivity:**
- Problem: Concept test shows interest but not willingness to pay
- Use instead: Van Westendorp or Conjoint (see pricing-research.md)
- Or: Add price testing to concept test (show concept at different prices to different groups)
- Or: Gabor-Granger pricing questions after concept (sequential approach)

## Typical Business Questions It Answers

- "Which of these three product ideas should we invest in?"
- "Will customers actually use this new feature if we build it?"
- "Does this messaging resonate with our target audience?"
- "Is there demand for this product in the market?"
- "Which version of our homepage will drive more signups?"
- "Do customers understand what our product does from this description?"
- "What's wrong with this concept that's turning people off?"

## Sample / Audience Guidance

**Sample Size:**
- 200-300 responses minimum for statistical reliability
- 400-500+ if you're testing multiple segments or concepts
- Larger sample if you need to detect small differences

**Who to Target:**
- Current customers (will they adopt this?)
- Target prospects (will they buy this?)
- Lapsed customers (will this win them back?)
- Competitor customers (will they switch?)

**Recruitment:**
- Use your email list for customer surveys
- QuestionPro panels for prospect reach
- LinkedIn ads or social targeting for specific audiences

## Core Design Elements

**Concept Presentation:**
- **Name + Tagline:** Clear, compelling headline
- **Description:** 2-3 sentences explaining what it is and what it does
- **Visuals:** Mockup, diagram, or prototype (images increase understanding)
- **Key Benefits:** 3-5 bullet points of value
- **Optional:** Price point, availability timeline

**Key Questions to Ask:**
1. **Comprehension:** "In your own words, what does this do?"
2. **Appeal:** "How interested are you in this?" (5-point scale)
3. **Uniqueness:** "How different is this from alternatives?" (5-point scale)
4. **Purchase Intent:** "How likely are you to use/buy this?" (Top 2 Box score)
5. **Value:** "What would make this more valuable to you?" (open-ended)
6. **Improvements:** "What concerns do you have?" (open-ended)

**Testing Variations:**
- **Monadic:** Each person sees one concept (cleaner but needs more respondents)
- **Sequential monadic:** Each person sees multiple concepts in rotation (efficient but fatigue risk)
- **Side-by-side:** Show all concepts together (easy comparison but anchoring bias)

## Typical QuestionPro Workflow

1. **Build Survey**
   - Use QuestionPro survey builder
   - Add concept descriptions with images
   - Include rating scales (interest, uniqueness, purchase intent)
   - Add open-ended questions for qualitative feedback
   - Use display logic to rotate concepts if testing multiple

2. **Distribute**
   - Send to email list or use QuestionPro panel
   - Target specific demographics/industries
   - Set quotas to ensure balanced sample

3. **Collect Responses**
   - Monitor real-time dashboard
   - Aim for 200-500 responses
   - Close survey when target reached

4. **Analyze Results**
   - View concept scores in QuestionPro dashboards
   - Compare Top 2 Box interest scores across concepts
   - Use cross-tabs to analyze by segment
   - Run text analytics on open-ended feedback
   - Identify winning concept and improvement areas

5. **Report Findings**
   - Export summary report with concept rankings
   - Share key quotes from open-ended responses
   - Present winning concept with supporting data

## Expected Outputs

- **Concept Performance Scores:**
  - Interest score (% very/extremely interested)
  - Purchase intent (% definitely/probably would buy)
  - Uniqueness score (% very/extremely different)

- **Concept Ranking:** Which concept performs best overall

- **Segment Analysis:** How different audiences react (e.g., enterprise vs SMB)

- **Qualitative Feedback:**
  - What people like most
  - What concerns or confuses them
  - Suggested improvements

- **Diagnostic Insights:** Why concept A beats concept B

- **Recommendation:** Which concept to pursue and what to change

## How To Interpret The Output

**Strong Concept Signals:**
- Top 2 Box interest >60%
- Top 2 Box purchase intent >40%
- Uniqueness score >50%
- Positive qualitative comments outweigh negative

**Warning Signs:**
- Interest <40% (weak demand)
- High "not sure" responses (concept not clear)
- Negative comments focus on same issue repeatedly
- Strong segment split (great for one group, terrible for another)

**How to Pick a Winner:**
- Highest purchase intent wins (most predictive of behavior)
- Check for comprehension issues (if people don't get it, they won't buy it)
- Read open-ended feedback for "why" behind scores
- Consider feasibility (best concept might also be hardest to build)

**Next Steps:**
- Refine winning concept based on feedback
- Address common concerns before launch
- Test refined concept again if changes are significant
- Move to pricing research or prototype testing

## Risks / Common Mistakes

**Risk: Hypothetical bias**
- What people say they'll do ≠ what they actually do
- **Mitigation:** Combine with behavioral data, price testing, or prototype trials

**Risk: Concept description quality**
- Bad description kills a good idea
- **Mitigation:** Test description clarity with small group first, use visuals

**Risk: Survey fatigue**
- Testing 10 concepts exhausts respondents
- **Mitigation:** Limit to 3-5 concepts max, use monadic testing for more

**Risk: Missing context**
- People evaluate in a vacuum without seeing price, competition, or full product
- **Mitigation:** Provide realistic context (price, alternatives, use case)

**Risk: False positive**
- Concept tests well but fails in market
- **Mitigation:** Test with real target buyers, not general population; follow with pilot launch

## Example Prompt

**User Question:**
"We have three ideas for our next big product feature but can only build one. How do we decide which one?"

**AI Response Would Include:**
"Run a concept test to compare all three features. Create clear descriptions of each feature with mockups showing what they'd look like. Survey 300-400 target customers using QuestionPro, showing each person all three features in randomized order. Measure interest, uniqueness, and likelihood to use each feature. Ask open-ended questions about what they like and what concerns them. Use QuestionPro dashboards to compare Top 2 Box scores across features and analyze qualitative feedback with Text Analytics. Expected output: a ranked list of features by customer interest, key value drivers for the winning feature, and specific concerns to address before building it. The feature with the highest purchase intent and most compelling qualitative feedback should be your priority."
