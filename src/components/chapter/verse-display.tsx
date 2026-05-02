'use client'

interface VerseDisplayProps {
  arabicVerse: string;
  translation: string;
  translationSource: string;
}

export function VerseDisplay({ arabicVerse, translation, translationSource }: VerseDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="relative rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-6 md:p-8">
        {/* Decorative ornamental top border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-50 dark:bg-amber-950/30 px-3">
          <span className="text-2xl">📜</span>
        </div>

        <p
          dir="rtl"
          lang="ar"
          className="text-3xl md:text-4xl leading-loose text-amber-900 dark:text-amber-100 font-arabic text-center"
        >
          {arabicVerse}
        </p>
      </div>

      <div className="text-center space-y-1">
        <p className="text-lg italic text-muted-foreground">
          {translation}
        </p>
        <p className="text-sm text-muted-foreground/70">
          — {translationSource}
        </p>
      </div>
    </div>
  )
}
