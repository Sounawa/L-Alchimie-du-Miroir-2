'use client'

interface VerseDisplayProps {
  arabicVerse: string;
  translation: string;
  translationSource: string;
}

export function VerseDisplay({ arabicVerse, translation, translationSource }: VerseDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Illuminated manuscript frame */}
      <div className="relative">
        {/* Outer decorative border */}
        <div className="rounded-xl border-2 border-amber-400/50 dark:border-amber-600/40 p-1">
          <div className="rounded-lg border border-amber-300/60 dark:border-amber-700/50 bg-gradient-to-b from-amber-50 via-amber-50/80 to-amber-100/60 dark:from-amber-950/40 dark:via-amber-950/30 dark:to-amber-950/20 p-6 md:p-10 relative overflow-hidden">

            {/* Subtle golden radial glow behind text */}
            <div className="absolute inset-0 bg-gradient-radial from-amber-200/20 via-transparent to-transparent dark:from-amber-700/10 dark:via-transparent dark:to-transparent pointer-events-none" />

            {/* Top ornamental line */}
            <div className="text-center mb-6 text-amber-500 dark:text-amber-400 tracking-[0.5em] text-sm select-none">
              ✦ ✦ ✦
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400/60 dark:border-amber-500/40 rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400/60 dark:border-amber-500/40 rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400/60 dark:border-amber-500/40 rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400/60 dark:border-amber-500/40 rounded-br-sm" />

            {/* Arabic verse */}
            <p
              dir="rtl"
              lang="ar"
              className="arabic-verse text-4xl md:text-5xl text-center text-amber-900 dark:text-amber-100 dark:[text-shadow:0_0_20px_rgba(251,191,36,0.15)] relative z-10"
            >
              {arabicVerse}
            </p>

            {/* Bottom ornamental line */}
            <div className="text-center mt-6 text-amber-500 dark:text-amber-400 tracking-[0.5em] text-sm select-none">
              ✦ ✦ ✦
            </div>
          </div>
        </div>
      </div>

      {/* Translation */}
      <div className="text-center space-y-1 px-4">
        <p className="text-lg italic text-muted-foreground leading-relaxed">
          {translation}
        </p>
        <p className="text-sm text-muted-foreground/70">
          — {translationSource}
        </p>
      </div>
    </div>
  )
}
