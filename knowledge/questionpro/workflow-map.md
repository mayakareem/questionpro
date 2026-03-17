# QuestionPro Workflow Map

## Overview

This document maps each research methodology to its typical QuestionPro implementation workflow. Use this as a practical guide for executing research projects on the platform.

---

## Standard Survey Workflow

**Use for:** Exploratory research, satisfaction surveys, feedback collection, general market research

### Steps

1. **Create Survey**
   - Choose "Create Survey" → Blank survey or template
   - Select from question library or add custom questions
   - Use 30+ question types (multiple choice, rating scales, open-ended, matrix, etc.)

2. **Configure Logic**
   - Add skip logic (e.g., "If answer = X, skip to question 5")
   - Set display logic (show/hide questions based on answers)
   - Enable piping (insert previous answers into questions)
   - Randomize answer options or question order

3. **Design & Brand**
   - Customize survey theme (colors, logo, fonts)
   - Add images or videos to questions
   - Preview on desktop and mobile

4. **Distribute**
   - **Email**: Upload contact list, customize invitation, schedule send
   - **Web link**: Copy shareable URL for website, social media, etc.
   - **Embedded**: Add to website via iframe or JavaScript
   - **Panel**: Request sample from QuestionPro panel (demographics, firmographics)

5. **Monitor Responses**
   - View real-time dashboard showing response count, completion rate
   - Check data quality (speeders, straightliners, attention check failures)
   - Pause/resume fielding as needed

6. **Analyze**
   - View summary dashboard (charts, graphs, response distributions)
   - Apply filters (e.g., view only enterprise respondents)
   - Run cross-tabs (compare segments)
   - Export to Excel, SPSS, PDF

**Timeline:** Design: 1-3 days | Field: 1-2 weeks | Analysis: 1-3 days

---

## NPS / CSAT / CES Workflow

**Use for:** Customer satisfaction tracking, loyalty measurement, effort scoring

### Steps

1. **Select Template**
   - Choose NPS, CSAT, or CES pre-built template
   - Templates include standard question + follow-up prompts

2. **Customize**
   - Add your company branding
   - Include follow-up questions (e.g., "What's the main reason for your score?")
   - Add context questions (customer segment, product usage, etc.)

3. **Set Triggers (if transactional)**
   - Post-purchase survey
   - Post-support interaction
   - Post-onboarding
   - Configure via email trigger or API integration

4. **Distribute**
   - Send to customer email list
   - Embed on website (post-login, post-checkout)
   - Trigger automatically after key events

5. **View Dashboard**
   - See NPS score (-100 to +100), promoter/passive/detractor breakdown
   - CSAT score (average rating, distribution)
   - CES score (average effort, % high-effort responses)
   - Trend over time (if recurring)

6. **Set Up Alerts (NPS)**
   - Configure closed-loop feedback: notify team when detractor responds
   - Route to account manager or support for follow-up

7. **Analyze Drivers**
   - Use Text Analytics on open-ended "why" responses
   - Identify themes driving scores
   - Compare segments (e.g., enterprise vs SMB)

**Timeline:** Setup: 1 day | Ongoing collection | Review: Weekly or monthly

---

## Van Westendorp Price Sensitivity (PSM) Workflow

**Use for:** Finding acceptable price range, optimal price point

### Steps

1. **Create Survey**
   - Choose "Price Sensitivity Meter" template
   - Describe your product/service clearly

2. **Add Four Standard Questions**
   - "At what price would this be too expensive to consider?"
   - "At what price would you consider this expensive but might still buy?"
   - "At what price would you consider this a bargain?"
   - "At what price would this be so cheap you'd question quality?"

3. **Add Context Questions**
   - Product description (ensure understanding)
   - Competitor awareness
   - Demographics

4. **Distribute**
   - Email to target customers (200-300 minimum)
   - Use panel if needed to reach broader market

5. **Analyze Results**
   - QuestionPro PSM module auto-calculates:
     - Optimal Price Point (OPP)
     - Indifference Price Point (IPP)
     - Range of Acceptable Prices
   - View price sensitivity chart (crossing lines)

6. **Export**
   - Download report with recommended price range
   - Share charts with stakeholders

**Timeline:** Setup: 1 day | Field: 1 week | Analysis: Instant (automated)

---

## MaxDiff Workflow

**Use for:** Feature prioritization, benefit ranking, attribute importance

### Steps

1. **Prepare Item List**
   - List 10-15 features/benefits/attributes to prioritize
   - Write clear, distinct descriptions

2. **Create MaxDiff Survey**
   - Use QuestionPro MaxDiff module
   - Enter your items
   - System auto-generates balanced design (4 items per set, 10-12 sets)

