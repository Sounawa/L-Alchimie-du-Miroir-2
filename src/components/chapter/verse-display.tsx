'use client'

import { motion } from 'framer-motion'
import { VerseAudioPlayer } from '@/components/shared/verse-audio-player'
import { ShareVerseCard } from '@/components/shared/share-verse-card'
import { BookOpen } from 'lucide-react'

interface VerseDisplayProps {
  arabicVerse: string;
  translation: string;
  translationSource: string;
  chapterTitle?: string;
}

export function VerseDisplay({ arabicVerse, translation, translationSource, chapterTitle }: VerseDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Decorative header label */}
      <div className="flex items-center justify-center gap-2">
        <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-amber-300/40 dark:to-amber-600/30" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/40 dark:border-amber-800/30">
          <BookOpen className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400">Verset d&apos;ancrage</span>
        </div>
        <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-amber-300/40 dark:to-amber-600/30" />
      </div>

      {/* Illuminated manuscript frame with animated gradient border + breathing */}
      <div className="relative">
        {/* Animated gradient border layer */}
        <div className="verse-gradient-border rounded-xl p-[2px]">
          {/* Inner border to create the "border" effect */}
          <div className="rounded-[10px] border border-amber-200/60 dark:border-amber-700/50 bg-gradient-to-b from-amber-50 via-amber-50/80 to-amber-100/60 dark:from-amber-950/40 dark:via-amber-950/30 dark:to-amber-950/20 p-6 md:p-10 relative overflow-hidden verse-frame-breathing ink-wash">

            {/* Subtle background pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(217, 169, 99, 0.4) 1px, transparent 1px),
                  radial-gradient(circle at 80% 80%, rgba(217, 169, 99, 0.4) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px, 24px 24px',
              }}
            />

            {/* Subtle golden radial glow behind text */}
            <div className="absolute inset-0 bg-gradient-radial from-amber-200/20 via-transparent to-transparent dark:from-amber-700/10 dark:via-transparent dark:to-transparent pointer-events-none" />

            {/* Action buttons row in header area */}
            <div className="flex items-center justify-end gap-1 mb-4 relative z-20">
              <VerseAudioPlayer arabicText={arabicVerse} />
              <ShareVerseCard
                arabicVerse={arabicVerse}
                translation={translation}
                translationSource={translationSource}
                chapterTitle={chapterTitle}
              />
            </div>

            {/* Top ornamental line */}
            <div className="text-center mb-6 text-amber-500 dark:text-amber-400 tracking-[0.5em] text-sm select-none">
              ✦ ✦ ✦
            </div>

            {/* Double-line ornamental corners — outer */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/50 dark:border-amber-500/30 rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/50 dark:border-amber-500/30 rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/50 dark:border-amber-500/30 rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/50 dark:border-amber-500/30 rounded-br-sm" />
            {/* Double-line ornamental corners — inner */}
            <div className="absolute top-5 left-5 w-5 h-5 border-t border-l border-amber-300/30 dark:border-amber-600/20 rounded-tl-sm" />
            <div className="absolute top-5 right-5 w-5 h-5 border-t border-r border-amber-300/30 dark:border-amber-600/20 rounded-tr-sm" />
            <div className="absolute bottom-5 left-5 w-5 h-5 border-b border-l border-amber-300/30 dark:border-amber-600/20 rounded-bl-sm" />
            <div className="absolute bottom-5 right-5 w-5 h-5 border-b border-r border-amber-300/30 dark:border-amber-600/20 rounded-br-sm" />

            {/* Arabic verse with subtle breathing animation */}
            <motion.p
              dir="rtl"
              lang="ar"
              className="arabic-verse text-4xl md:text-5xl text-center text-amber-950 dark:text-amber-100 [text-shadow:0_1px_2px_rgba(180,83,9,0.06)] dark:[text-shadow:0_0_20px_rgba(251,191,36,0.15)] relative z-10 leading-[2.5]"
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
