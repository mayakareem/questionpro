interface OutputCardProps {
  title: string
  content: string
}

export function OutputCard({ title, content }: OutputCardProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm text-slate-900">{title}</h4>
      <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
        {content}
      </div>
    </div>
  )
}