3. **Configure**
   - Add intro explaining the task
   - Include demographic questions if segmenting
   - Preview exercise to check clarity

4. **Distribute**
   - Email to 200-400 target respondents
   - Monitor completion rate (MaxDiff can be cognitively demanding)

5. **Analyze**
   - QuestionPro auto-calculates:
     - Relative importance scores (0-100 scale)
     - Ranked list (1st to last)
     - Statistical significance of differences
   - View by segments (e.g., power users vs new users)

6. **Export**
   - Download ranked list with scores
   - Create priority tiers (must-have, nice-to-have, low priority)

**Timeline:** Setup: 1-2 days | Field: 1 week | Analysis: Instant (automated)

---

## Conjoint Analysis Workflow

**Use for:** Product optimization, pricing + features together, market simulation

### Steps

1. **Design Study**
   - Define 3-6 attributes (features to test)
   - Define 2-5 levels per attribute (options within each feature)
   - Example: Storage (128GB, 256GB, 512GB), Price ($99, $149, $199)

2. **Create Conjoint Survey**
   - Use QuestionPro Conjoint module (CBC or ACBC)
   - Enter attributes and levels
   - System generates product profiles

3. **Configure Choice Tasks**
   - Set number of tasks (12-16 per respondent)
   - Show 3-4 product profiles per task
   - Include "none of these" option

4. **Add Supporting Questions**
   - Screening (ensure target audience)
   - Demographics
   - Current behavior

5. **Pilot Test**
   - Run with 20-30 people
   - Check if tasks are clear and realistic
   - Adjust if needed

6. **Field Survey**
   - Distribute to 300-500+ respondents
   - Monitor quality (attention checks, speeders)

7. **Analyze Results**
   - QuestionPro calculates:
     - Part-worth utilities (value of each feature level)
     - Feature importance (which attributes matter most)
     - Willingness to pay ($ value of features)

8. **Run Market Simulator**
   - Input different product configurations
   - See predicted preference share
   - Test scenarios (e.g., "Our product vs Competitor A vs Competitor B")

9. **Export**
   - Download feature importance charts
   - Export utility scores
   - Share simulations with product team

**Timeline:** Design: 3-5 days | Field: 2 weeks | Analysis: 1-3 days

---

## Concept Testing Workflow

**Use for:** Pre-launch validation, message testing, idea comparison

### Steps

1. **Prepare Concepts**
   - Write clear descriptions (name, tagline, benefits)
   - Create mockups or visuals
   - Keep consistent format across concepts

2. **Build Survey**
   - Show concept description + image
   - Ask rating questions:
     - Overall interest (1-10 or 1-5)
     - Purchase intent (definitely/probably/maybe/no)
     - Uniqueness (very unique to not unique)
   - Include open-ended: "What do you like? What concerns you?"

3. **Configure Testing Method**
   - **Monadic**: Each person sees one concept (cleanest data, needs more respondents)
   - **Sequential monadic**: Each sees multiple concepts in rotation (efficient)
   - Use display logic to randomize concept order

4. **Add Context**
   - Show competitive context if relevant
   - Include price if testing at specific price point
   - Provide use case scenario

5. **Distribute**
   - Target 200-400 respondents (or 100-150 per concept if monadic)

6. **Analyze**
   - Compare Top 2 Box scores (% very/extremely interested)
   - Compare purchase intent across concepts
   - Use Text Analytics on open-ended feedback
   - Identify winning concept

7. **Refine**
   - Address common concerns
   - Test refined concept if changes are significant

**Timeline:** Setup: 2-3 days | Field: 1 week | Analysis: 2-3 days

---

## Brand Tracking Workflow

**Use for:** Ongoing brand health measurement, competitive benchmarking

### Steps

1. **Design Tracker (Wave 1)**
   - Define core metrics (awareness, consideration, preference)
   - List 3-5 key competitors
   - Define brand attributes to track (innovative, trustworthy, etc.)
   - Add NPS or satisfaction questions

2. **Build Survey**
   - Unaided awareness: "What brands come to mind for [category]?"
   - Aided awareness: "Which of these brands have you heard of?"
   - Consideration: "Which would you consider when buying?"
   - Preference: "Which do you prefer?"
   - Attributes: "Which brands are: innovative, expensive, trustworthy?" (select all)

3. **Field Baseline Wave**
   - Survey 400-500 target market respondents via panel
   - Ensure sample matches your buyer profile

4. **Analyze Baseline**
   - Calculate awareness %, consideration %, preference %
   - Create competitive benchmark (your brand vs competitors)
   - Identify attribute associations

