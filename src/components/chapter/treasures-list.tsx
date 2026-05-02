'use client'

interface TreasuresListProps {
  treasures: string[];
}

export function TreasuresList({ treasures }: TreasuresListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
        Les dix trésors
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {treasures.map((treasure, i) => {
          const colonIndex = treasure.indexOf(' :')
          const name = colonIndex > -1 ? treasure.slice(0, colonIndex) : ''
          const description = colonIndex > -1 ? treasure.slice(colonIndex + 2) : treasure

          return (
            <div
              key={i}
              className="flex items-start gap-3 rounded-md border bg-amber-50/50 dark:bg-amber-950/20 p-3 border-amber-200 dark:border-amber-800"
            >
              <span className="text-amber-600 dark:text-amber-400 font-bold text-lg shrink-0 min-w-[2ch] text-right">
                {i + 1}.
              </span>
              <div>
                {name && (
                  <span className="font-bold text-amber-900 dark:text-amber-200">{name} :</span>
                )}{' '}
                <span className="text-sm text-muted-foreground">{description}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
