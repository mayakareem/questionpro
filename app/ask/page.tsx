import { AskForm } from '@/components/ask-form'

export default function AskPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Ask Your Research Question
          </h1>
          <p className="text-slate-600">
            Describe your research question in plain English.
            Our AI will recommend the right methodology and guide you through implementation.
          </p>
        </div>

        {/* Form */}
        <AskForm />

        {/* Info cards */}
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">What You'll Get</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Research objective and decision clarity</li>
              <li>• Recommended methodologies with rationale</li>
              <li>• QuestionPro implementation guide</li>
              <li>• Expected outputs and next steps</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">Supported Questions</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Pricing and monetization</li>
              <li>• Feature prioritization</li>
              <li>• Customer experience and churn</li>
              <li>• Brand perception and competitive analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