5. **Set Up Recurring Waves**
   - Schedule next wave (quarterly, bi-annual, or annual)
   - **Critical**: Keep questionnaire identical across waves
   - Keep audience definition consistent

6. **Field Subsequent Waves**
   - Repeat same survey
   - Same sample size and methodology

7. **Analyze Trends**
   - Use QuestionPro trend reports (wave-over-wave comparison)
   - Track movement in awareness, consideration, preference
   - Monitor attribute shifts
   - Compare to competitive benchmarks

8. **Report**
   - Export trend dashboards
   - Highlight significant changes (statistically meaningful)
   - Share with marketing leadership

**Timeline:** Setup: 3-5 days | Field per wave: 1-2 weeks | Ongoing (quarterly/annually)

---

## CX Journey / Driver Analysis Workflow

**Use for:** Understanding CX pain points, prioritizing improvements, measuring touchpoint performance

### Steps

1. **Map Journey (if new)**
   - Define customer lifecycle stages (awareness, consideration, purchase, onboarding, usage, support, renewal)
   - Identify key touchpoints within each stage

2. **Design Survey**
   - Ask outcome question: "Overall, how satisfied are you?" (1-10)
   - Rate each touchpoint/attribute: "How satisfied are you with onboarding?" (1-10)
   - Include 10-15 attributes covering major touchpoints
   - Add NPS or likelihood to renew

3. **Distribute**
   - Send to current customers (300-500+)
   - Target post-interaction for touchpoint-specific feedback
   - Send relationship surveys quarterly for overall CX health

4. **Collect Responses**
   - Monitor dashboard for real-time results

5. **Run Driver Analysis**
   - Use QuestionPro Key Driver Analysis tool
   - System calculates which attributes most strongly predict outcome (satisfaction, NPS, retention)

6. **Create Action Matrix**
   - Plot attributes on Importance-Performance grid:
     - **High Importance, Low Performance**: Fix first (priority)
     - **High Importance, High Performance**: Maintain (strengths)
     - **Low Importance**: Lower priority

7. **Analyze by Segment**
   - Compare drivers for enterprise vs SMB
   - Identify segment-specific issues

8. **Report & Act**
   - Share driver ranking with CX and product teams
   - Prioritize improvements for high-impact, low-performing areas
   - Track changes over time

**Timeline:** Setup: 2-3 days | Field: 1-2 weeks | Analysis: 2-3 days | Ongoing tracking

---

## Text Analytics Workflow

**Use for:** Analyzing open-ended survey responses, support tickets, reviews

### Steps

1. **Collect Text Data**
   - From open-ended survey questions
   - From uploaded transcripts (interviews, focus groups)
   - From external sources (support tickets, reviews)

2. **Upload to Text Analytics**
   - Navigate to Text Analytics module
   - Select text field to analyze

3. **Run Analysis**
   - System automatically:
     - Extracts themes
     - Calculates sentiment (positive, neutral, negative)
     - Creates word clouds
     - Identifies frequently mentioned topics

4. **Refine Themes**
   - Review auto-generated themes
   - Merge similar themes
   - Tag responses manually if needed

5. **Segment Analysis**
   - Filter by demographics or responses (e.g., only detractors)
   - Compare sentiment across segments

6. **Export Insights**
   - Download theme summary
   - Export categorized verbatims
   - Share word clouds and sentiment charts

**Timeline:** Upload: Minutes | Analysis: Automated | Review: 1-2 hours

---

## General Best Practices Across All Workflows

### Before You Start
- **Pilot test** with 20-30 people before full launch
- **Set clear objectives**: What decision will this research inform?
- **Screen respondents**: Ensure they match your target audience

### During Fielding
- **Monitor quality**: Check for speeders, straightliners, failed attention checks
- **Track completion rate**: Low completion? Survey might be too long or confusing
- **Pause if needed**: If you spot issues, pause and fix before continuing

### After Collection
- **Clean data**: Remove low-quality responses
- **Segment analysis**: Don't just look at aggregate—compare groups
- **Read open-ends**: Quantitative scores tell you "what," qualitative tells you "why"

### Sharing Results
- **Export to stakeholder-friendly formats**: PDF reports, PowerPoint, dashboards
- **Focus on insights, not just data**: What should we do based on this?
- **Include verbatim quotes**: They make findings more compelling

---

## Summary

QuestionPro workflows follow a consistent pattern:
1. **Design** (create survey/study)
2. **Distribute** (recruit respondents)
3. **Collect** (field survey)
4. **Analyze** (automated or manual)
5. **Report** (export and share)

Advanced methodologies (conjoint, MaxDiff, PSM) have more sophisticated design phases but follow the same overall flow. The platform automates most of the complex analysis, so you can focus on interpreting results and making decisions.
