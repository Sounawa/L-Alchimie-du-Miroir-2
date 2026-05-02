'use client'

interface QuoteBlockProps {
  text: string;
  source: string;
}

export function QuoteBlock({ text, source }: QuoteBlockProps) {
  return (
    <div className="rounded-md border-l-4 border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 p-4">
      <p className="italic text-muted-foreground leading-relaxed">
        « {text} »
      </p>
      <p className="text-sm text-muted-foreground/70 mt-2">
        — {source}
      </p>
    </div>
  )
}
