'use client'

import { motion } from 'framer-motion'
import { VerseAudioPlayer } from '@/components/shared/verse-audio-player'
import { ShareVerseCard } from '@/components/shared/share-verse-card'
import { BookOpen } from 'lucide-react'

export type PartType = 'A' | 'B' | 'C' | 'intro' | 'appendix'

interface VerseDisplayProps {
  arabicVerse: string;
  translation: string;
  translationSource: string;
  chapterTitle?: string;
  part?: PartType;
}

// Resolve part key for color mappings — intro/appendix default to A (amber)
function partKey(part?: PartType): 'A' | 'B' | 'C' {
  if (part === 'B') return 'B'
  if (part === 'C') return 'C'
  return 'A'
}

// Part-aware decorative header line gradient
const partHeaderLine: Record<string, string> = {
  A: 'from-transparent to-amber-300/40 dark:to-amber-600/30',
  B: 'from-transparent to-emerald-300/40 dark:to-emerald-600/30',
  C: 'from-transparent to-violet-300/40 dark:to-violet-600/30',
}

// Part-aware header label pill
const partHeaderPill: Record<string, string> = {
  A: 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/40 dark:border-amber-800/30',
  B: 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/40 dark:border-emerald-800/30',
  C: 'bg-violet-50/80 dark:bg-violet-950/30 border-violet-200/40 dark:border-violet-800/30',
}

// Part-aware header icon color
const partHeaderIcon: Record<string, string> = {
  A: 'text-amber-600 dark:text-amber-400',
  B: 'text-emerald-600 dark:text-emerald-400',
  C: 'text-violet-600 dark:text-violet-400',
}

// Part-aware header label text color
const partHeaderText: Record<string, string> = {
  A: 'text-amber-700 dark:text-amber-400',
  B: 'text-emerald-700 dark:text-emerald-400',
  C: 'text-violet-700 dark:text-violet-400',
}

// Part-aware inner frame border
const partFrameBorder: Record<string, string> = {
  A: 'border-amber-200/60 dark:border-amber-700/50',
  B: 'border-emerald-200/60 dark:border-emerald-700/50',
  C: 'border-violet-200/60 dark:border-violet-700/50',
}

// Part-aware inner frame background gradient
const partFrameBg: Record<string, string> = {
  A: 'from-amber-50 via-amber-50/80 to-amber-100/60 dark:from-amber-950/40 dark:via-amber-950/30 dark:to-amber-950/20',
  B: 'from-emerald-50 via-emerald-50/80 to-emerald-100/60 dark:from-emerald-950/40 dark:via-emerald-950/30 dark:to-emerald-950/20',
  C: 'from-violet-50 via-violet-50/80 to-violet-100/60 dark:from-violet-950/40 dark:via-violet-950/30 dark:to-violet-950/20',
}

// Part-aware background pattern color (rgba)
const partPatternColor: Record<string, string> = {
  A: 'rgba(217, 169, 99, 0.4)',
  B: 'rgba(110, 231, 183, 0.4)',
  C: 'rgba(196, 181, 253, 0.4)',
}

// Part-aware radial glow classes
const partRadialGlow: Record<string, string> = {
  A: 'from-amber-200/20 via-transparent to-transparent dark:from-amber-700/10 dark:via-transparent dark:to-transparent',
  B: 'from-emerald-200/20 via-transparent to-transparent dark:from-emerald-700/10 dark:via-transparent dark:to-transparent',
  C: 'from-violet-200/20 via-transparent to-transparent dark:from-violet-700/10 dark:via-transparent dark:to-transparent',
}

// Part-aware ornamental ✦ line color
const partOrnamentLine: Record<string, string> = {
  A: 'text-amber-500 dark:text-amber-400',
  B: 'text-emerald-500 dark:text-emerald-400',
  C: 'text-violet-500 dark:text-violet-400',
}

// Part-aware outer corner border (thick)
const partCornerThick: Record<string, string> = {
  A: 'border-amber-400/50 dark:border-amber-500/30',
  B: 'border-emerald-400/50 dark:border-emerald-500/30',
  C: 'border-violet-400/50 dark:border-violet-500/30',
}

// Part-aware inner corner border (thin)
const partCornerThin: Record<string, string> = {
  A: 'border-amber-300/30 dark:border-amber-600/20',
  B: 'border-emerald-300/30 dark:border-emerald-600/20',
  C: 'border-violet-300/30 dark:border-violet-600/20',
}

// Part-aware Arabic verse text color
const partVerseText: Record<string, string> = {
  A: 'text-amber-950 dark:text-amber-100',
  B: 'text-emerald-950 dark:text-emerald-100',
  C: 'text-violet-950 dark:text-violet-100',
}

