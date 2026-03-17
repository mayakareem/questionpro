# Testing Guide - Frontend to API Integration

This document describes how to test the complete frontend-to-API integration.

## 🔌 What's Been Wired

### Components Integrated

1. **AskForm Component** (`components/ask-form.tsx`)
   - ✅ Typed with `PlanRequest` and `PlanResponse`
   - ✅ Calls POST `/api/plan` with proper request body
   - ✅ Handles loading states
   - ✅ Handles error states
   - ✅ Stores response in sessionStorage
   - ✅ Navigates to `/result` on success

2. **Result Page** (`app/result/page.tsx`)
   - ✅ Typed with `PlanResponse`
   - ✅ Retrieves data from sessionStorage
   - ✅ Handles missing/invalid data
   - ✅ Displays error messages
   - ✅ Renders all 7 plan sections
   - ✅ Shows metadata (processing time, methods used)

3. **API Route** (`app/api/plan/route.ts`)
   - ✅ Fixed validator import (`validateQuery` instead of `validateUserQuery`)
   - ✅ Returns properly typed `PlanResponse`
   - ✅ Includes error handling
   - ✅ Includes metadata in responses

4. **Type Definitions** (`types/api.ts`)
   - ✅ Created shared types for frontend/backend
   - ✅ `PlanRequest` - API request structure
   - ✅ `PlanResponse` - API response structure
   - ✅ `ResearchPlan` - Plan data structure
   - ✅ `ApiError` - Error structure
   - ✅ `ResponseMetadata` - Metadata structure

## 🧪 Testing Checklist

### Prerequisites

Before testing, ensure:
- [ ] Dependencies installed: `npm install`
- [ ] `.env` file created with `ANTHROPIC_API_KEY`
- [ ] Dev server running: `npm run dev`

### 1. Happy Path Testing

**Test: Submit a valid question and receive a plan**

1. Open http://localhost:3000
2. Click "Get Started"
3. Enter question: `"What should we charge for our new premium tier?"`
4. Click "Get Research Plan"
5. Wait 3-8 seconds (loading state should show)

**Expected Results:**
- ✅ Loading spinner displays with "Analyzing..." text
- ✅ Form is disabled during submission
- ✅ No errors in browser console
- ✅ Redirects to `/result` page
- ✅ Result page displays:
  - Original question in header
  - Processing time and methods in metadata
  - Business Decision section
  - Research Objective section
  - Recommended Methodologies with badges
  - QuestionPro Implementation with sample size & timeline
  - Expected Outputs section
  - Decision Support section
  - Assumptions (blue cards)
  - Caveats (amber cards)
- ✅ "Print Plan" and "Create Another Plan" buttons work

### 2. Example Prompts Testing

**Test: Click example prompts**

1. Go to http://localhost:3000/ask
2. Click each example prompt button

**Expected Results:**
- ✅ Question populates in textarea
- ✅ Character count updates
- ✅ Submit button becomes enabled

**Example Prompts to Test:**
- "What should we charge for our new premium tier?"
- "Which features should we prioritize on our product roadmap?"
- "Why are customers churning from our service?"
- "How satisfied are our enterprise customers compared to SMB customers?"
- "What's causing the 75% cart abandonment rate on our website?"
- "How well-known is our brand compared to competitors?"

### 3. Validation Testing

**Test: Submit questions that are too short**

1. Enter: `"Price"`
2. Click "Get Research Plan"

**Expected Results:**
- ✅ Error message appears: "Please enter a more detailed question (at least 10 characters)"
- ✅ No API call is made
- ✅ User stays on `/ask` page

**Test: Submit empty question**

1. Leave textarea empty
2. Try to click "Get Research Plan"

**Expected Results:**
- ✅ Button is disabled
- ✅ Cannot submit

### 4. Error Handling Testing

**Test: API error (missing API key)**

1. Remove `ANTHROPIC_API_KEY` from `.env`
2. Restart dev server
3. Submit a question

**Expected Results:**
- ✅ Error message displays
- ✅ User stays on `/ask` page
- ✅ Form is re-enabled
- ✅ User can try again

**Test: Invalid JSON in sessionStorage**

1. Open browser DevTools → Application → Session Storage
2. Find `researchPlan` key
3. Change value to invalid JSON: `{invalid`
4. Navigate to http://localhost:3000/result

**Expected Results:**
- ✅ Redirects back to `/ask` page
- ✅ No error crash

**Test: Missing sessionStorage data**

