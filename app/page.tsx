'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Download, ArrowRight, Share2, Clock, ExternalLink, Copy, Check, BookOpen, Plus, Save, X } from 'lucide-react'
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

interface TemplateItem {
  id: string
  name: string
  description: string
  category: string
  questionTemplate: string
  isBuiltin: boolean
  config?: Record<string, unknown>
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
  const [templates, setTemplates] = useState<TemplateItem[]>([])
  const [showTemplates, setShowTemplates] = useState(false)
  const [templateFilter, setTemplateFilter] = useState<string | null>(null)
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [saveTemplateName, setSaveTemplateName] = useState('')
  const [saveTemplateCategory, setSaveTemplateCategory] = useState('Custom')
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)

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

    // Fetch templates
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates')
        if (response.ok) {
          const data = await response.json()
          if (data.success) setTemplates(data.templates)
        }
      } catch (error) {
        console.error('Failed to fetch templates:', error)
      }
    }
    fetchTemplates()

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

  // Save current plan as a template
  const handleSaveAsTemplate = async () => {
    if (!result?.plan || !saveTemplateName.trim()) return
    setIsSavingTemplate(true)
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: saveTemplateName.trim(),
          description: `Template based on: ${result.plan.userQuestion.substring(0, 100)}`,
          category: saveTemplateCategory,
          questionTemplate: result.plan.userQuestion,
          config: {
            methods: result.plan.recommendedMethods?.map(m => m.name.replace(/\*\*/g, '')) || [],
          },
        }),
      })
      if (response.ok) {
        setShowSaveTemplate(false)
        setSaveTemplateName('')
        // Refresh templates
        const tplRes = await fetch('/api/templates')
        if (tplRes.ok) {
          const data = await tplRes.json()
          if (data.success) setTemplates(data.templates)
        }
      }
    } catch (error) {
      console.error('Failed to save template:', error)
    } finally {
      setIsSavingTemplate(false)
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

  const downloadReport = async () => {
    if (!result?.plan) return

    setIsExporting(true)
    try {
      // If we have a project ID, use the GET endpoint (simpler)
      if (result.projectId) {
        const a = document.createElement('a')
        a.href = `/api/export?p=${result.projectId}`
        a.download = `research-plan-${result.projectId}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        // POST the plan data directly
        const response = await fetch('/api/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: result.plan })
        })

        if (!response.ok) throw new Error('Export failed')

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `research-plan-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('PDF export failed. Please try again.')
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

        {/* Template Picker Section */}
        {!result && (
          <div className="mb-12">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="w-full flex items-center justify-center gap-3 py-4 border-black bg-white hover:bg-gray-50 transition-all transform hover:scale-[1.01]"
              style={{
                fontFamily: '"Courier New", Courier, monospace',
                borderWidth: '3px',
                borderStyle: 'dashed',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.5)'
              }}
            >
              <BookOpen className="h-5 w-5" />
              <span className="font-bold uppercase text-sm tracking-wider">
                {showTemplates ? 'Hide Templates' : 'Start from a Template'}
              </span>
              <span className="text-xs text-gray-500">({templates.length} available)</span>
            </button>

            {showTemplates && templates.length > 0 && (
              <div className="mt-6">
                {/* Category filter pills */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  <button
                    onClick={() => setTemplateFilter(null)}
                    className={`px-4 py-2 text-xs font-bold uppercase border-2 border-black transition-all ${
                      !templateFilter ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                    }`}
                    style={{ fontFamily: '"Courier New", Courier, monospace' }}
                  >
                    All
                  </button>
                  {[...new Set(templates.map(t => t.category))].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setTemplateFilter(templateFilter === cat ? null : cat)}
                      className={`px-4 py-2 text-xs font-bold uppercase border-2 border-black transition-all ${
                        templateFilter === cat ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                      }`}
                      style={{ fontFamily: '"Courier New", Courier, monospace' }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Template cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates
                    .filter(t => !templateFilter || t.category === templateFilter)
                    .map(template => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setQuestion(template.questionTemplate)
                        setShowTemplates(false)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="text-left p-5 border-black bg-white hover:bg-gray-50 transition-all transform hover:-rotate-0.5 hover:scale-[1.02]"
                      style={{
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)'
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-bold text-sm" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                          {template.name}
                        </span>
                        <span className={`text-xs px-2 py-0.5 font-bold uppercase ${
                          template.isBuiltin ? 'bg-black text-white' : 'bg-yellow-200 text-black border border-black'
                        }`}
                              style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                          {template.isBuiltin ? template.category : 'Custom'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        {template.description}
                      </p>
                      <p className="text-xs text-gray-400 italic" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        "{template.questionTemplate.length > 80
                          ? template.questionTemplate.substring(0, 80) + '...'
                          : template.questionTemplate}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
                    <div className="border-2 border-black px-4 py-2 text-xs font-bold uppercase">Save Template</div>
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
              <>
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
                      {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                      {isExporting ? 'Exporting...' : 'Download PDF'}
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
                          {copied ? 'Copied!' : 'Share →'}
                        </Button>
                      )}
                      <Button
                        onClick={() => setShowSaveTemplate(true)}
                        className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-8 border-black uppercase transition-all transform hover:rotate-1"
                        style={{
                          fontFamily: '"Courier New", Courier, monospace',
                          letterSpacing: '0.05em',
                          borderWidth: '3px',
                          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                        }}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save as Template
                      </Button>
                    </div>

                    {/* Save as Template Modal */}
                    {showSaveTemplate && (
                      <div className="mt-6 border-black p-6 bg-yellow-50"
                           style={{
                             borderWidth: '3px',
                             borderStyle: 'solid',
                             boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                           }}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold uppercase text-sm" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                            Save as Custom Template
                          </h4>
                          <button onClick={() => setShowSaveTemplate(false)}>
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Template name..."
                            value={saveTemplateName}
                            onChange={(e) => setSaveTemplateName(e.target.value)}
                            className="w-full p-3 border-2 border-black text-sm"
                            style={{ fontFamily: '"Courier New", Courier, monospace' }}
                          />
                          <select
                            value={saveTemplateCategory}
                            onChange={(e) => setSaveTemplateCategory(e.target.value)}
                            className="w-full p-3 border-2 border-black text-sm bg-white"
                            style={{ fontFamily: '"Courier New", Courier, monospace' }}
                          >
                            <option value="Custom">Custom</option>
                            <option value="SaaS">SaaS</option>
                            <option value="Brand">Brand</option>
                            <option value="CX">CX</option>
                            <option value="Product">Product</option>
                            <option value="People">People</option>
                            <option value="Growth">Growth</option>
                          </select>
                          <Button
                            onClick={handleSaveAsTemplate}
                            disabled={!saveTemplateName.trim() || isSavingTemplate}
                            className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 border-black uppercase"
                            style={{
                              fontFamily: '"Courier New", Courier, monospace',
                              borderWidth: '3px',
                              boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.4)'
                            }}
                          >
                            {isSavingTemplate ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {isSavingTemplate ? 'Saving...' : 'Save Template'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Output Preview - What the final report would look like */}
              <div className="mt-10 border-black bg-white p-8 transform rotate-0.5"
                   style={{
                     borderWidth: '3px',
                     borderStyle: 'dashed',
                     boxShadow: '6px 6px 0px 0px rgba(0,0,0,0.15)'
                   }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold uppercase transform -rotate-0.5"
                        style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      📊 What Your Final Report Would Look Like
                    </h3>
                    <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      Preview of the presentation deck with data visualizations
                    </p>
                  </div>
                </div>

                {/* Mock slide preview grid */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {/* Slide 1 - Title */}
                  <div className="border-2 border-gray-300 bg-gradient-to-br from-gray-900 to-gray-700 p-4 aspect-video flex flex-col justify-center items-center text-white"
                       style={{ borderRadius: '2px' }}>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Slide 1</div>
                    <div className="text-sm font-bold text-center leading-tight">
                      {result.plan?.userQuestion && result.plan.userQuestion.length > 60
                        ? result.plan.userQuestion.substring(0, 60) + '...'
                        : result.plan?.userQuestion}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">Research Findings Report</div>
                  </div>

                  {/* Slide 2 - Chart mockup */}
                  <div className="border-2 border-gray-300 bg-white p-4 aspect-video flex flex-col"
                       style={{ borderRadius: '2px' }}>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Slide 3</div>
                    <div className="text-xs font-bold mb-2" style={{ fontFamily: '"Courier New", monospace' }}>Key Findings</div>
                    <div className="flex-1 flex items-end gap-1 px-2">
                      <div className="bg-blue-600 w-full" style={{ height: '70%' }}></div>
                      <div className="bg-blue-500 w-full" style={{ height: '55%' }}></div>
                      <div className="bg-blue-400 w-full" style={{ height: '85%' }}></div>
                      <div className="bg-blue-300 w-full" style={{ height: '40%' }}></div>
                      <div className="bg-blue-600 w-full" style={{ height: '65%' }}></div>
                      <div className="bg-blue-500 w-full" style={{ height: '45%' }}></div>
                    </div>
                  </div>

                  {/* Slide 3 - Pie chart mockup */}
                  <div className="border-2 border-gray-300 bg-white p-4 aspect-video flex flex-col"
                       style={{ borderRadius: '2px' }}>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Slide 5</div>
                    <div className="text-xs font-bold mb-2" style={{ fontFamily: '"Courier New", monospace' }}>Segment Analysis</div>
                    <div className="flex-1 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-16 h-16">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#2563EB" strokeWidth="20" strokeDasharray="75 175" transform="rotate(-90 50 50)" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#60A5FA" strokeWidth="20" strokeDasharray="50 200" strokeDashoffset="-75" transform="rotate(-90 50 50)" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#93C5FD" strokeWidth="20" strokeDasharray="45 205" strokeDashoffset="-125" transform="rotate(-90 50 50)" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#BFDBFE" strokeWidth="20" strokeDasharray="80 170" strokeDashoffset="-170" transform="rotate(-90 50 50)" />
                      </svg>
                    </div>
                  </div>

                  {/* Slide 4 - Data table mockup */}
                  <div className="border-2 border-gray-300 bg-white p-4 aspect-video flex flex-col"
                       style={{ borderRadius: '2px' }}>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Slide 6</div>
                    <div className="text-xs font-bold mb-2" style={{ fontFamily: '"Courier New", monospace' }}>Comparative Data</div>
                    <div className="flex-1 space-y-1">
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-100 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-100 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-100 rounded w-full"></div>
                    </div>
                  </div>

                  {/* Slide 5 - Recommendations */}
                  <div className="border-2 border-gray-300 bg-white p-4 aspect-video flex flex-col"
                       style={{ borderRadius: '2px' }}>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Slide 8</div>
                    <div className="text-xs font-bold mb-2" style={{ fontFamily: '"Courier New", monospace' }}>Recommendations</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>

                  {/* Slide 6 - Next steps */}
                  <div className="border-2 border-gray-300 bg-gradient-to-br from-blue-700 to-blue-900 p-4 aspect-video flex flex-col justify-center items-center text-white"
                       style={{ borderRadius: '2px' }}>
                    <div className="text-xs uppercase tracking-wider text-blue-300 mb-2">Slide 10</div>
                    <div className="text-sm font-bold text-center">Next Steps &</div>
                    <div className="text-sm font-bold text-center">Action Plan</div>
                    <div className="text-xs text-blue-300 mt-2">QuestionPro Implementation</div>
                  </div>
                </div>

                {/* CTA for full deck */}
                <div className="text-center border-t-2 border-dashed border-gray-300 pt-6">
                  <p className="text-sm font-bold mb-3" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    Get a 10-slide presentation deck with real charts, inferences, and recommendations
                  </p>
                  <Button
                    disabled
                    className="bg-gray-400 text-white font-bold py-3 px-8 border-gray-400 uppercase cursor-not-allowed"
                    style={{
                      fontFamily: '"Courier New", Courier, monospace',
                      letterSpacing: '0.05em',
                      borderWidth: '3px',
                      boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.3)'
                    }}
                  >
                    Generate Full Deck - Coming Soon
                  </Button>
                  <p className="text-xs text-gray-400 mt-2" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    Professional PPTX with data visualizations - available in the next update
                  </p>
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

        {/* Project History Section */}
        {!result && projects.length > 0 && (
          <div className="mt-20 mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-black transform rotate-1"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              <Clock className="inline-block mr-2 h-7 w-7" />
              Research History
            </h2>
            <div className="space-y-3 max-w-4xl mx-auto">
              {projects.slice(0, 10).map((project) => (
                <div
                  key={project.id}
                  onClick={() => loadSharedProject(project.id)}
                  className="border-black p-4 bg-white transform hover:-rotate-0.5 transition-all cursor-pointer hover:bg-gray-50"
                  style={{
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)'
                  }}
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

        {/* Analytics Section */}
        {!result && (
          <div className="mt-20 mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-black transform -rotate-1"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              ✎ Search Analytics
            </h2>

            {analytics ? (
              <>
            {/* Stats boxes */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="border-black p-6 bg-white text-center transform -rotate-1"
                   style={{
                     borderWidth: '3px',
                     borderStyle: 'solid',
                     boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="text-4xl font-bold mb-2">{analytics.totalSearches}</div>
                <div className="text-sm uppercase font-bold text-gray-600"
                     style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  Total Searches
                </div>
              </div>

              <div className="border-black p-6 bg-white text-center transform rotate-1"
                   style={{
                     borderWidth: '3px',
                     borderStyle: 'solid',
                     boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="text-4xl font-bold mb-2 text-green-700">{analytics.successfulSearches}</div>
                <div className="text-sm uppercase font-bold text-gray-600"
                     style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  Successful ✓
                </div>
              </div>

              <div className="border-black p-6 bg-white text-center transform -rotate-0.5"
                   style={{
                     borderWidth: '3px',
                     borderStyle: 'solid',
                     boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="text-4xl font-bold mb-2 text-red-700">{analytics.failedSearches}</div>
                <div className="text-sm uppercase font-bold text-gray-600"
                     style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  Failed ✗
                </div>
              </div>
            </div>

            {/* Recent searches list */}
            {analytics.recentSearches.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-4 transform rotate-0.5 inline-block"
                  style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                → Latest Searches
              </h3>
              <div className="space-y-3">
                {analytics.recentSearches.map((search, idx) => (
                  <div
                    key={idx}
                    className="border-black p-4 bg-white transform -rotate-0.5"
                    style={{
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <span className={`text-2xl ${search.success ? 'text-green-600' : 'text-red-600'}`}>
                          {search.success ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold mb-1"
                           style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                          {search.question.length > 120
                            ? search.question.substring(0, 120) + '...'
                            : search.question}
                        </p>
                        <div className="flex gap-4 text-xs text-gray-600"
                             style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                          <span>{new Date(search.timestamp).toLocaleString()}</span>
                          {search.methods && search.methods.length > 0 && (
                            <span>Methods: {search.methods.join(', ')}</span>
                          )}
                        </div>
                        {search.error && (
                          <p className="text-xs text-red-600 mt-1"
                             style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                            Error: {search.error}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  Run a search to see detailed history here →
                </p>
              </div>
            )}
            </>
            ) : (
              <div className="text-center py-12">
                <div className="inline-block border-black p-8 bg-gray-50 transform -rotate-1"
                     style={{
                       borderWidth: '3px',
                       borderStyle: 'dashed',
                       boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                     }}>
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500"
                     style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    Loading analytics...
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
