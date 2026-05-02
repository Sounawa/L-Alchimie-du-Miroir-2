'use client'

interface CoherencePointsProps {
  points: string[];
}

export function CoherencePoints({ points }: CoherencePointsProps) {
  return (
    <div className="space-y-3">
      <ol className="space-y-3">
        {points.map((point, i) => {
          const colonIndex = point.indexOf(' :')
          const title = colonIndex > -1 ? point.slice(0, colonIndex) : ''
          const description = colonIndex > -1 ? point.slice(colonIndex + 2) : point

          return (
            <li key={i} className="flex items-start gap-3 border-l-4 border-amber-400 dark:border-amber-600 pl-4">
              <span className="text-amber-600 dark:text-amber-400 font-bold text-lg shrink-0">
                {i + 1}.
              </span>
              <div className="leading-relaxed">
                {title && (
                  <span className="font-bold">{title} :</span>
                )}{' '}
                <span className="text-muted-foreground">{description}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