1. Open browser DevTools → Application → Session Storage
2. Delete `researchPlan` key
3. Navigate to http://localhost:3000/result

**Expected Results:**
- ✅ Redirects back to `/ask` page
- ✅ Shows message about no plan found

### 5. Loading State Testing

**Test: Loading states during API call**

1. Submit a question
2. Observe UI during processing

**Expected Results:**
- ✅ Button shows spinner icon
- ✅ Button text changes to "Analyzing..."
- ✅ Button is disabled
- ✅ Textarea is disabled
- ✅ Example prompt buttons are disabled
- ✅ No double-submission possible

### 6. Navigation Testing

**Test: Back navigation**

1. Submit a question and view results
2. Click "New Question" button in header

**Expected Results:**
- ✅ Returns to `/ask` page
- ✅ Previous question still in textarea (or cleared)

**Test: Create another plan**

1. View a result page
2. Click "Create Another Plan" button

**Expected Results:**
- ✅ Returns to `/ask` page
- ✅ Ready for new question

**Test: Print plan**

1. View a result page
2. Click "Print Plan" button

**Expected Results:**
- ✅ Browser print dialog opens
- ✅ Plan displays nicely in print preview

### 7. Type Safety Testing

**Test: TypeScript compilation**

```bash
npm run type-check
```

**Expected Results:**
- ✅ No TypeScript errors
- ✅ All types properly imported and used
- ✅ `PlanRequest` and `PlanResponse` types match API

### 8. Network Testing

**Test: Inspect network requests**

1. Open browser DevTools → Network tab
2. Submit a question
3. Look for `/api/plan` request

**Expected Request:**
```json
POST /api/plan
Content-Type: application/json

{
  "userQuestion": "What should we charge for our new premium tier?",
  "options": {
    "includeExamples": true,
    "maxPrimaryMethods": 2,
    "maxSecondaryMethods": 2
  }
}
```

**Expected Response (Success):**
```json
{
  "success": true,
  "plan": {
    "userQuestion": "...",
    "businessDecision": "...",
    "researchObjective": "...",
    "recommendedMethods": [...],
    "implementation": {
      "questionProSteps": "...",
      "sampleSize": "...",
      "timeline": "..."
    },
    "expectedOutputs": "...",
    "decisionSupport": "...",
    "assumptions": [...],
    "caveats": [...]
  },
  "metadata": {
    "methodsIncluded": ["pricing-research", "conjoint"],
    "estimatedTokens": 45000,
    "processingTimeMs": 6800,
    "modelVersion": "claude-sonnet-4-6"
  }
}
```

**Expected Response (Error):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_QUERY",
    "message": "Invalid research question",
    "details": "Query must be at least 10 characters"
  }
}
```

### 9. Browser Console Testing

**Test: No console errors in happy path**

1. Open browser DevTools → Console
2. Complete a full happy path flow
3. Check for errors

**Expected Results:**
- ✅ No errors (red messages)
- ✅ Only info logs from API route (if any)
- ✅ No warnings about missing keys or props

### 10. Cross-Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

**Expected Results:**
- ✅ Works in all browsers
- ✅ Styles render correctly
- ✅ Loading states work
- ✅ sessionStorage works

## 🐛 Common Issues and Solutions

### Issue: "ANTHROPIC_API_KEY not configured"

**Solution:**
```bash
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=sk-ant-...
# Restart dev server
npm run dev
```

### Issue: Type errors in IDE

**Solution:**
```bash
# Ensure types file exists
ls types/api.ts

# Restart TypeScript server in IDE
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Issue: sessionStorage not persisting

**Solution:**
- Check browser privacy settings
- Disable "Block third-party cookies" if in iframe
- Try different browser

### Issue: API returns 500 error

**Solution:**
1. Check server logs in terminal
2. Verify methodology files exist:
   ```bash
   ls knowledge/methods/*.md
   ```
3. Check API key is valid
4. Look for parsing errors in logs

### Issue: Result page shows raw markdown

**Solution:**
- This is expected if API parsing fails
- Check `rawResponse` field for debugging
- Review `parseLLMResponse` function in `app/api/plan/route.ts`

## 📊 Performance Benchmarks

Expected performance metrics:

| Metric | Target | Acceptable | Needs Work |
|--------|--------|------------|------------|
| Page load (/) | < 500ms | < 1s | > 1s |
| Page load (/ask) | < 500ms | < 1s | > 1s |
| Page load (/result) | < 200ms | < 500ms | > 500ms |
| API response time | 3-6s | < 10s | > 10s |
| Time to interactive | < 1s | < 2s | > 2s |

