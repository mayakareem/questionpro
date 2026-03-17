import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PlanCardProps {
  title: string
  description?: string
  children: React.ReactNode
  icon?: React.ReactNode
}

export function PlanCard({ title, description, children, icon }: PlanCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          {icon && <div className="flex-shrink-0 mt-1">{icon}</div>}
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
