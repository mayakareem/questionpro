'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Download, ArrowRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface PlanResponse {
  success: boolean
  plan?: {
    userQuestion: string
    businessDecision: string
    researchObjective: string
    recommendedMethods: Array<{
      name: string
      isPrimary: boolean
      rationale: string
    }>
    implementation: {
      questionProSteps: string
      sampleSize: string
      timeline: string
    }
    expectedOutputs: string
    decisionSupport: string
    assumptions: string[]
    caveats: string[]
    rawResponse?: string
  }
  error?: {
    code: string
    message: string
    details?: string
  }
  metadata?: {
    methodsIncluded: string[]
    estimatedTokens: number
    processingTimeMs: number
    modelVersion: string
  }
}

// Categorized questions by decision type
const CATEGORIZED_QUESTIONS = {
  growth: [
    "Where will our next phase of growth come from in the Middle East market?",
    "Which customer segments should we prioritize for expansion in the GCC?",
    "What is the size of the real addressable opportunity for our new service offering?",
    "Why are we losing market share in key categories despite strong product performance?",
    "Which markets or customer groups offer the highest growth potential for our brand?",
    "What are the biggest unmet needs or white spaces in our category?",
    "How should we reposition our business in this changing market landscape?",
    "Which strategic priorities will most improve growth and enterprise value?",
    "Should growth come from acquisition, retention, upsell, or new market entry?",
    "What customer and employee investments will drive sustainable growth?"
  ],
  brand: [
    "How should a leading automotive brand design a brand tracker in the Middle East to benchmark perception against competitors?",
    "Why is our brand awareness high but consideration and conversion remain low?",
    "What makes our brand meaningfully different in customers' minds compared to competitors?",
    "Which brand attributes actually drive purchase decisions and growth?",
    "What should our brand stand for in this category to win customer preference?",
    "Which customer segments are most valuable and most persuadable for our brand?",
    "Is our marketing working effectively, and where is it underperforming?",
    "Which campaign or creative idea will be most effective with our target audience?",
    "How should we respond when a competitor disrupts the category with a new positioning?",
    "How do we build stronger brand equity and more profitable customer relationships?"
  ],
  experience: [
    "What CX research should a telecom provider run to identify the main drivers of rising customer churn?",
    "Which parts of the customer journey are most damaging to loyalty and retention?",
    "Which experiences most influence repeat purchase, share of wallet, and advocacy?",
    "Where are we forcing too much effort on customers across touchpoints?",
    "How should a hospitality group research guest experience to identify touchpoints that influence loyalty?",
    "Why are customers satisfied in surveys but still leaving or reducing spend?",
    "How consistent is our experience across channels, markets, and locations?",
    "What is the root cause of complaints and service failures in our operations?",
    "How should a retail brand structure a mystery shopping study to assess service quality across stores?",
    "How do we link CX improvement directly to growth and value creation?"
  ],
  product: [
    "What research methodology should a consumer brand use to test a new product concept before launch?",
    "What UX research should a SaaS company conduct to understand onboarding drop-off and improve activation?",
    "Why are users not adopting this feature, product, or workflow in our digital platform?",
    "Which product experience issues are hurting conversion, retention, or revenue?",
    "Where are users getting stuck in onboarding or core task completion?",
    "Which features actually drive habitual usage, engagement, and loyalty?",
    "What should we prioritize on the product roadmap to maximize user and business value?",
    "Which design changes will improve trust, task completion, and ease of use?",
    "What is the right pricing and packaging architecture for our product tiers?",
    "How should a healthcare provider research the patient journey to identify pain points and improvement opportunities?"
  ],
  people: [
    "What EX research methods should a large employer use to measure morale and trust during regional uncertainty?",
    "Why are our best people leaving, and which employee groups are most at risk?",
    "What is hurting engagement, morale, or trust in leadership across the organization?",
    "Which managers are strengthening team performance, and which are weakening it?",
    "What is driving burnout, disengagement, or low productivity in key teams?",
    "Do employees feel psychologically safe enough to speak up and contribute ideas?",
    "What conditions actually help employees perform at their best and stay committed?",
    "How effective is our onboarding, development, and internal mobility program?",
    "What are the real cultural blockers preventing execution and performance?",
    "Which interventions would most improve retention, productivity, and employee satisfaction?"
  ]
}

