# Quick Start Guide - AI Research Guide

This guide will help you get the application running in under 5 minutes.

## ✅ Pre-flight Checklist

Before starting, verify you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Anthropic API key ready ([Get one here](https://console.anthropic.com/))

## 🚀 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd /Users/sindhusreenath/Downloads/ai-research-guide
npm install
```

Expected: Installation completes without errors (may take 1-2 minutes)

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Then edit `.env` and add your API key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxx
```

### Step 3: Start Development Server

```bash
npm run dev
```

Expected output:
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000
```

### Step 4: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Get Started" button
3. Try this example question:
   ```
   What price should we charge for our new premium tier SaaS product?
   ```
4. Click "Get Research Plan"
5. Review the 7-part research plan on the results page

## 🧪 Test Checklist

Verify these features work:

- [ ] Landing page loads (http://localhost:3000)
- [ ] "Get Started" navigates to /ask page
- [ ] Question input form accepts text
- [ ] Example prompts populate the textarea when clicked
- [ ] "Get Research Plan" button submits successfully
- [ ] Results page displays with all sections:
  - [ ] Business Decision
  - [ ] Research Objective
  - [ ] Recommended Methodologies (with Primary/Supporting badges)
  - [ ] QuestionPro Implementation steps
  - [ ] Expected Outputs
  - [ ] Decision Support
  - [ ] Assumptions (blue cards)
  - [ ] Caveats (amber cards)
- [ ] "Print Plan" button works
- [ ] "Create Another Plan" navigates back to /ask

## 🐛 Troubleshooting

### Issue: npm install fails

**Solution**:
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Module not found" errors

**Solution**: Verify these critical files exist:
```bash
ls lib/method-router.ts
ls lib/retrieval.ts
ls lib/planner.ts
ls app/api/plan/route.ts
ls components/ask-form.tsx
```

### Issue: API returns error or blank plan

**Checks**:
1. Verify `.env` file exists and contains `ANTHROPIC_API_KEY`
2. Check API key is valid (starts with `sk-ant-`)
3. Check terminal for error messages
4. Verify methodology files exist:
   ```bash
   ls knowledge/methods/*.md
   ```

### Issue: Styles not loading

**Solution**:
```bash
# Verify Tailwind config
cat tailwind.config.ts
cat app/globals.css

# Restart dev server
npm run dev
```

### Issue: TypeScript errors

**Solution**:
```bash
# Run type check to see specific errors
npm run type-check

# Common fixes:
# 1. Verify all imports use correct paths
# 2. Check types/research-plan.ts exists
# 3. Verify lib/schemas.ts exists
```

## 📂 Critical Files Checklist

Verify these files exist and are not empty:

**Core Application**:
- [ ] `app/page.tsx` - Landing page
- [ ] `app/ask/page.tsx` - Question input
- [ ] `app/result/page.tsx` - Results display
- [ ] `app/layout.tsx` - Root layout
- [ ] `app/globals.css` - Global styles

**API & Logic**:
- [ ] `app/api/plan/route.ts` - Main API endpoint
- [ ] `lib/method-router.ts` - Methodology routing
- [ ] `lib/retrieval.ts` - Knowledge retrieval
- [ ] `lib/planner.ts` - Prompt building
- [ ] `lib/schemas.ts` - Zod validation

**Types**:
- [ ] `types/research-plan.ts` - TypeScript types

**Components**:
- [ ] `components/ask-form.tsx` - Question form
- [ ] `components/plan-card.tsx` - Card wrapper
- [ ] `components/method-card.tsx` - Method display
- [ ] `components/assumption-card.tsx` - Assumptions display
- [ ] `components/ui/button.tsx` - Button component
- [ ] `components/ui/card.tsx` - Card component
- [ ] `components/ui/textarea.tsx` - Textarea component
- [ ] `components/ui/badge.tsx` - Badge component

**Knowledge Base** (8 methodology files):
- [ ] `knowledge/methods/exploratory-interviews.md`
- [ ] `knowledge/methods/focus-groups.md`
- [ ] `knowledge/methods/concept-test.md`
- [ ] `knowledge/methods/pricing-research.md`
- [ ] `knowledge/methods/maxdiff.md`
- [ ] `knowledge/methods/conjoint.md`
- [ ] `knowledge/methods/brand-tracking.md`
- [ ] `knowledge/methods/cx-driver-analysis.md`

**QuestionPro Documentation**:
- [ ] `knowledge/questionpro/capabilities.md`
- [ ] `knowledge/questionpro/workflow-map.md`
- [ ] `knowledge/questionpro/outputs.md`

**Examples**:
- [ ] `knowledge/examples/prompts.md` - 58 example questions
- [ ] `knowledge/examples/gold-standard-answers.md` - 5 example plans

**Config**:
- [ ] `package.json`
- [ ] `tsconfig.json`
- [ ] `tailwind.config.ts`
- [ ] `next.config.js`
- [ ] `.env` (created from .env.example)

## 📝 Example Questions to Try

After setup, test with these questions:

**Pricing**:
- "What should we charge for our new premium tier?"
- "Is our current pricing competitive in the market?"

**Feature Prioritization**:
- "Which features should we build next for our mobile app?"
- "What functionality do users value most?"

**Customer Experience**:
- "Why are customers churning from our service?"
- "What are the biggest pain points in our checkout process?"

**Brand Research**:
- "How well-known is our brand compared to competitors?"
- "What do customers associate with our brand?"

**Market Research**:
- "Who is our ideal customer persona?"
- "What market segments should we target?"

**Concept Testing**:
- "Will customers like our new packaging design?"
- "Which product concept should we launch?"

## 🎯 Success Criteria

You know setup is complete when:

1. ✅ Dev server starts without errors
2. ✅ All pages load correctly (/, /ask, /result)
3. ✅ Submitting a question returns a structured research plan
4. ✅ Plan includes all 7 sections with realistic content
5. ✅ Methodology recommendations match the question type
6. ✅ QuestionPro implementation steps are specific and actionable
7. ✅ No console errors in browser DevTools

## 📊 Performance Expectations

Typical performance metrics:

- **Page Load**: < 1 second
- **API Response**: 3-8 seconds (depends on Claude API)
- **Full Question → Result Flow**: 5-10 seconds

If response times are significantly longer:
- Check your internet connection
- Verify Anthropic API status
- Review terminal logs for delays

## 🔄 Next Steps After Setup

Once verified working:

1. **Customize Knowledge Base**: Edit methodology files to match your needs
2. **Add Examples**: Add your own example questions to `knowledge/examples/prompts.md`
3. **Adjust Prompts**: Modify system prompt in `lib/planner.ts` if needed
4. **Test Edge Cases**: Try unusual questions to see how it handles them
5. **Monitor Costs**: Check Anthropic dashboard for API usage

## 💡 Tips for Best Results

**Writing Good Questions**:
- ✅ Be specific: "What should we charge for our Pro plan?"
- ❌ Too vague: "Help with pricing"

- ✅ Include context: "We're launching a B2B SaaS product for small businesses"
- ❌ Missing context: "What research should we do?"

- ✅ State the decision: "Should we add dark mode to our app?"
- ❌ Too broad: "Tell me about features"

**Expected Response Quality**:
- Methodology recommendations should be relevant to your question type
- QuestionPro steps should be specific and numbered
- Sample sizes should be realistic (e.g., 200-500 for surveys)
- Timelines should be practical (e.g., 2-3 weeks for most studies)

## 🆘 Getting Help

If issues persist after troubleshooting:

1. Check browser console for JavaScript errors (F12)
2. Check terminal for server-side errors
3. Review `knowledge/` files to ensure they're not corrupted
4. Try a fresh installation:
   ```bash
   rm -rf node_modules .next
   npm install
   npm run dev
   ```
5. Verify Node.js version is 18+ (`node --version`)

## 🎓 Learning the Codebase

Want to understand how it works?

**Start here**:
1. Read `README.md` for architecture overview
2. Review `app/api/plan/route.ts` to see the main flow
3. Examine `lib/method-router.ts` to understand routing logic
4. Study `lib/planner.ts` to see prompt engineering
5. Browse `knowledge/methods/` files to see methodology content

**Key Flow**:
```
User Question
  → AskForm submits to /api/plan
  → Method Router selects relevant methodologies
  → Retrieval loads markdown files
  → Planner builds comprehensive prompt
  → Claude generates structured plan
  → API validates with Zod
  → Result page displays plan
```

---

🎉 **You're all set!** Start asking research questions and get expert methodology recommendations.

For more details, see `README.md`.
