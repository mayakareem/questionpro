import { AlertCircle, AlertTriangle } from 'lucide-react'

interface AssumptionCardProps {
  items: string[]
  type: 'assumption' | 'caveat'
}

export function AssumptionCard({ items, type }: AssumptionCardProps) {
  const isAssumption = type === 'assumption'

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`flex gap-3 p-3 rounded-lg border ${
            isAssumption
              ? 'bg-blue-50 border-blue-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {isAssumption ? (
              <AlertCircle className="w-4 h-4 text-blue-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <p className={`text-sm ${
            isAssumption ? 'text-blue-900' : 'text-amber-900'
          }`}>
            {item}
          </p>
        </div>
      ))}
    </div>
  )
}
