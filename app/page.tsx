'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Download, ArrowRight, Share2, Clock, ExternalLink, Copy, Check, Home } from 'lucide-react'
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
  projectId?: string
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

interface ProjectSummary {
  id: string
  question: string
  metadata: Record<string, unknown>
  createdAt: string
}

interface AnalyticsData {
  totalSearches: number
  successfulSearches: number
  failedSearches: number
  recentSearches: Array<{
    timestamp: string
    question: string
    success: boolean
    methods?: string[]
    error?: string
  }>
}

export default function HomePage() {
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PlanResponse | null>(null)
  const [placeholderText, setPlaceholderText] = useState('')
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [streamingContent, setStreamingContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'growth' | 'brand' | 'experience' | 'product' | 'people' | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [copied, setCopied] = useState(false)

  // Fetch analytics and project history on mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics')
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      }
    }
    fetchAnalytics()

    // Fetch project history
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          if (data.success) setProjects(data.projects)
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      }
    }
    fetchProjects()

    // Check URL for shared project ID
    const urlParams = new URLSearchParams(window.location.search)
    const sharedId = urlParams.get('p')
    if (sharedId) {
      loadSharedProject(sharedId)
    }
  }, [])

  // Load a shared project by ID
  const loadSharedProject = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/projects/${id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.project) {
          setQuestion(data.project.question)
          setResult({
            success: true,
            plan: data.project.plan,
            projectId: data.project.id,
            metadata: data.project.metadata,
          })
        }
      }
    } catch (error) {
      console.error('Failed to load shared project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Copy share URL to clipboard
  const handleShare = async (projectId: string) => {
    const url = `${window.location.origin}?p=${projectId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }


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
                // Refresh analytics and project history
                fetch('/api/analytics')
                  .then(res => res.json())
                  .then(analyticsData => setAnalytics(analyticsData))
                  .catch(err => console.error('Failed to refresh analytics:', err))
                fetch('/api/projects')
                  .then(res => res.json())
                  .then(data => { if (data.success) setProjects(data.projects) })
                  .catch(err => console.error('Failed to refresh projects:', err))
              } else if (data.type === 'error') {
                setResult(data)
                setStreamingContent('')
                // Refresh analytics even on error
                fetch('/api/analytics')
                  .then(res => res.json())
                  .then(analyticsData => setAnalytics(analyticsData))
                  .catch(err => console.error('Failed to refresh analytics:', err))
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

  const [isExporting, setIsExporting] = useState(false)
  const [zoomedSlide, setZoomedSlide] = useState<number | null>(null)

  const downloadReport = async () => {
    if (!result?.plan) return

    setIsExporting(true)
    try {
      // Always POST the plan data directly (no DB dependency)
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: result.plan })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errData.details || errData.error || 'Export failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `research-plan-${result.projectId || Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF export failed:', error)
      alert(`PDF export failed: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Funky hand-drawn border */}
      <div className="h-2 bg-black" style={{
        clipPath: 'polygon(0 0, 2% 100%, 4% 0, 6% 100%, 8% 0, 10% 100%, 12% 0, 14% 100%, 16% 0, 18% 100%, 20% 0, 22% 100%, 24% 0, 26% 100%, 28% 0, 30% 100%, 32% 0, 34% 100%, 36% 0, 38% 100%, 40% 0, 42% 100%, 44% 0, 46% 100%, 48% 0, 50% 100%, 52% 0, 54% 100%, 56% 0, 58% 100%, 60% 0, 62% 100%, 64% 0, 66% 100%, 68% 0, 70% 100%, 72% 0, 74% 100%, 76% 0, 78% 100%, 80% 0, 82% 100%, 84% 0, 86% 100%, 88% 0, 90% 100%, 92% 0, 94% 100%, 96% 0, 98% 100%, 100% 0)'
      }} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Funky hand-drawn header */}
        <div className="text-center space-y-3 mt-6 mb-10">
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
        <div id="search-section" className="mb-8">
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
            <h2 className="text-4xl font-bold text-center mb-4 text-black transform -rotate-1"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              ✎ Explore by Decision Type
            </h2>

            <p className="text-center text-gray-600 mb-8 text-sm"
               style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              Choose a category type to see sample questions →
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
          </div>
        )}

        {/* Horizontal Flowchart - How It Works */}
        {!result && (
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4 text-black transform -rotate-1"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              ★ How It Works ★
            </h2>
            <p className="text-center text-gray-600 mb-10 text-sm"
               style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              From question to actionable research plan in 7 steps →
            </p>

            {/* Desktop: horizontal flow, Mobile: vertical stack */}
            <div className="border-black bg-white p-8 md:p-10 overflow-x-auto"
                 style={{
                   borderWidth: '3px',
                   borderStyle: 'dashed',
                   boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
                 }}>

              {/* Row 1: Steps 1-4 */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2 mb-6">
                {[
                  { num: '①', title: 'Your Question', desc: 'Plain English or template', icon: '?', rotate: '-rotate-2' },
                  { num: '②', title: 'Validate', desc: 'Length, relevance, scope', icon: '✓', rotate: 'rotate-1' },
                  { num: '③', title: 'Route Methods', desc: 'Match to methodologies', icon: '⑂', rotate: '-rotate-1' },
                  { num: '④', title: 'Retrieve Knowledge', desc: 'Specs, costs, timelines', icon: '⊞', rotate: 'rotate-2' },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 md:gap-2">
                    <div className={`text-center transform ${step.rotate} flex-shrink-0`}>
                      <div className="w-16 h-16 md:w-18 md:h-18 border-black bg-white flex flex-col items-center justify-center mx-auto"
                           style={{ borderWidth: '2px', borderStyle: 'solid', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}>
                        <span className="text-2xl leading-none">{step.icon}</span>
                      </div>
                      <div className="mt-2">
                        <div className="font-bold text-xs uppercase leading-tight" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                          {step.num} {step.title}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-tight" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                    {idx < 3 && (
                      <>
                        <svg className="hidden md:block flex-shrink-0" width="36" height="20" viewBox="0 0 36 20">
                          <path d="M 2 10 Q 10 7, 18 10 T 30 10 M 30 10 L 26 6 M 30 10 L 26 14"
                                stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                        <svg className="md:hidden flex-shrink-0" width="20" height="28" viewBox="0 0 20 28">
                          <path d="M 10 2 Q 8 8, 10 14 T 10 22 M 10 22 L 7 18 M 10 22 L 13 18"
                                stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Connecting arrow from row 1 to row 2 */}
              <div className="flex justify-center mb-6">
                <svg width="28" height="36" viewBox="0 0 28 36">
                  <path d="M 14 2 Q 12 10, 14 18 T 14 30 M 14 30 L 10 24 M 14 30 L 18 24"
                        stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>

              {/* Row 2: Steps 5-7 */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2">
                {[
                  { num: '⑤', title: 'AI Generation', desc: 'Claude builds your plan', icon: '◉', rotate: '-rotate-1', isBold: true },
                  { num: '⑥', title: 'Structured Output', desc: 'Methods, steps, costs', icon: '☰', rotate: 'rotate-1', isBold: false },
                  { num: '⑦', title: 'Export & Share', desc: 'PDF, URL, templates', icon: '↗', rotate: '-rotate-2', isBold: false },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 md:gap-2">
                    <div className={`text-center transform ${step.rotate} flex-shrink-0`}>
                      <div className={`w-16 h-16 md:w-18 md:h-18 border-black flex flex-col items-center justify-center mx-auto ${step.isBold ? 'bg-black text-white' : 'bg-white'}`}
                           style={{ borderWidth: '2px', borderStyle: 'solid', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}>
                        <span className="text-2xl leading-none">{step.icon}</span>
                      </div>
                      <div className="mt-2">
                        <div className="font-bold text-xs uppercase leading-tight" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                          {step.num} {step.title}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-tight" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                    {idx < 2 && (
                      <>
                        <svg className="hidden md:block flex-shrink-0" width="36" height="20" viewBox="0 0 36 20">
                          <path d="M 2 10 Q 10 7, 18 10 T 30 10 M 30 10 L 26 6 M 30 10 L 26 14"
                                stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                        <svg className="md:hidden flex-shrink-0" width="20" height="28" viewBox="0 0 20 28">
                          <path d="M 10 2 Q 8 8, 10 14 T 10 22 M 10 22 L 7 18 M 10 22 L 13 18"
                                stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Animated Demo Section - AFTER "How It Works" */}
        {!result && (
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-4 text-black transform rotate-1"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              ↓ See It In Action ↓
            </h2>
            <p className="text-center text-gray-600 mb-10 text-sm"
               style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              Watch how a question becomes a full research plan
            </p>

            {/* Animated browser mockup */}
            <div className="max-w-4xl mx-auto border-black bg-white overflow-hidden"
                 style={{
                   borderWidth: '3px',
                   borderStyle: 'solid',
                   boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
                 }}>
              {/* Browser chrome */}
              <div className="bg-gray-100 border-b-2 border-black px-4 py-2 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-black opacity-30" />
                  <div className="w-3 h-3 rounded-full bg-black opacity-30" />
                  <div className="w-3 h-3 rounded-full bg-black opacity-30" />
                </div>
                <div className="flex-1 bg-white border border-black px-3 py-1 text-xs text-gray-500"
                     style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  researchguide.up.railway.app
                </div>
              </div>

              {/* Animated content area */}
              <div className="p-6 md:p-8 space-y-6" style={{ fontFamily: '"Courier New", Courier, monospace' }}>

                {/* Step 1: Question typing animation */}
                <div>
                  <div className="text-xs uppercase font-bold text-gray-500 mb-2">✎ Your Research Question</div>
                  <div className="border-2 border-black p-4 bg-gray-50 relative overflow-hidden">
                    <p className="text-sm" style={{
                      animation: 'typing 3s steps(60) infinite alternate',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      borderRight: '2px solid black',
                      width: '100%',
                      maxWidth: '100%'
                    }}>
                      What drives customer churn in our SaaS platform and how do we fix it?
                    </p>
                  </div>
                </div>

                {/* Step 2: AI processing indicator */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-black rounded-full" style={{ animation: 'bounce 1s ease-in-out infinite' }} />
                    <div className="w-2 h-2 bg-black rounded-full" style={{ animation: 'bounce 1s ease-in-out 0.15s infinite' }} />
                    <div className="w-2 h-2 bg-black rounded-full" style={{ animation: 'bounce 1s ease-in-out 0.3s infinite' }} />
                  </div>
                  <span style={{ animation: 'fadeInOut 4s ease-in-out infinite' }}>Routing to methodologies... Retrieving knowledge... Generating plan...</span>
                </div>

                {/* Step 3: Result preview */}
                <div className="border-2 border-black p-5 space-y-4" style={{ animation: 'slideUp 2s ease-out' }}>
                  {/* Business Decision */}
                  <div>
                    <div className="font-bold text-sm mb-1">★ Business Decision</div>
                    <div className="text-xs text-gray-700 leading-relaxed">
                      Reduce annual churn rate from 18% to under 10% by identifying and addressing the top drivers of customer attrition across segments.
                    </div>
                  </div>

                  {/* Methods */}
                  <div className="flex flex-wrap gap-3">
                    <div className="border-2 border-black px-3 py-2 bg-black text-white">
                      <div className="text-xs uppercase font-bold">★ Primary</div>
                      <div className="text-sm font-bold">NPS + Churn Survey</div>
                    </div>
                    <div className="border-2 border-black px-3 py-2">
                      <div className="text-xs uppercase font-bold">☆ Secondary</div>
                      <div className="text-sm font-bold">Customer Journey Mapping</div>
                    </div>
                    <div className="border-2 border-black px-3 py-2">
                      <div className="text-xs uppercase font-bold">☆ Secondary</div>
                      <div className="text-sm font-bold">Conjoint Analysis</div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border-2 border-black p-3 text-center">
                      <div className="text-xs uppercase text-gray-500">Sample</div>
                      <div className="font-bold text-lg">300-500</div>
                    </div>
                    <div className="border-2 border-black p-3 text-center">
                      <div className="text-xs uppercase text-gray-500">Timeline</div>
                      <div className="font-bold text-lg">3-4 weeks</div>
                    </div>
                    <div className="border-2 border-black p-3 text-center">
                      <div className="text-xs uppercase text-gray-500">Cost</div>
                      <div className="font-bold text-lg">$8-12K</div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-2">
                    <div className="bg-black text-white px-4 py-2 text-xs font-bold uppercase">Download PDF</div>
                    <div className="border-2 border-black px-4 py-2 text-xs font-bold uppercase">Share →</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CSS animations */}
            <style>{`
              @keyframes typing {
                0%, 10% { width: 0; }
                90%, 100% { width: 100%; }
              }
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
              }
              @keyframes fadeInOut {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 1; }
              }
              @keyframes slideUp {
                0% { opacity: 0; transform: translateY(10px); }
                100% { opacity: 1; transform: translateY(0); }
              }
            `}</style>
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

        {/* Funky Results section */}
        {result && (
          <div id="results-section" className="space-y-8">
            {result.success && result.plan ? (
              <>
              <div className="relative">
                <div className="bg-white border-black p-10 transform -rotate-0.5"
                     style={{
                       borderWidth: '3px',
                       borderStyle: 'solid',
                       boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
                     }}>

                  {/* Research Question Title + Action Buttons */}
                  <div className="mb-8 pb-6 border-b-4 border-black flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <h1 className="text-3xl font-bold transform -rotate-0.5 inline-block flex-1"
                        style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      "{result.plan.userQuestion}"
                    </h1>
                    <div className="flex gap-3 flex-shrink-0">
                      <Button
                        onClick={downloadReport}
                        className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 border-black uppercase transition-all transform hover:rotate-1"
                        style={{
                          fontFamily: '"Courier New", Courier, monospace',
                          letterSpacing: '0.05em',
                          borderWidth: '3px',
                          boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)'
                        }}
                      >
                        {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        {isExporting ? 'Exporting...' : 'Download PDF'}
                      </Button>
                      {result.projectId && (
                        <Button
                          onClick={() => handleShare(result.projectId!)}
                          className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-6 border-black uppercase transition-all transform hover:rotate-1"
                          style={{
                            fontFamily: '"Courier New", Courier, monospace',
                            letterSpacing: '0.05em',
                            borderWidth: '3px',
                            boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)'
                          }}
                        >
                          {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
                          {copied ? 'Copied!' : 'Share'}
                        </Button>
                      )}
                    </div>
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
                                <span className="font-bold text-lg">{method.name.replace(/\*\*/g, '')}</span>
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
                          <div className="text-sm leading-relaxed text-gray-800 prose prose-sm max-w-none implementation-steps">
                            <ReactMarkdown
                              components={{
                                strong: ({ children }) => (
                                  <span className="block text-base font-bold mt-5 mb-2" style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '1.05rem', lineHeight: '1.8' }}>
                                    {children}
                                  </span>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-base font-bold mt-6 mb-2" style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                    {children}
                                  </h3>
                                ),
                              }}
                            >{result.plan.implementation?.questionProSteps || 'No implementation steps provided'}</ReactMarkdown>
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

                    {/* Bottom action buttons */}
                    <div className="pt-8">
                      <svg className="w-full mb-6" height="4" viewBox="0 0 800 4">
                        <path d="M 0 2 Q 100 1, 200 2 T 400 2 T 600 2 T 800 2"
                              stroke="black"
                              strokeWidth="3"
                              fill="none"
                              strokeLinecap="round" />
                      </svg>
                      <div className="flex gap-4 flex-wrap">
                        <Button
                          onClick={() => {
                            setResult(null)
                            setQuestion('')
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 border-black uppercase transition-all transform hover:-rotate-1"
                          style={{
                            fontFamily: '"Courier New", Courier, monospace',
                            letterSpacing: '0.05em',
                            borderWidth: '3px',
                            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                          }}
                        >
                          <Home className="mr-2 h-4 w-4" />
                          Back to Home
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
                          Download PDF
                        </Button>
                        {result.projectId && (
                          <Button
                            onClick={() => handleShare(result.projectId!)}
                            className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-8 border-black uppercase transition-all transform hover:rotate-1"
                            style={{
                              fontFamily: '"Courier New", Courier, monospace',
                              letterSpacing: '0.05em',
                              borderWidth: '3px',
                              boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                            }}
                          >
                            {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
                            {copied ? 'Copied!' : 'Share'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Report Preview - Consulting Style Slides */}
              <div className="mt-10 border-black bg-gray-50 p-6 md:p-8"
                   style={{ borderWidth: '3px', borderStyle: 'solid', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center gap-4 mb-6">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
                    <rect x="3" y="3" width="38" height="38" rx="2" stroke="black" strokeWidth="2.5" />
                    <path d="M 11 34 L 11 20" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 19 34 L 19 14" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 27 34 L 27 24" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 35 34 L 35 18" stroke="black" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 8 12 Q 16 6, 24 10 T 38 8" stroke="black" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="2 2" />
                  </svg>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase"
                        style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      What Your Final Report Would Look Like
                    </h3>
                    <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      Click any slide to zoom in - Professional research deck preview
                    </p>
                  </div>
                </div>

                {/* Zoom modal */}
                {zoomedSlide !== null && (
                  <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 md:p-8"
                       onClick={() => setZoomedSlide(null)}>
                    <button onClick={() => setZoomedSlide(null)}
                            className="absolute top-4 right-4 z-[60] text-white text-xl font-bold bg-black bg-opacity-60 w-10 h-10 flex items-center justify-center border-2 border-white hover:bg-opacity-80 transition-colors"
                            style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      X
                    </button>
                    <div className="max-w-5xl w-full aspect-video" onClick={(e) => e.stopPropagation()}>

                      {/* Slide 1 - Title (zoomed) */}
                      {zoomedSlide === 1 && (
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 md:p-14 w-full h-full flex flex-col justify-between border border-gray-700">
                          <div>
                            <div className="text-xs md:text-sm uppercase tracking-[0.3em] text-gray-500 mb-2">QuestionPro Research</div>
                            <div className="w-20 h-1 bg-blue-500 mb-6" />
                          </div>
                          <div>
                            <h4 className="text-white text-xl md:text-3xl font-bold leading-tight mb-4" style={{ fontFamily: 'system-ui, sans-serif' }}>
                              {result.plan?.userQuestion}
                            </h4>
                            <p className="text-gray-400 text-sm md:text-base uppercase tracking-wider">Research Findings & Strategic Recommendations</p>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 border border-gray-700">CONFIDENTIAL</span>
                          </div>
                        </div>
                      )}

                      {/* Slide 2 - Executive Summary (zoomed) */}
                      {zoomedSlide === 2 && (
                        <div className="bg-white p-8 md:p-14 w-full h-full flex flex-col border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-blue-600" />
                            <span className="text-sm uppercase tracking-[0.2em] text-gray-400 font-bold">Executive Summary</span>
                          </div>
                          <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'system-ui, sans-serif' }}>The Business Decision</h4>
                          <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
                            {result.plan?.businessDecision?.replace(/\*\*/g, '')}
                          </p>
                          <div className="mt-6 flex gap-3">
                            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 font-bold uppercase">Strategic</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 font-bold uppercase">High Impact</span>
                            <span className="text-xs bg-green-50 text-green-700 px-3 py-1 font-bold uppercase">Data-Driven</span>
                          </div>
                        </div>
                      )}

                      {/* Slide 3 - Methodology (zoomed) */}
                      {zoomedSlide === 3 && (
                        <div className="bg-white p-8 md:p-14 w-full h-full flex flex-col border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-blue-600" />
                            <span className="text-sm uppercase tracking-[0.2em] text-gray-400 font-bold">Methodology Framework</span>
                          </div>
                          <div className="flex-1 flex gap-8">
                            <div className="flex-1 flex items-end gap-3 pb-4">
                              {(result.plan?.recommendedMethods || []).slice(0, 4).map((method, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                  <div className={`w-full rounded-t ${method.isPrimary ? 'bg-blue-600' : 'bg-blue-300'}`}
                                       style={{ height: method.isPrimary ? '80%' : `${40 + idx * 12}%`, minHeight: '40px', maxHeight: '200px' }} />
                                  <span className="text-xs text-gray-600 text-center leading-tight">
                                    {method.name.replace(/\*\*/g, '')}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="w-40 space-y-3 pt-4">
                              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-600 rounded-sm" /><span className="text-sm text-gray-600">Primary Method</span></div>
                              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-300 rounded-sm" /><span className="text-sm text-gray-600">Supporting</span></div>
                              <div className="mt-4 p-3 bg-gray-50 border border-gray-200">
                                <div className="text-xs text-gray-400 uppercase font-bold">Sample Size</div>
                                <div className="text-lg font-bold text-gray-900">{result.plan?.implementation?.sampleSize || 'TBD'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Slide 4 - KPI Dashboard (zoomed) */}
                      {zoomedSlide === 4 && (
                        <div className="bg-white p-8 md:p-14 w-full h-full flex flex-col border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-blue-600" />
                            <span className="text-sm uppercase tracking-[0.2em] text-gray-400 font-bold">Project Scope & KPIs</span>
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 flex flex-col justify-center border border-gray-100">
                              <div className="text-xs uppercase text-gray-400 font-bold mb-1">Sample Size</div>
                              <div className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'system-ui, sans-serif' }}>{result.plan?.implementation?.sampleSize || 'TBD'}</div>
                              <div className="w-full bg-gray-200 h-2 mt-3 rounded-full"><div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }} /></div>
                              <div className="text-xs text-gray-400 mt-1">Target completion: 72%</div>
                            </div>
                            <div className="bg-gray-50 p-6 flex flex-col justify-center border border-gray-100">
                              <div className="text-xs uppercase text-gray-400 font-bold mb-1">Timeline</div>
                              <div className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'system-ui, sans-serif' }}>{result.plan?.implementation?.timeline || 'TBD'}</div>
                              <div className="w-full bg-gray-200 h-2 mt-3 rounded-full"><div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }} /></div>
                              <div className="text-xs text-gray-400 mt-1">Phase progress: 60%</div>
                            </div>
                            <div className="bg-gray-50 p-6 flex flex-col justify-center border border-gray-100">
                              <div className="text-xs uppercase text-gray-400 font-bold mb-1">Methods</div>
                              <div className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'system-ui, sans-serif' }}>{result.plan?.recommendedMethods?.length || 0}</div>
                              <div className="text-sm text-gray-500 mt-1">research approaches combined</div>
                            </div>
                            <div className="bg-gray-50 p-6 flex flex-col justify-center border border-gray-100">
                              <div className="text-xs uppercase text-gray-400 font-bold mb-1">Confidence Level</div>
                              <div className="text-3xl font-bold text-green-700" style={{ fontFamily: 'system-ui, sans-serif' }}>95%</div>
                              <div className="text-sm text-gray-500 mt-1">statistical significance</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Slide 5 - Trend Analysis (zoomed) */}
                      {zoomedSlide === 5 && (
                        <div className="bg-white p-8 md:p-14 w-full h-full flex flex-col border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-blue-600" />
                            <span className="text-sm uppercase tracking-[0.2em] text-gray-400 font-bold">Expected Trend Analysis</span>
                          </div>
                          <div className="flex-1 relative">
                            <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                              <line x1="50" y1="15" x2="50" y2="170" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="50" y1="170" x2="480" y2="170" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="50" y1="92" x2="480" y2="92" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="4" />
                              <line x1="50" y1="50" x2="480" y2="50" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="4" />
                              <line x1="50" y1="131" x2="480" y2="131" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="4" />
                              <polyline points="65,145 125,130 185,110 245,80 305,65 365,50 425,35 465,25"
                                        fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              <polyline points="65,150 125,145 185,135 245,125 305,115 365,100 425,88 465,75"
                                        fill="none" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" />
                              {[65,125,185,245,305,365,425,465].map((x, i) => (
                                <circle key={i} cx={x} cy={145 - i * 17} r="4" fill="#2563EB" />
                              ))}
                              <text x="65" y="186" fontSize="11" fill="#9CA3AF" textAnchor="middle">W1</text>
                              <text x="125" y="186" fontSize="11" fill="#9CA3AF" textAnchor="middle">W2</text>
                              <text x="185" y="186" fontSize="11" fill="#9CA3AF" textAnchor="middle">W3</text>
                              <text x="245" y="186" fontSize="11" fill="#9CA3AF" textAnchor="middle">W4</text>
                              <text x="305" y="186" fontSize="11" fill="#9CA3AF" textAnchor="middle">W5</text>
                              <text x="365" y="186" fontSize="11" fill="#9CA3AF" textAnchor="middle">W6</text>
                              <text x="425" y="186" fontSize="11" fill="#9CA3AF" textAnchor="middle">W7</text>
                              <text x="465" y="186" fontSize="11" fill="#9CA3AF" textAnchor="middle">W8</text>
                              <text x="15" y="148" fontSize="9" fill="#9CA3AF">Low</text>
                              <text x="15" y="55" fontSize="9" fill="#9CA3AF">High</text>
                            </svg>
                          </div>
                          <div className="flex gap-6 mt-3">
                            <div className="flex items-center gap-2"><div className="w-6 h-1 bg-blue-600 rounded" /><span className="text-sm text-gray-500">Primary KPI Projection</span></div>
                            <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-blue-300" style={{ borderTop: '2px dashed #93C5FD' }} /><span className="text-sm text-gray-500">Industry Benchmark</span></div>
                          </div>
                        </div>
                      )}

                      {/* Slide 6 - Segment Analysis (zoomed) */}
                      {zoomedSlide === 6 && (
                        <div className="bg-white p-8 md:p-14 w-full h-full flex flex-col border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-blue-600" />
                            <span className="text-sm uppercase tracking-[0.2em] text-gray-400 font-bold">Segment Analysis</span>
                          </div>
                          <div className="flex-1 flex gap-8 items-center">
                            <svg viewBox="0 0 100 100" className="w-40 h-40 flex-shrink-0">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#2563EB" strokeWidth="18" strokeDasharray="88 163" transform="rotate(-90 50 50)" />
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#60A5FA" strokeWidth="18" strokeDasharray="55 196" strokeDashoffset="-88" transform="rotate(-90 50 50)" />
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#93C5FD" strokeWidth="18" strokeDasharray="42 209" strokeDashoffset="-143" transform="rotate(-90 50 50)" />
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#BFDBFE" strokeWidth="18" strokeDasharray="66 185" strokeDashoffset="-185" transform="rotate(-90 50 50)" />
                            </svg>
                            <div className="space-y-4 flex-1">
                              <div className="flex items-center justify-between p-3 bg-blue-50 border-l-3 border-blue-600" style={{ borderLeftWidth: '3px', borderLeftColor: '#2563EB' }}>
                                <div className="flex items-center gap-3"><div className="w-4 h-4 bg-blue-600 rounded-sm" /><span className="text-sm text-gray-700 font-medium">Core Target Audience</span></div>
                                <div className="text-right"><span className="text-lg font-bold text-gray-900">35%</span><span className="text-xs text-green-600 ml-2 font-bold">HIGH</span></div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50">
                                <div className="flex items-center gap-3"><div className="w-4 h-4 bg-blue-400 rounded-sm" /><span className="text-sm text-gray-700 font-medium">Growth Segment</span></div>
                                <div className="text-right"><span className="text-lg font-bold text-gray-900">22%</span><span className="text-xs text-blue-600 ml-2 font-bold">MEDIUM</span></div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50">
                                <div className="flex items-center gap-3"><div className="w-4 h-4 bg-blue-300 rounded-sm" /><span className="text-sm text-gray-700 font-medium">Emerging Market</span></div>
                                <div className="text-right"><span className="text-lg font-bold text-gray-900">17%</span><span className="text-xs text-blue-600 ml-2 font-bold">MEDIUM</span></div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50">
                                <div className="flex items-center gap-3"><div className="w-4 h-4 bg-blue-100 rounded-sm" /><span className="text-sm text-gray-700 font-medium">Others</span></div>
                                <div className="text-right"><span className="text-lg font-bold text-gray-900">26%</span><span className="text-xs text-gray-400 ml-2 font-bold">MONITOR</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Slide 7 - Strategic Recommendations (zoomed) */}
                      {zoomedSlide === 7 && (
                        <div className="bg-white p-8 md:p-14 w-full h-full flex flex-col border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-blue-600" />
                            <span className="text-sm uppercase tracking-[0.2em] text-gray-400 font-bold">Strategic Recommendations</span>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start gap-4 bg-green-50 p-5 border-l-4 border-green-500">
                              <span className="text-base font-bold text-green-700 flex-shrink-0">01</span>
                              <div>
                                <div className="text-base font-bold text-gray-800 mb-1">Immediate Action - Deploy Primary Research</div>
                                <div className="text-sm text-gray-600">Launch primary research methodology within 2 weeks. Configure study parameters on QuestionPro and begin data collection with target audience segments.</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 bg-blue-50 p-5 border-l-4 border-blue-500">
                              <span className="text-base font-bold text-blue-700 flex-shrink-0">02</span>
                              <div>
                                <div className="text-base font-bold text-gray-800 mb-1">Short-term - Analyze & Refine</div>
                                <div className="text-sm text-gray-600">Analyze initial data wave results and refine targeting criteria based on response patterns. Identify key segments showing highest engagement.</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 bg-gray-50 p-5 border-l-4 border-gray-400">
                              <span className="text-base font-bold text-gray-600 flex-shrink-0">03</span>
                              <div>
                                <div className="text-base font-bold text-gray-800 mb-1">Medium-term - Present & Implement</div>
                                <div className="text-sm text-gray-600">Compile final insights report with data visualizations. Present findings to stakeholders and implement data-driven strategic recommendations.</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Slide 8 - Implementation Roadmap (zoomed) */}
                      {zoomedSlide === 8 && (
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 md:p-14 w-full h-full flex flex-col justify-between border border-gray-700">
                          <div>
                            <div className="text-xs md:text-sm uppercase tracking-[0.3em] text-gray-500 mb-2">Next Steps</div>
                            <div className="w-20 h-1 bg-blue-500 mb-6" />
                            <h4 className="text-white text-xl md:text-2xl font-bold mb-6" style={{ fontFamily: 'system-ui, sans-serif' }}>Implementation Roadmap</h4>
                          </div>
                          <div className="space-y-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full border-2 border-blue-400 flex items-center justify-center flex-shrink-0"><span className="text-sm text-blue-400 font-bold">1</span></div>
                              <div><div className="text-white text-base font-medium">Configure study on QuestionPro</div><div className="text-gray-500 text-sm">Set up survey instruments, sampling, and distribution</div></div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full border-2 border-blue-400 flex items-center justify-center flex-shrink-0"><span className="text-sm text-blue-400 font-bold">2</span></div>
                              <div><div className="text-white text-base font-medium">Launch fieldwork with target audience</div><div className="text-gray-500 text-sm">Deploy surveys and begin collecting responses at scale</div></div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full border-2 border-blue-400 flex items-center justify-center flex-shrink-0"><span className="text-sm text-blue-400 font-bold">3</span></div>
                              <div><div className="text-white text-base font-medium">Analyze and present strategic insights</div><div className="text-gray-500 text-sm">Generate comprehensive report with actionable recommendations</div></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-end mt-6">
                            <span className="text-sm text-gray-500">QuestionPro Research Platform</span>
                            <span className="text-sm text-gray-500">researchguide.up.railway.app</span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* Slide grid - 16:9 aspect ratio cards */}
                <div className="grid md:grid-cols-2 gap-4">

                  {/* Slide 1 - Title */}
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 aspect-video flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-transform border border-gray-700"
                       onClick={() => setZoomedSlide(1)}>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">QuestionPro Research</div>
                      <div className="w-12 h-0.5 bg-blue-500 mb-4" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm md:text-base font-bold leading-tight mb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
                        {result.plan?.userQuestion && result.plan.userQuestion.length > 80
                          ? result.plan.userQuestion.substring(0, 80) + '...'
                          : result.plan?.userQuestion}
                      </h4>
                      <p className="text-gray-500 text-[10px] uppercase tracking-wider">Research Findings & Strategic Recommendations</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-gray-600">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      <span className="text-[10px] text-gray-600 bg-gray-800 px-2 py-0.5">CONFIDENTIAL</span>
                    </div>
                  </div>

                  {/* Slide 2 - Executive Summary */}
                  <div className="bg-white p-6 aspect-video flex flex-col cursor-pointer hover:scale-[1.02] transition-transform border border-gray-200"
                       onClick={() => setZoomedSlide(2)}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-blue-600" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-bold">Executive Summary</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>The Business Decision</h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed flex-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
                      {result.plan?.businessDecision ? result.plan.businessDecision.replace(/\*\*/g, '').substring(0, 180) + '...' : ''}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 font-bold uppercase">Strategic</span>
                      <span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 font-bold uppercase">High Impact</span>
                    </div>
                  </div>

                  {/* Slide 3 - Methodology with chart */}
                  <div className="bg-white p-6 aspect-video flex flex-col cursor-pointer hover:scale-[1.02] transition-transform border border-gray-200"
                       onClick={() => setZoomedSlide(3)}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-blue-600" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-bold">Methodology Framework</span>
                    </div>
                    <div className="flex-1 flex gap-4">
                      {/* Mini bar chart */}
                      <div className="flex-1 flex items-end gap-1 pb-2">
                        {(result.plan?.recommendedMethods || []).slice(0, 4).map((method, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                            <div className={`w-full ${method.isPrimary ? 'bg-blue-600' : 'bg-blue-300'}`}
                                 style={{ height: method.isPrimary ? '80%' : `${40 + idx * 12}%`, minHeight: '20px', maxHeight: '80px' }} />
                            <span className="text-[7px] text-gray-500 text-center leading-tight truncate w-full">
                              {method.name.replace(/\*\*/g, '').split(' ').slice(0, 2).join(' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* Legend */}
                      <div className="w-24 space-y-1 text-[8px] pt-2">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-600" /><span className="text-gray-600">Primary</span></div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-300" /><span className="text-gray-600">Supporting</span></div>
                        <div className="mt-2 text-gray-400">n = {result.plan?.implementation?.sampleSize || 'TBD'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Slide 4 - Key Metrics Dashboard */}
                  <div className="bg-white p-6 aspect-video flex flex-col cursor-pointer hover:scale-[1.02] transition-transform border border-gray-200"
                       onClick={() => setZoomedSlide(4)}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-blue-600" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-bold">Project Scope & KPIs</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 flex flex-col justify-center">
                        <div className="text-[9px] uppercase text-gray-400 font-bold">Sample Size</div>
                        <div className="text-lg font-bold text-gray-900" style={{ fontFamily: 'system-ui, sans-serif' }}>{result.plan?.implementation?.sampleSize || 'TBD'}</div>
                        <div className="w-full bg-gray-200 h-1 mt-1"><div className="bg-blue-600 h-1" style={{ width: '72%' }} /></div>
                      </div>
                      <div className="bg-gray-50 p-3 flex flex-col justify-center">
                        <div className="text-[9px] uppercase text-gray-400 font-bold">Timeline</div>
                        <div className="text-lg font-bold text-gray-900" style={{ fontFamily: 'system-ui, sans-serif' }}>{result.plan?.implementation?.timeline || 'TBD'}</div>
                        <div className="w-full bg-gray-200 h-1 mt-1"><div className="bg-green-500 h-1" style={{ width: '60%' }} /></div>
                      </div>
                      <div className="bg-gray-50 p-3 flex flex-col justify-center">
                        <div className="text-[9px] uppercase text-gray-400 font-bold">Methods</div>
                        <div className="text-lg font-bold text-gray-900" style={{ fontFamily: 'system-ui, sans-serif' }}>{result.plan?.recommendedMethods?.length || 0}</div>
                        <div className="text-[8px] text-gray-500">research approaches</div>
                      </div>
                      <div className="bg-gray-50 p-3 flex flex-col justify-center">
                        <div className="text-[9px] uppercase text-gray-400 font-bold">Confidence</div>
                        <div className="text-lg font-bold text-green-700" style={{ fontFamily: 'system-ui, sans-serif' }}>95%</div>
                        <div className="text-[8px] text-gray-500">statistical level</div>
                      </div>
                    </div>
                  </div>

                  {/* Slide 5 - Trend Analysis (dummy data) */}
                  <div className="bg-white p-6 aspect-video flex flex-col cursor-pointer hover:scale-[1.02] transition-transform border border-gray-200"
                       onClick={() => setZoomedSlide(5)}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-blue-600" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-bold">Expected Trend Analysis</span>
                    </div>
                    <div className="flex-1 relative">
                      {/* SVG trend chart */}
                      <svg viewBox="0 0 300 120" className="w-full h-full" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="30" y1="10" x2="30" y2="100" stroke="#E5E7EB" strokeWidth="0.5" />
                        <line x1="30" y1="100" x2="290" y2="100" stroke="#E5E7EB" strokeWidth="0.5" />
                        <line x1="30" y1="55" x2="290" y2="55" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" />
                        <line x1="30" y1="32" x2="290" y2="32" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" />
                        <line x1="30" y1="78" x2="290" y2="78" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" />
                        {/* Trend line 1 - Primary metric */}
                        <polyline points="40,80 80,72 120,60 160,45 200,38 240,30 280,22"
                                  fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Trend line 2 - Secondary */}
                        <polyline points="40,85 80,82 120,75 160,70 200,65 240,58 280,50"
                                  fill="none" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />
                        {/* Data points */}
                        {[40,80,120,160,200,240,280].map((x, i) => (
                          <circle key={i} cx={x} cy={80 - i * 8.5} r="2.5" fill="#2563EB" />
                        ))}
                        {/* Labels */}
                        <text x="30" y="110" fontSize="7" fill="#9CA3AF">Q1</text>
                        <text x="110" y="110" fontSize="7" fill="#9CA3AF">Q2</text>
                        <text x="190" y="110" fontSize="7" fill="#9CA3AF">Q3</text>
                        <text x="270" y="110" fontSize="7" fill="#9CA3AF">Q4</text>
                        <text x="5" y="82" fontSize="6" fill="#9CA3AF">Low</text>
                        <text x="5" y="35" fontSize="6" fill="#9CA3AF">High</text>
                      </svg>
                    </div>
                    <div className="flex gap-4 mt-1">
                      <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-blue-600" /><span className="text-[8px] text-gray-500">Primary KPI</span></div>
                      <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-blue-300" style={{ borderTop: '1px dashed' }} /><span className="text-[8px] text-gray-500">Benchmark</span></div>
                    </div>
                  </div>

                  {/* Slide 6 - Segment Breakdown (pie + list) */}
                  <div className="bg-white p-6 aspect-video flex flex-col cursor-pointer hover:scale-[1.02] transition-transform border border-gray-200"
                       onClick={() => setZoomedSlide(6)}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-blue-600" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-bold">Segment Analysis</span>
                    </div>
                    <div className="flex-1 flex gap-4 items-center">
                      <svg viewBox="0 0 100 100" className="w-20 h-20 flex-shrink-0">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#2563EB" strokeWidth="18" strokeDasharray="88 163" transform="rotate(-90 50 50)" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#60A5FA" strokeWidth="18" strokeDasharray="55 196" strokeDashoffset="-88" transform="rotate(-90 50 50)" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#93C5FD" strokeWidth="18" strokeDasharray="42 209" strokeDashoffset="-143" transform="rotate(-90 50 50)" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#BFDBFE" strokeWidth="18" strokeDasharray="66 185" strokeDashoffset="-185" transform="rotate(-90 50 50)" />
                      </svg>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-600" /><span className="text-[9px] text-gray-700">Core Target (35%)</span></div><span className="text-[9px] font-bold">High Priority</span></div>
                        <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-400" /><span className="text-[9px] text-gray-700">Growth Segment (22%)</span></div><span className="text-[9px] font-bold">Medium</span></div>
                        <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-300" /><span className="text-[9px] text-gray-700">Emerging (17%)</span></div><span className="text-[9px] font-bold">Medium</span></div>
                        <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-100" /><span className="text-[9px] text-gray-700">Others (26%)</span></div><span className="text-[9px] font-bold">Monitor</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Slide 7 - Strategic Recommendations */}
                  <div className="bg-white p-6 aspect-video flex flex-col cursor-pointer hover:scale-[1.02] transition-transform border border-gray-200"
                       onClick={() => setZoomedSlide(7)}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-blue-600" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-bold">Strategic Recommendations</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2 bg-green-50 p-2 border-l-2 border-green-500">
                        <span className="text-[9px] font-bold text-green-700 flex-shrink-0 mt-0.5">01</span>
                        <div><div className="text-[10px] font-bold text-gray-800">Immediate Action</div><div className="text-[8px] text-gray-500">Deploy primary research methodology within 2 weeks</div></div>
                      </div>
                      <div className="flex items-start gap-2 bg-blue-50 p-2 border-l-2 border-blue-500">
                        <span className="text-[9px] font-bold text-blue-700 flex-shrink-0 mt-0.5">02</span>
                        <div><div className="text-[10px] font-bold text-gray-800">Short-term</div><div className="text-[8px] text-gray-500">Analyze initial data wave and refine targeting criteria</div></div>
                      </div>
                      <div className="flex items-start gap-2 bg-gray-50 p-2 border-l-2 border-gray-400">
                        <span className="text-[9px] font-bold text-gray-600 flex-shrink-0 mt-0.5">03</span>
                        <div><div className="text-[10px] font-bold text-gray-800">Medium-term</div><div className="text-[8px] text-gray-500">Present findings and implement data-driven strategy</div></div>
                      </div>
                    </div>
                  </div>

                  {/* Slide 8 - Next Steps & Implementation */}
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 aspect-video flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-transform border border-gray-700"
                       onClick={() => setZoomedSlide(8)}>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Next Steps</div>
                      <div className="w-12 h-0.5 bg-blue-500 mb-3" />
                      <h4 className="text-white text-sm font-bold mb-3" style={{ fontFamily: 'system-ui, sans-serif' }}>Implementation Roadmap</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border border-blue-400 flex items-center justify-center"><span className="text-[8px] text-blue-400 font-bold">1</span></div>
                        <span className="text-[10px] text-gray-300">Configure study on QuestionPro</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border border-blue-400 flex items-center justify-center"><span className="text-[8px] text-blue-400 font-bold">2</span></div>
                        <span className="text-[10px] text-gray-300">Launch fieldwork with target audience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border border-blue-400 flex items-center justify-center"><span className="text-[8px] text-blue-400 font-bold">3</span></div>
                        <span className="text-[10px] text-gray-300">Analyze and present strategic insights</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] text-gray-600">QuestionPro Research Platform</span>
                      <span className="text-[9px] text-gray-600">researchguide.up.railway.app</span>
                    </div>
                  </div>

                </div>

                {/* CTA */}
                <div className="text-center border-t border-gray-300 pt-5 mt-6">
                  <p className="text-xs font-bold mb-3" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    Full PPTX deck with real data visualizations and recommendations
                  </p>
                  <Button
                    disabled
                    className="bg-gray-400 text-white font-bold py-3 px-8 border-gray-400 uppercase cursor-not-allowed"
                    style={{ fontFamily: '"Courier New", Courier, monospace', letterSpacing: '0.05em', borderWidth: '3px', boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.3)' }}
                  >
                    Generate Full Deck - Coming Soon
                  </Button>
                </div>
              </div>
              </>
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
                <p className="mb-2 text-gray-700" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  {result.error.message}
                </p>
                {result.error.details && (
                  <p className="mb-6 text-xs text-gray-500" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    {result.error.details}
                  </p>
                )}
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

        {/* Combined Research Activity Section */}
        {!result && (
          <div className="mt-20 mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-black transform -rotate-1"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              <Clock className="inline-block mr-2 h-7 w-7" />
              Research Activity
            </h2>

            {/* Stats boxes */}
            {analytics && (
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="border-black p-6 bg-white text-center transform -rotate-1"
                     style={{ borderWidth: '3px', borderStyle: 'solid', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                  <div className="text-4xl font-bold mb-2">{analytics.totalSearches}</div>
                  <div className="text-sm uppercase font-bold text-gray-600"
                       style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    Total Searches
                  </div>
                </div>
                <div className="border-black p-6 bg-white text-center transform rotate-1"
                     style={{ borderWidth: '3px', borderStyle: 'solid', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                  <div className="text-4xl font-bold mb-2 text-green-700">{analytics.successfulSearches}</div>
                  <div className="text-sm uppercase font-bold text-gray-600"
                       style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    Successful ✓
                  </div>
                </div>
                <div className="border-black p-6 bg-white text-center transform -rotate-0.5"
                     style={{ borderWidth: '3px', borderStyle: 'solid', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                  <div className="text-4xl font-bold mb-2 text-red-700">{analytics.failedSearches}</div>
                  <div className="text-sm uppercase font-bold text-gray-600"
                       style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    Failed ✗
                  </div>
                </div>
              </div>
            )}

            {/* Recent research history - clickable to reload */}
            {projects.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-bold mb-4 transform rotate-0.5 inline-block"
                    style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  → Recent Research Plans
                </h3>
                <div className="space-y-3">
                  {projects.slice(0, 10).map((project) => (
                    <div
                      key={project.id}
                      onClick={() => loadSharedProject(project.id)}
                      className="border-black p-4 bg-white transform hover:-rotate-0.5 transition-all cursor-pointer hover:bg-gray-50"
                      style={{ borderWidth: '2px', borderStyle: 'solid', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-sm mb-1"
                             style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                            {project.question.length > 100
                              ? project.question.substring(0, 100) + '...'
                              : project.question}
                          </p>
                          <span className="text-xs text-gray-500"
                                style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                            {new Date(project.createdAt).toLocaleDateString()} at {new Date(project.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 ml-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!analytics && projects.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-block border-black p-8 bg-gray-50 transform -rotate-1"
                     style={{ borderWidth: '3px', borderStyle: 'dashed', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
                  <p className="text-sm text-gray-500"
                     style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    Run a search to start building your research history
                  </p>
                </div>
              </div>
            )}
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

      {/* Bottom CTA */}
      {!result && (
        <div className="mt-20 mb-16 text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 transform -rotate-1"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              What business problem are you trying to solve?
            </h2>
            <p className="text-gray-600 mb-8 text-sm"
               style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              Type your question and get a research plan in under 30 seconds →
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('search-section')
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                // Focus the textarea after scroll
                setTimeout(() => {
                  const textarea = document.getElementById('question') as HTMLTextAreaElement | null
                  if (textarea) textarea.focus()
                }, 600)
              }}
              className="bg-black hover:bg-gray-800 text-white font-bold py-5 px-12 border-black uppercase tracking-wider transition-all transform hover:rotate-1 hover:scale-105"
              style={{
                fontFamily: '"Courier New", Courier, monospace',
                letterSpacing: '0.1em',
                borderWidth: '3px',
                borderStyle: 'solid',
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,0.5)',
                fontSize: '1.1rem'
              }}
            >
              Start Here →
            </button>
          </div>
        </div>
      )}

      {/* Funky footer border */}
      <div className="h-2 bg-black mt-20" style={{
        clipPath: 'polygon(0 100%, 2% 0, 4% 100%, 6% 0, 8% 100%, 10% 0, 12% 100%, 14% 0, 16% 100%, 18% 0, 20% 100%, 22% 0, 24% 100%, 26% 0, 28% 100%, 30% 0, 32% 100%, 34% 0, 36% 100%, 38% 0, 40% 100%, 42% 0, 44% 100%, 46% 0, 48% 100%, 50% 0, 52% 100%, 54% 0, 56% 100%, 58% 0, 60% 100%, 62% 0, 64% 100%, 66% 0, 68% 100%, 70% 0, 72% 100%, 74% 0, 76% 100%, 78% 0, 80% 100%, 82% 0, 84% 100%, 86% 0, 88% 100%, 90% 0, 92% 100%, 94% 0, 96% 100%, 98% 0, 100% 100%)'
      }} />
    </div>
  )
}
