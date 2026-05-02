'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters } from '@/data/chapters'
import { Button } from '@/components/ui/button'
import { X, BookOpen, Sparkles } from 'lucide-react'

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function VerseOfTheDay() {
  const isVerseOfDayDismissed = useAppStore((s) => s.isVerseOfDayDismissed)
  const dismissVerseOfDay = useAppStore((s) => s.dismissVerseOfDay)
  const navigate = useAppStore((s) => s.navigate)

  // Get chapters with Arabic verses
  const chaptersWithVerses = useMemo(
    () => allChapters.filter((c) => c.arabicVerse && c.translation),
    []
  )

  // Deterministically select verse based on day of year
  const todayVerse = useMemo(() => {
    if (chaptersWithVerses.length === 0) return null
    const dayOfYear = getDayOfYear()
    const index = dayOfYear % chaptersWithVerses.length
    return chaptersWithVerses[index]
  }, [chaptersWithVerses])

  const dismissed = isVerseOfDayDismissed()

  if (!todayVerse || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative rounded-xl border border-amber-200/50 dark:border-amber-800/30 overflow-hidden shadow-sm"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-amber-100/40 to-amber-50/60 dark:from-amber-950/30 dark:via-amber-900/15 dark:to-amber-950/20 pointer-events-none" />

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] islamic-pattern pointer-events-none" />

        <div className="relative p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 font-semibold">
                  Verset du jour
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissVerseOfDay}
              className="h-6 w-6 p-0 text-muted-foreground/40 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Arabic verse */}
          <div className="text-center mb-3">
            <div className="text-amber-500 dark:text-amber-400 tracking-[0.5em] text-[10px] mb-2 select-none">
              ✦ ✦ ✦
            </div>
            <p
              className="arabic-verse text-2xl md:text-3xl leading-loose text-amber-900 dark:text-amber-100"
              lang="ar"
              dir="rtl"
            >
              {todayVerse.arabicVerse}
            </p>
            <div className="text-amber-500 dark:text-amber-400 tracking-[0.5em] text-[10px] mt-2 select-none">
              ✦ ✦ ✦
            </div>
          </div>

          {/* French translation */}
          <p className="text-sm italic text-muted-foreground/80 text-center leading-relaxed mb-3">
            {todayVerse.translation}
          </p>

          {/* Chapter info + link */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/30 px-1.5 py-0.5 rounded font-medium">
                {todayVerse.number}
              </span>
              <span className="text-xs text-muted-foreground">{todayVerse.title}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('chapter', todayVerse.id)}
              className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 gap-1 h-7 px-2"
            >
              <BookOpen className="h-3 w-3" />
              Lire
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
