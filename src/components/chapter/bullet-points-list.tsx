'use client'

interface BulletPointsListProps {
  points: string[];
}

export function BulletPointsList({ points }: BulletPointsListProps) {
  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {points.map((point, i) => {
          const colonIndex = point.indexOf(' :')
          const title = colonIndex > -1 ? point.slice(0, colonIndex) : ''
          const description = colonIndex > -1 ? point.slice(colonIndex + 2) : point

          return (
            <li
              key={i}
              className="flex items-start gap-2 transition-colors hover:text-foreground text-muted-foreground"
            >
              <span className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5">◆</span>
              <div className="leading-relaxed">
                {title && (
                  <span className="font-bold text-foreground">{title} :</span>
                )}{' '}
                <span>{description}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
