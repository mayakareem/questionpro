# AI Research Guide

An AI-powered tool that helps business professionals determine the right research methodology for their questions about products, brands, services, markets, pricing, customer experience, and feature prioritization.

Built with Next.js, TypeScript, and Claude AI, specifically designed for QuestionPro users.

## 🎯 What It Does

Ask a plain-English research question and get a comprehensive 7-part research plan:

1. **What you're trying to decide** - Clear restatement of your business decision
2. **Research objective** - Specific goal that will inform the decision
3. **Recommended methodology** - One or more research methods suited to your needs
4. **Why these methods fit** - Rationale for the recommendations
5. **How to conduct in QuestionPro** - Step-by-step implementation guide
6. **What outputs you'll see** - Specific deliverables and data
7. **What decision these outputs support** - How the outputs enable action

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key (Claude)

### Installation

```bash
# Clone or navigate to the project
cd ai-research-guide

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
ai-research-guide/
├── app/                          # Next.js app directory
│   ├── api/plan/route.ts         # API endpoint for research plans
│   ├── ask/page.tsx              # Question input page
│   ├── result/page.tsx           # Research plan display page
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   └── ui/                       # shadcn-style UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── textarea.tsx
│
├── knowledge/                    # Knowledge base
│   ├── methods/                  # Research methodologies
│   │   └── methodologies.json    # 11 core methodologies
│   ├── questionpro/              # QuestionPro features
│   │   └── questionpro-features.json
│   ├── industries/               # Industry-specific patterns
│   │   ├── b2b-saas.json
│   │   └── ecommerce.json
│   ├── examples/                 # Real-world examples
│   │   ├── pricing-examples.json
│   │   └── cx-examples.json
│   ├── decision-frameworks.json  # Decision type mappings
│   └── output-templates.json     # Response templates
│
├── lib/                          # Utilities and services
│   ├── services/
│   │   └── llm-service.ts        # Claude API integration
│   ├── utils/
│   │   ├── validator.ts          # Input validation
│   │   └── parser.ts             # Response parsing
│   └── utils.ts                  # General utilities (cn)
│
├── types/                        # TypeScript definitions
│   └── index.ts
│
├── scripts/                      # Utility scripts
│   ├── migrate-knowledge.ts      # Knowledge base migration
│   └── seed-knowledge.ts         # Workspace data seeding
│
├── tests/                        # Test suite
│   ├── api/                      # API tests
│   └── lib/                      # Unit tests
│
├── data/                         # External data (legacy CLI)
│   └── questionpro-context/      # QuestionPro workspace analysis
│
└── src/                          # Legacy CLI code (optional)
    ├── cli.js                    # Command-line interface
    └── ...
```

## 🧠 Knowledge Base

The tool draws from a comprehensive knowledge base including:

- **11 Research Methodologies**: Survey, NPS, Conjoint, MaxDiff, CX Journey Mapping, Text Analytics, A/B Testing, Market Segmentation, Brand Tracking, CSAT, CES
- **12 Decision Frameworks**: Pricing, Features, Satisfaction, CX, Brand, Segmentation, Competitive, Launch, Testing, Loyalty, Market Sizing, UX
- **QuestionPro Features**: Platform-specific implementation guides
- **Industry Patterns**: B2B SaaS, E-commerce (expandable)
- **Real-world Examples**: Pricing, CX, and more

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### Customization

- **Methodologies**: Edit `knowledge/methods/methodologies.json`
- **Decision Frameworks**: Edit `knowledge/decision-frameworks.json`
- **System Prompt**: Edit `lib/services/llm-service.ts`
- **Styling**: Modify `tailwind.config.ts` and `app/globals.css`

## 🎨 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui pattern
- **AI**: Anthropic Claude API
- **Validation**: Custom validators
- **State**: React hooks + sessionStorage

## 📊 Usage Examples

### Pricing Questions
> "What should we charge for our new premium tier?"

### Feature Prioritization
> "Which features should we build next?"

### Customer Experience
> "Why are customers churning from our service?"

### Brand Research
> "How well-known is our brand compared to competitors?"

See `examples/sample-queries.md` for 50+ example questions.

## 🧪 Testing

```bash
# Run tests (once configured)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🚢 Deployment

Deploy to Vercel (recommended):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or deploy to any Node.js hosting platform.

## 📝 Development Roadmap

### V1 (Current)
- ✅ Next.js app structure
- ✅ Claude AI integration
- ✅ 7-part research plan output
- ✅ Knowledge base with 11 methodologies
- ✅ Input validation
- ✅ shadcn-style UI components

### V2 (Future)
- [ ] User authentication
- [ ] Save/export research plans
- [ ] Industry-specific recommendations
- [ ] Multi-language support
- [ ] A/B test different prompts
- [ ] Analytics dashboard
- [ ] QuestionPro API integration
- [ ] Populate from workspace analysis

## 🤝 Contributing

This is an internal QuestionPro tool. For questions or suggestions:

1. Review existing knowledge base files
2. Test with sample queries
3. Propose improvements via pull request

## 📄 License

Proprietary - QuestionPro Internal Use Only

## 🆘 Support

For issues or questions:
- Check `examples/sample-queries.md` for usage examples
- Review `knowledge/` files for methodology details
- Consult `tests/` for expected behavior

## 🔗 Related Projects

- **CLI Version**: See `src/` directory for the original command-line tool
- **QuestionPro Workspace**: `~/Downloads/questionpro_ai_workspace` contains source material

## 🎯 Next Steps

1. **Set up your API key** in `.env`
2. **Install dependencies** with `npm install`
3. **Start the dev server** with `npm run dev`
4. **Try sample questions** from `examples/sample-queries.md`
5. **Customize knowledge base** to match your needs
6. **Integrate workspace data** using `scripts/seed-knowledge.ts`

---

Built with ❤️ for QuestionPro research teams