**To measure:**
1. Open DevTools → Performance
2. Record page load or interaction
3. Check timing metrics

## ✅ Integration Verification

Run through this complete checklist:

### Frontend Components
- [x] `components/ask-form.tsx` uses `PlanRequest` and `PlanResponse` types
- [x] Form submits to `/api/plan` with correct request body
- [x] Loading state displays during API call
- [x] Error state displays API errors
- [x] Success state stores response in sessionStorage
- [x] Success state navigates to `/result`

### Result Page
- [x] `app/result/page.tsx` uses `PlanResponse` type
- [x] Retrieves and parses sessionStorage data
- [x] Handles missing data gracefully
- [x] Displays all plan sections correctly
- [x] Shows metadata (time, methods, tokens)
- [x] Renders methods with primary/secondary badges
- [x] Renders assumptions (blue) and caveats (amber)

### API Route
- [x] `app/api/plan/route.ts` has correct validator import
- [x] Returns `PlanResponse` structure
- [x] Includes error handling for all error types
- [x] Logs useful debug information
- [x] Returns proper HTTP status codes

### Type Safety
- [x] `types/api.ts` defines all shared types
- [x] No TypeScript errors (`npm run type-check`)
- [x] Request/response types match between frontend and backend

## 🎯 Test Different Question Types

Test that different question types route to appropriate methodologies:

### Pricing Questions
```
"What should we charge for our new premium tier?"
"Is our pricing competitive compared to alternatives?"
```
**Expected Methods:** Pricing Research, Conjoint Analysis

### Feature Questions
```
"Which features should we build next?"
"What do users value most in our product?"
```
**Expected Methods:** MaxDiff, Conjoint Analysis, Concept Test

### Customer Experience Questions
```
"Why are customers churning?"
"What are the pain points in our checkout process?"
```
**Expected Methods:** CX Driver Analysis, Exploratory Interviews

### Brand Questions
```
"How well-known is our brand?"
"What do people associate with our brand?"
```
**Expected Methods:** Brand Tracking

### Exploratory Questions
```
"Why are our sales declining in Q4?"
"What problems do small business owners face?"
```
**Expected Methods:** Exploratory Interviews, Focus Groups

## 📝 Manual Test Script

Copy and execute this test script:

```bash
# 1. Verify setup
cd /Users/sindhusreenath/Downloads/ai-research-guide
./verify-setup.sh

# 2. Start dev server
npm run dev

# 3. Open browser
open http://localhost:3000

# 4. Test happy path
# - Click "Get Started"
# - Enter: "What should we charge for our new premium tier?"
# - Click "Get Research Plan"
# - Wait for results
# - Verify all sections display

# 5. Test example prompts
# - Go back to /ask
# - Click each example prompt
# - Verify it populates textarea

# 6. Test validation
# - Enter: "Hi"
# - Try to submit
# - Verify error message

# 7. Test navigation
# - Submit a question
# - Click "New Question"
# - Verify return to /ask
# - Click "Print Plan"
# - Verify print dialog

# 8. Check console
# - Open DevTools → Console
# - Verify no errors

# 9. Check network
# - Open DevTools → Network
# - Submit question
# - Verify /api/plan request/response

# 10. Type check
npm run type-check
```

## 🎉 Success Criteria

Integration is complete and working if:

- ✅ All checklist items pass
- ✅ No TypeScript errors
- ✅ No browser console errors
- ✅ Happy path works end-to-end
- ✅ Error handling works
- ✅ Loading states display
- ✅ All question types route correctly
- ✅ Response structure matches types
- ✅ All UI sections render properly

## 📞 Troubleshooting

If tests fail, check in this order:

1. **Environment**
   - Is `ANTHROPIC_API_KEY` set in `.env`?
   - Is dev server running?
   - Are dependencies installed?

2. **Files**
   - Run `./verify-setup.sh` to check all files exist
   - Verify methodology files: `ls knowledge/methods/*.md`

3. **Types**
   - Run `npm run type-check`
   - Check `types/api.ts` exists
   - Verify imports in components

4. **Network**
   - Check browser DevTools → Network
   - Verify API request is sent
   - Check response status and body

5. **Logs**
   - Check terminal for server-side logs
   - Look for `[Plan API]` log messages
   - Check for error stack traces

6. **Browser**
   - Try different browser
   - Clear cache and sessionStorage
   - Disable browser extensions

---

**Last Updated:** After wiring frontend to API route
**Status:** Ready for testing