// Part-aware text shadow
const partVerseShadow: Record<string, string> = {
  A: '[text-shadow:0_1px_2px_rgba(180,83,9,0.06)] dark:[text-shadow:0_0_20px_rgba(251,191,36,0.15)]',
  B: '[text-shadow:0_1px_2px_rgba(5,150,105,0.06)] dark:[text-shadow:0_0_20px_rgba(52,211,153,0.15)]',
  C: '[text-shadow:0_1px_2px_rgba(124,58,237,0.06)] dark:[text-shadow:0_0_20px_rgba(196,181,253,0.15)]',
}

// Part-aware gradient border CSS class
const partGradientBorderClass: Record<string, string> = {
  A: 'verse-gradient-border-a',
  B: 'verse-gradient-border-b',
  C: 'verse-gradient-border-c',
}

export function VerseDisplay({ arabicVerse, translation, translationSource, chapterTitle, part }: VerseDisplayProps) {
  const pk = partKey(part)

  return (
    <div className="space-y-6">
      {/* Decorative header label */}
      <div className="flex items-center justify-center gap-2">
        <div className={`h-px flex-1 max-w-16 bg-gradient-to-r ${partHeaderLine[pk]}`} />
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${partHeaderPill[pk]} border`}>
          <BookOpen className={`h-3 w-3 ${partHeaderIcon[pk]}`} />
          <span className={`text-[10px] font-semibold tracking-wider uppercase ${partHeaderText[pk]}`}>Verset d&apos;ancrage</span>
        </div>
        <div className={`h-px flex-1 max-w-16 bg-gradient-to-l ${partHeaderLine[pk]}`} />
      </div>

      {/* Illuminated manuscript frame with animated gradient border + breathing */}
      <div className="relative">
        {/* Animated gradient border layer */}
        <div className={`${partGradientBorderClass[pk]} rounded-xl p-[2px]`}>
          {/* Inner border to create the "border" effect */}
          <div className={`rounded-[10px] border ${partFrameBorder[pk]} bg-gradient-to-b ${partFrameBg[pk]} p-6 md:p-10 relative overflow-hidden verse-frame-breathing ink-wash`}>
 
            {/* Subtle background pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, ${partPatternColor[pk]} 1px, transparent 1px),
                  radial-gradient(circle at 80% 80%, ${partPatternColor[pk]} 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px, 24px 24px',
              }}
            />

            {/* Subtle radial glow behind text */}
            <div className={`absolute inset-0 bg-gradient-radial ${partRadialGlow[pk]} pointer-events-none`} />

            {/* Action buttons row in header area */}
            <div className="flex items-center justify-end gap-1 mb-4 relative z-20">
              <VerseAudioPlayer arabicText={arabicVerse} part={part} />
              <ShareVerseCard
                arabicVerse={arabicVerse}
                translation={translation}
                translationSource={translationSource}
                chapterTitle={chapterTitle}
              />
            </div>

            {/* Top ornamental line */}
            <div className={`text-center mb-6 ${partOrnamentLine[pk]} tracking-[0.5em] text-sm select-none`}>
              ✦ ✦ ✦
            </div>

            {/* Double-line ornamental corners — outer */}
            <div className={`absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 ${partCornerThick[pk]} rounded-tl-sm`} />
            <div className={`absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 ${partCornerThick[pk]} rounded-tr-sm`} />
            <div className={`absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 ${partCornerThick[pk]} rounded-bl-sm`} />
            <div className={`absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 ${partCornerThick[pk]} rounded-br-sm`} />
            {/* Double-line ornamental corners — inner */}
            <div className={`absolute top-5 left-5 w-5 h-5 border-t border-l ${partCornerThin[pk]} rounded-tl-sm`} />
            <div className={`absolute top-5 right-5 w-5 h-5 border-t border-r ${partCornerThin[pk]} rounded-tr-sm`} />
            <div className={`absolute bottom-5 left-5 w-5 h-5 border-b border-l ${partCornerThin[pk]} rounded-bl-sm`} />
            <div className={`absolute bottom-5 right-5 w-5 h-5 border-b border-r ${partCornerThin[pk]} rounded-br-sm`} />

            {/* Arabic verse with subtle breathing animation */}
            <motion.p
              dir="rtl"
              lang="ar"
              className={`arabic-verse text-4xl md:text-5xl text-center ${partVerseText[pk]} ${partVerseShadow[pk]} relative z-10 leading-[2.5]`}
              animate={{
                scale: [1, 1.008, 1],
                opacity: [1, 0.96, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {arabicVerse}
            </motion.p>

            {/* Bottom ornamental line */}
            <div className={`text-center mt-6 ${partOrnamentLine[pk]} tracking-[0.5em] text-sm select-none`}>
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