// Legacy flat array for rotating placeholder
const EXAMPLE_QUESTIONS = [
  "How do we benchmark our brand against competitors in the Middle East?",
  "Why aren't younger customers choosing our bank despite high awareness?",
  "What's driving our rising customer churn in telecom?",
  "Which touchpoints most influence hotel guest loyalty?",
  "How do we assess service quality across our GCC retail stores?",
  "Should we launch this new product concept in the GCC market?",
  "Why are users dropping off during our SaaS onboarding?",
  "How do we measure employee morale during regional uncertainty?",
  "What are the biggest pain points in our patient journey?",
  "Which customer segments should we target in this new market?"
]

export default function HomePage() {
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PlanResponse | null>(null)
  const [placeholderText, setPlaceholderText] = useState('')
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [streamingContent, setStreamingContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'growth' | 'brand' | 'experience' | 'product' | 'people' | null>(null)

  // Auto-scroll to results when they're ready (only when NOT streaming)
  useEffect(() => {
    if (result && result.success && !isLoading) {
      setTimeout(() => {
        const resultsElement = document.getElementById('results-section')
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }, [result, isLoading])

  // Scroll to streaming section only once when it first appears
  useEffect(() => {
    if (isLoading && streamingContent && streamingContent.length < 100) {
      const resultsElement = document.getElementById('results-section')
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [isLoading, streamingContent])

  // Typing animation for placeholder
  useEffect(() => {
    if (result || isLoading || streamingContent) return

    const currentExample = EXAMPLE_QUESTIONS[currentExampleIndex]
    let currentCharIndex = 0

    if (isTyping) {
      const typingInterval = setInterval(() => {
        if (currentCharIndex <= currentExample.length) {
          setPlaceholderText(currentExample.slice(0, currentCharIndex))
          currentCharIndex++
        } else {
          clearInterval(typingInterval)
          setTimeout(() => setIsTyping(false), 2000)
        }
      }, 50)

      return () => clearInterval(typingInterval)
    } else {
      currentCharIndex = currentExample.length
      const deletingInterval = setInterval(() => {
        if (currentCharIndex >= 0) {
          setPlaceholderText(currentExample.slice(0, currentCharIndex))
          currentCharIndex--
        } else {
          clearInterval(deletingInterval)
          setCurrentExampleIndex((prev) => (prev + 1) % EXAMPLE_QUESTIONS.length)
          setIsTyping(true)
        }
      }, 30)

      return () => clearInterval(deletingInterval)
    }
  }, [currentExampleIndex, isTyping, result, isLoading, streamingContent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)
    setResult(null)
    setStreamingContent('')

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuestion: question.trim() })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          setIsLoading(false)
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6)
            try {
              const data = JSON.parse(jsonStr)

              if (data.type === 'chunk') {
                // Append streaming content
                setStreamingContent(prev => prev + data.content)
              } else if (data.type === 'complete') {
                // Set final result
                setResult(data)
                setStreamingContent('')
              } else if (data.type === 'error') {
                setResult(data)
                setStreamingContent('')
              }
            } catch (parseError) {
              console.error('Failed to parse SSE data:', parseError)
            }
          }
        }
      }
    } catch (error) {
      setResult({
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Failed to connect to server'
        }
      })
      setStreamingContent('')
      setIsLoading(false)
    }
  }

  const downloadReport = () => {
    if (!result?.plan) return

    const plan = result.plan
    const reportContent = `
AI RESEARCH GUIDE - RESEARCH PLAN
"${plan.userQuestion}"
═══════════════════════════════════════════════════════════════

BUSINESS DECISION
${plan.businessDecision}

RESEARCH OBJECTIVE
${plan.researchObjective}

RECOMMENDED METHODOLOGIES
${(plan.recommendedMethods || []).map((m, i) =>
  `${i + 1}. [${m.isPrimary ? 'PRIMARY' : 'SECONDARY'}] ${m.name}
   ${m.rationale}`
).join('\n\n')}

IMPLEMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sample Size: ${plan.implementation?.sampleSize || 'N/A'}
Timeline: ${plan.implementation?.timeline || 'N/A'}

Steps:
${plan.implementation?.questionProSteps || 'No implementation steps provided'}

EXPECTED OUTPUTS
${plan.expectedOutputs || 'No expected outputs specified'}

DECISION SUPPORT
${plan.decisionSupport}

ASSUMPTIONS
${(plan.assumptions || []).map((a, i) => `• ${a}`).join('\n')}

CAVEATS
${(plan.caveats || []).map((c, i) => `• ${c}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by AI Research Guide | ${new Date().toLocaleDateString()}
`.trim()

    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `research-plan-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Funky hand-drawn border */}
      <div className="h-2 bg-black" style={{
        clipPath: 'polygon(0 0, 2% 100%, 4% 0, 6% 100%, 8% 0, 10% 100%, 12% 0, 14% 100%, 16% 0, 18% 100%, 20% 0, 22% 100%, 24% 0, 26% 100%, 28% 0, 30% 100%, 32% 0, 34% 100%, 36% 0, 38% 100%, 40% 0, 42% 100%, 44% 0, 46% 100%, 48% 0, 50% 100%, 52% 0, 54% 100%, 56% 0, 58% 100%, 60% 0, 62% 100%, 64% 0, 66% 100%, 68% 0, 70% 100%, 72% 0, 74% 100%, 76% 0, 78% 100%, 80% 0, 82% 100%, 84% 0, 86% 100%, 88% 0, 90% 100%, 92% 0, 94% 100%, 96% 0, 98% 100%, 100% 0)'
      }} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Funky hand-drawn header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-block relative">
            <h1 className="text-5xl font-bold relative text-black transform -rotate-1"
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  letterSpacing: '0.05em',
                  textShadow: '3px 3px 0px rgba(0,0,0,0.1)'
                }}>
              AI Research Guide
            </h1>
            {/* Sketchy underline */}
            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 400 8">
              <path d="M 0 4 Q 50 2, 100 5 T 200 4 T 300 5 T 400 4"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round" />
              <path d="M 0 5 Q 50 3, 100 6 T 200 5 T 300 6 T 400 5"
                    stroke="black"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.6" />
            </svg>
          </div>

          <p className="text-base text-gray-700 mx-auto transform rotate-0.5 whitespace-nowrap"
             style={{ fontFamily: '"Courier New", Courier, monospace' }}>
            → Expert research methodology recommendations for strategic business decisions ←
          </p>
        </div>

        {/* Funky search box */}
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative transform -rotate-0.5">
              <div className="bg-white border-3 border-black p-6 relative"
                   style={{
                     borderWidth: '3px',
                     borderStyle: 'solid',
                     boxShadow: '6px 6px 0px 0px rgba(0,0,0,1), 7px 7px 0px 0px rgba(0,0,0,0.3)'
                   }}>
                {/* Hand-drawn corner doodles */}
                <div className="absolute top-2 right-2 w-6 h-6">
                  <svg viewBox="0 0 24 24">
                    <path d="M 2 2 L 22 2 M 22 2 L 22 22" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>

                <label
                  htmlFor="question"
                  className="block text-sm font-bold mb-4 uppercase transform -rotate-1 inline-block"
                  style={{ fontFamily: '"Courier New", Courier, monospace', letterSpacing: '0.1em' }}
                >
                  ✎ Your Research Question
                </label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={placeholderText + (isTyping ? '▊' : '')}
                  className="min-h-[100px] text-lg border-3 border-black rounded-none resize-none focus:border-black focus:ring-0 transition-all bg-white"
                  style={{
                    fontFamily: '"Courier New", Courier, monospace',
                    borderWidth: '2px',
                    boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)'
                  }}
                  disabled={isLoading}
                />

                <div className="mt-6 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading || !question.trim()}
                    className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-10 border-3 border-black uppercase tracking-wider transition-all transform hover:rotate-1 hover:scale-105"
                    style={{
                      fontFamily: '"Courier New", Courier, monospace',
                      letterSpacing: '0.1em',
                      boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.4)',
                      borderWidth: '3px'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Generate Plan →
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Categorized Example Questions Section - MOVED UP */}
        {!result && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-4 text-black transform -rotate-1"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              ✎ Explore by Decision Type
            </h2>

            <p className="text-center text-gray-600 mb-6 text-sm"
               style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              Choose a strategic question type to see examples →
            </p>

            {/* Category Buttons - Single Line */}
            <div className="flex justify-center gap-3 mb-8 overflow-x-auto px-4">
              {[
                { key: 'growth', label: 'Growth', icon: '↗' },
                { key: 'brand', label: 'Brand', icon: '★' },
                { key: 'experience', label: 'Experience', icon: '◆' },
                { key: 'product', label: 'Product', icon: '✓' },
                { key: 'people', label: 'People', icon: '◉' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === key ? null : key as any)
                    // Scroll to questions section after state update
                    if (selectedCategory !== key) {
                      setTimeout(() => {
                        const questionsSection = document.getElementById('questions-list-section')
                        if (questionsSection) {
                          questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }, 100)
                    }
                  }}
                  className={`flex-shrink-0 px-6 py-4 border-3 border-black font-bold uppercase transition-all transform hover:scale-105 ${
                    selectedCategory === key
                      ? 'bg-black text-white scale-105'
                      : 'bg-white text-black hover:bg-gray-50'
                  }`}
                  style={{
                    fontFamily: '"Courier New", Courier, monospace',
                    borderWidth: '3px',
                    boxShadow: selectedCategory === key
                      ? '6px 6px 0px 0px rgba(0,0,0,0.5)'
                      : '4px 4px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-sm">{label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Questions List */}
            {selectedCategory && (
              <div id="questions-list-section" className="max-w-4xl mx-auto">
                <div className="mb-6 text-center">
                  <div className="inline-block border-black p-4 bg-yellow-100 transform -rotate-1"
                       style={{
                         borderWidth: '3px',
                         borderStyle: 'solid',
                         boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                       }}>
                    <p className="font-bold text-sm uppercase" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      ✎ Top {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Questions
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {CATEGORIZED_QUESTIONS[selectedCategory].map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuestion(example)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="text-left p-6 border-3 border-black bg-white hover:bg-gray-50 transition-all transform hover:-rotate-0.5 hover:scale-[1.02]"
                      style={{
                        fontFamily: '"Courier New", Courier, monospace',
                        borderWidth: '3px',
                        boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-black bg-white font-bold transform -rotate-3">
                          {idx + 1}
                        </span>
                        <p className="text-base leading-relaxed flex-1">
                          {example}
                        </p>
                        <span className="flex-shrink-0 text-gray-400">→</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!selectedCategory && (
              <div className="text-center py-4 max-w-2xl mx-auto">
                <div className="border-3 border-dashed border-gray-300 p-4"
                     style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  <p className="text-gray-500 text-sm">
                    ↑ Select a category above to see sample questions
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Funky flowchart - MOVED BEFORE "See It In Action" */}
        {!result && (
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-black transform -rotate-1"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              ★ How It Works ★
            </h2>

            <div className="relative">
              <div className="bg-white border-black p-12 transform rotate-0.5 relative"
                   style={{
                     borderWidth: '3px',
                     borderStyle: 'dashed',
                     boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Step 1 */}
                  <div className="flex-1 text-center transform -rotate-2">
                    <div className="inline-block border-black p-6 bg-white mb-4"
                         style={{
                           borderWidth: '3px',
                           borderStyle: 'solid',
                           boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)'
                         }}>
                      <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center text-6xl">
                        ?
                      </div>
                      <div className="font-bold text-sm uppercase" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        ① Your Question
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 font-bold" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      Ask in plain English
                    </p>
                  </div>

                  {/* Sketchy Arrow */}
                  <div className="hidden md:block">
                    <svg width="48" height="32" viewBox="0 0 48 32">
                      <path d="M 2 16 Q 12 12, 24 16 T 42 16 M 42 16 L 36 12 M 42 16 L 36 20"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="md:hidden">
                    <svg width="32" height="48">
                      <path d="M 16 2 Q 12 12, 16 24 T 16 42 M 16 42 L 12 36 M 16 42 L 20 36"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Step 2 */}
                  <div className="flex-1 text-center transform rotate-1">
                    <div className="inline-block border-black p-6 bg-white mb-4"
                         style={{
                           borderWidth: '3px',
                           borderStyle: 'solid',
                           boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)'
                         }}>
                      <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="30" stroke="black" strokeWidth="3" fill="white" />
                          <circle cx="32" cy="35" r="4" fill="black" />
                          <circle cx="48" cy="35" r="4" fill="black" />
                          <path d="M 28 50 Q 40 58, 52 50" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="font-bold text-sm uppercase" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        ② AI Analysis
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 font-bold" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      Context + Routing
                    </p>
                  </div>

                  {/* Sketchy Arrow */}
                  <div className="hidden md:block">
                    <svg width="48" height="32" viewBox="0 0 48 32">
                      <path d="M 2 16 Q 12 12, 24 16 T 42 16 M 42 16 L 36 12 M 42 16 L 36 20"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="md:hidden">
                    <svg width="32" height="48">
                      <path d="M 16 2 Q 12 12, 16 24 T 16 42 M 16 42 L 12 36 M 16 42 L 20 36"
                            stroke="black"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Step 3 */}
                  <div className="flex-1 text-center transform -rotate-1">
                    <div className="inline-block border-black p-6 bg-white mb-4"
                         style={{
                           borderWidth: '3px',
                           borderStyle: 'solid',
                           boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)'
                         }}>
                      <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                          <rect x="15" y="10" width="50" height="60" stroke="black" strokeWidth="3" fill="white" />
                          <line x1="22" y1="22" x2="58" y2="22" stroke="black" strokeWidth="2" />
                          <line x1="22" y1="35" x2="58" y2="35" stroke="black" strokeWidth="2" />
                          <line x1="22" y1="48" x2="48" y2="48" stroke="black" strokeWidth="2" />
                          <line x1="22" y1="61" x2="52" y2="61" stroke="black" strokeWidth="2" />
                        </svg>
                      </div>
                      <div className="font-bold text-sm uppercase" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        ③ Research Plan
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 font-bold" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      Methods + Costs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Funky Sample Example Section - AFTER "How It Works" */}
        {!result && (
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-black transform rotate-1"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              ↓ See It In Action ↓
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Input Sample */}
              <div className="transform -rotate-1">
                <h3 className="text-sm font-bold uppercase mb-4 inline-block"
                    style={{ fontFamily: '"Courier New", Courier, monospace', letterSpacing: '0.1em' }}>
                  → Sample Input
                </h3>
                <div className="border-black p-6 bg-gray-50 transform rotate-1"
                     style={{
                       borderWidth: '3px',
                       borderStyle: 'solid',
                       boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
                     }}>
                  <p className="text-lg leading-relaxed" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    "What should we charge for our premium SaaS tier targeting enterprise customers?"
                  </p>
                </div>
              </div>

              {/* Output Sample */}
              <div className="transform rotate-0.5">
                <h3 className="text-sm font-bold uppercase mb-4 inline-block"
                    style={{ fontFamily: '"Courier New", Courier, monospace', letterSpacing: '0.1em' }}>
                  → Sample Output
                </h3>
                <div className="border-black p-6 bg-white transform -rotate-1"
                     style={{
                       borderWidth: '3px',
                       borderStyle: 'solid',
                       boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
                     }}>
                  <div style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    <div className="flex items-start gap-3 mb-4">
                      <span className="font-bold text-2xl">★</span>
                      <div className="flex-1">
                        <div className="font-bold text-xs uppercase mb-1">Primary Method</div>
                        <div className="font-bold text-lg">Van Westendorp Pricing</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center text-sm border-t-2 border-black pt-4 mt-4">
                      <div>
                        <div className="font-bold mb-1">Cost</div>
                        <div className="text-gray-700">$5-8K</div>
                      </div>
                      <div>
                        <div className="font-bold mb-1">Timeline</div>
                        <div className="text-gray-700">2-3 weeks</div>
                      </div>
                      <div>
                        <div className="font-bold mb-1">Sample</div>
                        <div className="text-gray-700">200-300</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Streaming content display */}
        {isLoading && streamingContent && (
          <div id="results-section" className="mb-8">
            <div className="bg-white border-black p-8"
                 style={{
                   borderWidth: '3px',
                   borderStyle: 'solid',
                   boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
                 }}>
              <div className="mb-4 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <h3 className="text-xl font-bold" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  Generating your research plan...
                </h3>
              </div>
              <div className="prose prose-sm max-w-none overflow-x-auto"
                   style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                <ReactMarkdown>{streamingContent}</ReactMarkdown>
                <span className="inline-block w-2 h-5 bg-black animate-pulse ml-1 align-middle">▊</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading success message */}
        {result && (
          <div className="mb-8 text-center">
            <div className="inline-block border-black p-4 bg-yellow-100 transform -rotate-1"
                 style={{
                   borderWidth: '3px',
                   borderStyle: 'solid',
                   boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)'
                 }}>
              <p className="text-lg font-bold" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                ✓ Plan Ready! Scroll down to view →
              </p>
            </div>
          </div>
        )}

        {/* Funky Results section */}
        {result && (
          <div id="results-section" className="space-y-8">
            {result.success && result.plan ? (
              <div className="relative">
                <div className="bg-white border-black p-10 transform -rotate-0.5"
                     style={{
                       borderWidth: '3px',
                       borderStyle: 'solid',
                       boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
                     }}>

                  {/* Research Question Title */}
                  <div className="mb-8 pb-6 border-b-4 border-black">
                    <h1 className="text-3xl font-bold transform -rotate-0.5 inline-block"
                        style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      "{result.plan.userQuestion}"
                    </h1>
                  </div>

                  {/* Download button */}
                  <div className="flex justify-end mb-8">
                    <Button
                      onClick={downloadReport}
                      className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-6 border-black uppercase transition-all transform hover:rotate-1"
                      style={{
                        fontFamily: '"Courier New", Courier, monospace',
                        letterSpacing: '0.05em',
                        borderWidth: '3px',
                        boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download ↓
                    </Button>
                  </div>

                  <div className="prose prose-lg max-w-none" style={{ fontFamily: '"Courier New", Courier, monospace' }}>

                    {/* Business Decision */}
                    <div className="mb-10">
                      <h2 className="text-2xl font-bold mb-4 inline-block transform -rotate-1"
                          style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        ★ Business Decision
                      </h2>
                      {/* Sketchy underline */}
                      <svg className="w-64 mb-4" height="4" viewBox="0 0 256 4">
                        <path d="M 0 2 Q 32 1, 64 2 T 128 2 T 192 2 T 256 2"
                              stroke="black"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round" />
                      </svg>
                      <div className="text-base leading-relaxed text-gray-800 mt-4 prose prose-sm max-w-none">
                        <ReactMarkdown>{result.plan.businessDecision}</ReactMarkdown>
                      </div>
                    </div>

                    {/* Research Objective */}
                    <div className="mb-10">
                      <h2 className="text-2xl font-bold mb-4 inline-block transform rotate-0.5"
                          style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        → Research Objective
                      </h2>
                      <svg className="w-64 mb-4" height="4" viewBox="0 0 256 4">
                        <path d="M 0 2 Q 32 1, 64 2 T 128 2 T 192 2 T 256 2"
                              stroke="black"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round" />
                      </svg>
                      <div className="text-base leading-relaxed text-gray-800 mt-4 prose prose-sm max-w-none">
                        <ReactMarkdown>{result.plan.researchObjective}</ReactMarkdown>
                      </div>
                    </div>

                    {/* Recommended Methodologies */}
                    <div className="mb-10">
                      <h2 className="text-2xl font-bold mb-4 inline-block transform -rotate-0.5"
                          style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        ✓ Recommended Methods
                      </h2>
                      <svg className="w-64 mb-4" height="4" viewBox="0 0 256 4">
                        <path d="M 0 2 Q 32 1, 64 2 T 128 2 T 192 2 T 256 2"
                              stroke="black"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round" />
                      </svg>
                      <div className="space-y-6 mt-6">
                        {(result.plan.recommendedMethods || []).map((method, idx) => (
                          <div key={idx} className="border-l-4 border-black pl-6 py-2 transform rotate-0.5">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{method.isPrimary ? '★' : '☆'}</span>
                              <div>
                                <span className="font-bold text-lg">{method.name}</span>
                                <span className="ml-3 text-xs font-bold uppercase px-2 py-1 bg-black text-white"
                                      style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                                  {method.isPrimary ? 'primary' : 'secondary'}
                                </span>
                              </div>
                            </div>
                            <div className="text-gray-700 prose prose-sm max-w-none">
                              <ReactMarkdown>{method.rationale}</ReactMarkdown>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Implementation */}
                    <div className="mb-10">
                      <h2 className="text-2xl font-bold mb-4 inline-block transform rotate-1"
                          style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        ▸ Implementation
                      </h2>
                      <svg className="w-64 mb-4" height="4" viewBox="0 0 256 4">
                        <path d="M 0 2 Q 32 1, 64 2 T 128 2 T 192 2 T 256 2"
                              stroke="black"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round" />
                      </svg>
                      <div className="mt-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="border-black p-4 text-center transform -rotate-1 bg-white"
                               style={{
                                 borderWidth: '3px',
                                 borderStyle: 'solid',
                                 boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                               }}>
                            <div className="font-bold text-xs uppercase mb-2 text-gray-600">Sample Size</div>
                            <div className="text-xl font-bold">{result.plan.implementation?.sampleSize || 'N/A'}</div>
                          </div>
                          <div className="border-black p-4 text-center transform rotate-1 bg-white"
                               style={{
                                 borderWidth: '3px',
                                 borderStyle: 'solid',
                                 boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                               }}>
                            <div className="font-bold text-xs uppercase mb-2 text-gray-600">Timeline</div>
                            <div className="text-xl font-bold">{result.plan.implementation?.timeline || 'N/A'}</div>
                          </div>
                        </div>

                        <div className="border-black p-6 bg-gray-50 transform rotate-0.5"
                             style={{
                               borderWidth: '3px',
                               borderStyle: 'dashed'
                             }}>
                          <div className="font-bold uppercase mb-4 text-sm">→ Implementation Steps</div>
                          <div className="text-sm leading-relaxed text-gray-800 prose prose-sm max-w-none">
                            <ReactMarkdown>{result.plan.implementation?.questionProSteps || 'No implementation steps provided'}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expected Outputs */}
                    <div className="mb-10">
                      <h2 className="text-2xl font-bold mb-4 inline-block transform -rotate-1"
                          style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        ◆ Expected Outputs
                      </h2>
                      <svg className="w-64 mb-4" height="4" viewBox="0 0 256 4">
                        <path d="M 0 2 Q 32 1, 64 2 T 128 2 T 192 2 T 256 2"
                              stroke="black"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round" />
                      </svg>
                      <div className="text-base leading-relaxed text-gray-800 mt-4 prose prose-sm max-w-none">
                        <ReactMarkdown>{result.plan.expectedOutputs || 'No expected outputs specified'}</ReactMarkdown>
                      </div>
                    </div>

                    {/* Decision Support */}
                    <div className="mb-10">
                      <h2 className="text-2xl font-bold mb-4 inline-block transform rotate-0.5"
                          style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        ✓ Decision Support
                      </h2>
                      <svg className="w-64 mb-4" height="4" viewBox="0 0 256 4">
                        <path d="M 0 2 Q 32 1, 64 2 T 128 2 T 192 2 T 256 2"
                              stroke="black"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round" />
                      </svg>
                      <div className="text-base leading-relaxed text-gray-800 mt-4 prose prose-sm max-w-none">
                        <ReactMarkdown>{result.plan.decisionSupport}</ReactMarkdown>
                      </div>
                    </div>

                    {/* Assumptions & Caveats */}
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                      <div className="border-black p-6 bg-gray-50 transform -rotate-0.5"
                           style={{
                             borderWidth: '3px',
                             borderStyle: 'solid'
                           }}>
                        <h3 className="font-bold uppercase mb-4 text-sm">! Assumptions</h3>
                        <ul className="space-y-2 text-sm">
                          {(result.plan.assumptions || []).map((assumption, idx) => (
                            <li key={idx} className="flex gap-3">
                              <span className="flex-shrink-0">•</span>
                              <span className="flex-1 text-gray-700">{assumption}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-black p-6 bg-gray-50 transform rotate-0.5"
                           style={{
                             borderWidth: '3px',
                             borderStyle: 'solid'
                           }}>
                        <h3 className="font-bold uppercase mb-4 text-sm">! Caveats</h3>
                        <ul className="space-y-2 text-sm">
                          {(result.plan.caveats || []).map((caveat, idx) => (
                            <li key={idx} className="flex gap-3">
                              <span className="flex-shrink-0">•</span>
                              <span className="flex-1 text-gray-700">{caveat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-8 flex gap-4">
                      <svg className="w-full mb-4" height="4" viewBox="0 0 800 4">
                        <path d="M 0 2 Q 100 1, 200 2 T 400 2 T 600 2 T 800 2"
                              stroke="black"
                              strokeWidth="3"
                              fill="none"
                              strokeLinecap="round" />
                      </svg>
                      <Button
                        onClick={() => {
                          setResult(null)
                          setQuestion('')
                        }}
                        className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 border-black uppercase transition-all transform hover:-rotate-1"
                        style={{
                          fontFamily: '"Courier New", Courier, monospace',
                          letterSpacing: '0.05em',
                          borderWidth: '3px',
                          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                        }}
                      >
                        ← New Question
                      </Button>
                      <Button
                        onClick={downloadReport}
                        className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-8 border-black uppercase transition-all transform hover:rotate-1"
                        style={{
                          fontFamily: '"Courier New", Courier, monospace',
                          letterSpacing: '0.05em',
                          borderWidth: '3px',
                          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download ↓
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : result.error ? (
              <div className="border-black bg-white p-8 transform rotate-1"
                   style={{
                     borderWidth: '3px',
                     borderStyle: 'solid',
                     boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
                   }}>
                <h3 className="font-bold text-3xl mb-4 uppercase transform -rotate-1 inline-block"
                    style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  ⚠ Error
                </h3>
                <p className="mb-6 text-gray-700" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  {result.error.message}
                </p>
                <Button
                  onClick={() => setResult(null)}
                  className="bg-black hover:bg-gray-800 text-white border-black font-bold py-3 px-8 uppercase transform hover:rotate-1 transition-all"
                  style={{
                    fontFamily: '"Courier New", Courier, monospace',
                    borderWidth: '3px',
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  ← Try Again
                </Button>
              </div>
            ) : null}
          </div>
        )}

        {/* Funky Footer features */}
        {!result && (
          <div className="mt-20 pt-16">
            {/* Hand-drawn separator */}
            <svg className="w-full mb-16" height="4" viewBox="0 0 800 4">
              <path d="M 0 2 Q 100 1, 200 2 T 400 2 T 600 2 T 800 2"
                    stroke="black"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round" />
            </svg>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-4 transform -rotate-1">
                <div className="w-20 h-20 mx-auto border-black flex items-center justify-center bg-white"
                     style={{
                       borderWidth: '3px',
                       borderStyle: 'solid',
                       boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)'
                     }}>
                  <ArrowRight className="w-10 h-10" strokeWidth={3} />
                </div>
                <h3 className="font-bold uppercase text-sm" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  → Context-Aware
                </h3>
                <p className="text-sm text-gray-700" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  Detects urgency, budget constraints & complexity
                </p>
              </div>

              <div className="text-center space-y-4 transform rotate-1">
                <div className="w-20 h-20 mx-auto border-black flex items-center justify-center bg-white"
                     style={{
                       borderWidth: '3px',
                       borderStyle: 'solid',
                       boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)'
                     }}>
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <polygon points="20,5 24,15 35,17 27,25 29,35 20,30 11,35 13,25 5,17 16,15" fill="black" />
                  </svg>
                </div>
                <h3 className="font-bold uppercase text-sm" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  ★ Business-Focused
                </h3>
                <p className="text-sm text-gray-700" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  Specific costs, timelines & ROI guidance
                </p>
              </div>

              <div className="text-center space-y-4 transform -rotate-0.5">
                <div className="w-20 h-20 mx-auto border-black flex items-center justify-center bg-white"
                     style={{
                       borderWidth: '3px',
                       borderStyle: 'solid',
                       boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)'
                     }}>
                  <Download className="w-10 h-10" strokeWidth={3} />
                </div>
                <h3 className="font-bold uppercase text-sm" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  QuestionPro Ready ✓
                </h3>
                <p className="text-sm text-gray-700" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  Step-by-step + downloadable reports
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Funky footer border */}
      <div className="h-2 bg-black mt-20" style={{
        clipPath: 'polygon(0 100%, 2% 0, 4% 100%, 6% 0, 8% 100%, 10% 0, 12% 100%, 14% 0, 16% 100%, 18% 0, 20% 100%, 22% 0, 24% 100%, 26% 0, 28% 100%, 30% 0, 32% 100%, 34% 0, 36% 100%, 38% 0, 40% 100%, 42% 0, 44% 100%, 46% 0, 48% 100%, 50% 0, 52% 100%, 54% 0, 56% 100%, 58% 0, 60% 100%, 62% 0, 64% 100%, 66% 0, 68% 100%, 70% 0, 72% 100%, 74% 0, 76% 100%, 78% 0, 80% 100%, 82% 0, 84% 100%, 86% 0, 88% 100%, 90% 0, 92% 100%, 94% 0, 96% 100%, 98% 0, 100% 100%)'
      }} />
    </div>
  )
}
