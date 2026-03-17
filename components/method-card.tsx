import { Badge } from '@/components/ui/badge'

interface MethodCardProps {
  name: string
  isPrimary: boolean
}

export function MethodCard({ name, isPrimary }: MethodCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
      <div className="flex-1">
        <p className="font-semibold text-slate-900">{name}</p>
      </div>
      {isPrimary && (
        <Badge variant="default">Primary</Badge>
      )}
      {!isPrimary && (
        <Badge variant="secondary">Supporting</Badge>
      )}
    </div>
  )
}
