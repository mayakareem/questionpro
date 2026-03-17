'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlanCard } from '@/components/plan-card'
import { MethodCard } from '@/components/method-card'
import { OutputCard } from '@/components/output-card'
import { AssumptionCard } from '@/components/assumption-card'
import {
  Target,
  Lightbulb,
  FlaskConical,
  Settings,
  BarChart3,
  CheckCircle2,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import type { PlanResponse } from '@/types/api'

export default function ResultPage() {
  const [planResponse, setPlanResponse] = useState<PlanResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('researchPlan')
    if (!stored) {
      router.push('/ask')
      return
    }

    try {
      const parsed = JSON.parse(stored) as PlanResponse
      setPlanResponse(parsed)
    } catch (error) {
      console.error('Failed to parse research plan:', error)
      router.push('/ask')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading your research plan...</span>
        </div>
      </div>
    )
  }

  if (!planResponse?.success || !planResponse?.plan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">
            {planResponse?.error?.message || 'No research plan found'}
          </p>
          <Button onClick={() => router.push('/ask')}>
            Create New Plan
          </Button>
        </div>
      </div>
    )
  }

  const { plan: researchPlan, metadata } = planResponse

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/ask')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Question
          </Button>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Your Research Plan
          </h1>
          <p className="text-slate-600 italic">
            "{researchPlan.userQuestion}"
          </p>

          {metadata && (
            <div className="flex gap-4 mt-4 text-xs text-slate-500">
              <span>Generated in {(metadata.processingTimeMs / 1000).toFixed(1)}s</span>
              <span>•</span>
              <span>{metadata.methodsIncluded.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Plan content */}
        <div className="space-y-6">
          {/* Business Decision */}
          <PlanCard
            title="What You're Trying to Decide"
            icon={<Target className="w-5 h-5 text-primary" />}
          >
            <p className="text-slate-700 leading-relaxed">
              {researchPlan.businessDecision}
            </p>
          </PlanCard>

          {/* Research Objective */}
          <PlanCard
            title="Research Objective"
            icon={<Lightbulb className="w-5 h-5 text-primary" />}
          >
            <p className="text-slate-700 leading-relaxed">
              {researchPlan.researchObjective}
            </p>
          </PlanCard>

          {/* Recommended Methods */}
          <PlanCard
            title="Recommended Methodologies"
            description="Research methods that best fit your question"
            icon={<FlaskConical className="w-5 h-5 text-primary" />}
          >
            <div className="space-y-3">
              {researchPlan.recommendedMethods.map((method, idx) => (
                <MethodCard
                  key={idx}
                  name={method.name}
                  isPrimary={method.isPrimary}
                />
              ))}
            </div>
          </PlanCard>

          {/* QuestionPro Implementation */}
          <PlanCard
            title="How to Conduct in QuestionPro"
            description={`Sample size: ${researchPlan.implementation.sampleSize} • Timeline: ${researchPlan.implementation.timeline}`}
            icon={<Settings className="w-5 h-5 text-primary" />}
          >
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
              {researchPlan.implementation.questionProSteps}
            </div>
          </PlanCard>

          {/* Expected Outputs */}
          <PlanCard
            title="Expected Outputs"
            description="What you'll receive from this research"
            icon={<BarChart3 className="w-5 h-5 text-primary" />}
          >
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
              {researchPlan.expectedOutputs}
            </div>
          </PlanCard>

          {/* Decision Support */}
          <PlanCard
            title="What These Outputs Enable You to Decide"
            icon={<CheckCircle2 className="w-5 h-5 text-primary" />}
          >
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
              {researchPlan.decisionSupport}
            </div>
          </PlanCard>

          {/* Assumptions & Caveats */}
          <div className="grid md:grid-cols-2 gap-6">
            <PlanCard title="Assumptions">
              <AssumptionCard items={researchPlan.assumptions} type="assumption" />
            </PlanCard>

            <PlanCard title="Caveats & Limitations">
              <AssumptionCard items={researchPlan.caveats} type="caveat" />
            </PlanCard>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-12 flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.print()}
          >
            Print Plan
          </Button>
          <Button
            size="lg"
            onClick={() => router.push('/ask')}
          >
            Create Another Plan
          </Button>
        </div>
      </div>
    </div>
  )
}
