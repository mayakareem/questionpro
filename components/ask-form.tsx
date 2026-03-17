'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import type { PlanRequest, PlanResponse } from '@/types/api'

const EXAMPLE_PROMPTS = [
  "What should we charge for our new premium tier?",
  "Which features should we prioritize on our product roadmap?",
  "Why are customers churning from our service?",
  "How satisfied are our enterprise customers compared to SMB customers?",
  "What's causing the 75% cart abandonment rate on our website?",
  "How well-known is our brand compared to competitors?",
]

export function AskForm() {
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (question.trim().length < 10) {
      setError('Please enter a more detailed question (at least 10 characters)')
      return
    }

    setIsLoading(true)

    try {
      const requestBody: PlanRequest = {
        userQuestion: question,
        options: {
          includeExamples: true,
          maxPrimaryMethods: 2,
          maxSecondaryMethods: 2
        }
      }

      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data: PlanResponse = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to generate research plan')
      }

      // Store result in sessionStorage
      sessionStorage.setItem('researchPlan', JSON.stringify(data))

      // Navigate to results page
      router.push('/result')
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setQuestion(example)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What should we charge for our new premium tier?"
          className="min-h-[120px] text-base resize-none"
          disabled={isLoading}
        />

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">
            {question.length} characters
          </span>
          <Button
            type="submit"
            size="lg"
            disabled={isLoading || question.trim().length < 10}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Get Research Plan'
            )}
          </Button>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
            {error}
          </div>
        )}
      </form>

      {/* Example prompts */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Example Questions</p>
        <div className="grid gap-2">
          {EXAMPLE_PROMPTS.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleClick(example)}
              className="text-left text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-3 rounded-md border border-transparent hover:border-slate-200 transition-colors"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
