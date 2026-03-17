#!/bin/bash

# AI Research Guide - Setup Verification Script
# Run this to check if all required files are in place

echo "🔍 AI Research Guide - Setup Verification"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0
MISSING=()

check_file() {
    TOTAL=$((TOTAL + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        FAILED=$((FAILED + 1))
        MISSING+=("$1")
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
    else
        echo -e "${YELLOW}⚠${NC} $1/ (missing directory)"
    fi
}

echo "📦 Checking Core Configuration..."
check_file "package.json"
check_file "tsconfig.json"
check_file "tailwind.config.ts"
check_file "next.config.js"
check_file "postcss.config.js"
check_file ".env.example"
check_file "README.md"
echo ""

echo "🎨 Checking Application Structure..."
check_dir "app"
check_file "app/layout.tsx"
check_file "app/globals.css"
check_file "app/page.tsx"
check_file "app/ask/page.tsx"
check_file "app/result/page.tsx"
check_file "app/api/plan/route.ts"
echo ""

echo "🧩 Checking Components..."
check_dir "components"
check_file "components/ask-form.tsx"
check_file "components/plan-card.tsx"
check_file "components/method-card.tsx"
check_file "components/output-card.tsx"
check_file "components/assumption-card.tsx"
check_dir "components/ui"
check_file "components/ui/button.tsx"
check_file "components/ui/card.tsx"
check_file "components/ui/textarea.tsx"
check_file "components/ui/badge.tsx"
echo ""

echo "⚙️  Checking Library Files..."
check_dir "lib"
check_file "lib/method-router.ts"
check_file "lib/retrieval.ts"
check_file "lib/planner.ts"
check_file "lib/schemas.ts"
check_file "lib/utils.ts"
echo ""

echo "📚 Checking Types..."
check_dir "types"
check_file "types/research-plan.ts"
check_file "types/api.ts"
echo ""

echo "🧠 Checking Knowledge Base - Methodologies..."
check_dir "knowledge/methods"
check_file "knowledge/methods/exploratory-interviews.md"
check_file "knowledge/methods/focus-groups.md"
check_file "knowledge/methods/concept-test.md"
check_file "knowledge/methods/pricing-research.md"
check_file "knowledge/methods/maxdiff.md"
check_file "knowledge/methods/conjoint.md"
check_file "knowledge/methods/brand-tracking.md"
check_file "knowledge/methods/cx-driver-analysis.md"
echo ""

echo "📖 Checking Knowledge Base - QuestionPro..."
check_dir "knowledge/questionpro"
check_file "knowledge/questionpro/capabilities.md"
check_file "knowledge/questionpro/workflow-map.md"
check_file "knowledge/questionpro/outputs.md"
echo ""

echo "💡 Checking Knowledge Base - Examples..."
check_dir "knowledge/examples"
check_file "knowledge/examples/prompts.md"
check_file "knowledge/examples/gold-standard-answers.md"
echo ""

echo "=========================================="
echo "📊 Summary"
echo "=========================================="
echo -e "Total checks: ${TOTAL}"
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All required files are present!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm install"
    echo "2. Copy .env.example to .env and add your ANTHROPIC_API_KEY"
    echo "3. Run: npm run dev"
    echo "4. Open: http://localhost:3000"
    echo ""
    echo "See QUICKSTART.md for detailed instructions."
    exit 0
else
    echo -e "${RED}❌ Some files are missing!${NC}"
    echo ""
    echo "Missing files:"
    for file in "${MISSING[@]}"; do
        echo "  - $file"
    done
    echo ""
    echo "Please ensure all files are created before proceeding."
    exit 1
fi
