'use client'

import { useMemo, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters } from '@/data/chapters'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, BookOpen, Sparkles, Share2, Check } from 'lucide-react'

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// Part-aware color maps
const partAccentBorder: Record<string, string> = {
  A: 'border-amber-300/60 dark:border-amber-600/40',
  B: 'border-emerald-300/60 dark:border-emerald-600/40',
  C: 'border-violet-300/60 dark:border-violet-600/40',
  intro: 'border-stone-300/60 dark:border-stone-600/40',
  appendix: 'border-stone-300/60 dark:border-stone-600/40',
}

const partAccentBg: Record<string, string> = {
  A: 'from-amber-50/80 via-amber-100/40 to-amber-50/60 dark:from-amber-950/30 dark:via-amber-900/15 dark:to-amber-950/20',
  B: 'from-emerald-50/80 via-emerald-100/40 to-emerald-50/60 dark:from-emerald-950/30 dark:via-emerald-900/15 dark:to-emerald-950/20',
  C: 'from-violet-50/80 via-violet-100/40 to-violet-50/60 dark:from-violet-950/30 dark:via-violet-900/15 dark:to-violet-950/20',
  intro: 'from-stone-50/80 via-stone-100/40 to-stone-50/60 dark:from-stone-950/30 dark:via-stone-900/15 dark:to-stone-950/20',
  appendix: 'from-stone-50/80 via-stone-100/40 to-stone-50/60 dark:from-stone-950/30 dark:via-stone-900/15 dark:to-stone-950/20',
}

const partAccentText: Record<string, string> = {
  A: 'text-amber-600 dark:text-amber-400',
  B: 'text-emerald-600 dark:text-emerald-400',
  C: 'text-violet-600 dark:text-violet-400',
  intro: 'text-stone-600 dark:text-stone-400',
  appendix: 'text-stone-600 dark:text-stone-400',
}

const partAccentBadge: Record<string, string> = {
  A: 'bg-amber-100/60 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
  B: 'bg-emerald-100/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
  C: 'bg-violet-100/60 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300',
  intro: 'bg-stone-100/60 dark:bg-stone-950/30 text-stone-700 dark:text-stone-300',
  appendix: 'bg-stone-100/60 dark:bg-stone-950/30 text-stone-700 dark:text-stone-300',
}

const partIconBg: Record<string, string> = {
  A: 'bg-amber-100 dark:bg-amber-900/30',
  B: 'bg-emerald-100 dark:bg-emerald-900/30',
  C: 'bg-violet-100 dark:bg-violet-900/30',
  intro: 'bg-stone-100 dark:bg-stone-900/30',
  appendix: 'bg-stone-100 dark:bg-stone-900/30',
}

export function VerseOfTheDay() {
  const isVerseOfDayDismissed = useAppStore((s) => s.isVerseOfDayDismissed)
  const dismissVerseOfDay = useAppStore((s) => s.dismissVerseOfDay)
  const navigate = useAppStore((s) => s.navigate)
  const [copied, setCopied] = useState(false)

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

  // Share/copy verse text
  const handleShare = useCallback(async () => {
    if (!todayVerse) return
    const text = `${todayVerse.arabicVerse}\n\n${todayVerse.translation}\n\n— ${todayVerse.number} · ${todayVerse.title}\n\nL'Alchimie du Miroir`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: no share available
    }
  }, [todayVerse])

  if (!todayVerse || dismissed) return null

  const part = todayVerse.part

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`relative rounded-xl border overflow-hidden shadow-sm ${partAccentBorder[part] || partAccentBorder.A}`}
      >
        {/* Background gradient — part-aware */}
        <div className={`absolute inset-0 bg-gradient-to-br ${partAccentBg[part] || partAccentBg.A} pointer-events-none`} />

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] islamic-pattern pointer-events-none" />

        <div className="relative p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center h-7 w-7 rounded-full ${partIconBg[part] || partIconBg.A}`}>
                <Sparkles className={`h-3.5 w-3.5 ${partAccentText[part] || partAccentText.A}`} />
              </div>
              <div>
                <p className={`text-[10px] uppercase tracking-wider font-semibold ${partAccentText[part] || partAccentText.A} opacity-70`}>
                  Verset du jour
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-6 w-6 p-0 text-muted-foreground/40 hover:text-foreground"
                title="Copier le verset"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissVerseOfDay}
                className="h-6 w-6 p-0 text-muted-foreground/40 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Arabic verse */}
          <div className="text-center mb-3">
            <div className={`tracking-[0.5em] text-[10px] mb-2 select-none ${partAccentText[part] || partAccentText.A} opacity-50`}>
              ✦ ✦ ✦
            </div>
            <p
              className="arabic-verse text-2xl md:text-3xl leading-loose text-amber-900 dark:text-amber-100"
              lang="ar"
              dir="rtl"
            >
              {todayVerse.arabicVerse}
            </p>
            <div className={`tracking-[0.5em] text-[10px] mt-2 select-none ${partAccentText[part] || partAccentText.A} opacity-50`}>
              ✦ ✦ ✦
            </div>
          </div>

          {/* French translation */}
          <p className="text-sm italic text-muted-foreground/80 text-center leading-relaxed mb-3">
            {todayVerse.translation}
          </p>

          {/* Chapter info + navigation link */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Badge className={`text-[10px] border-0 ${partAccentBadge[part] || partAccentBadge.A}`}>
                Partie {part}
              </Badge>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/30 px-1.5 py-0.5 rounded font-medium">
                {todayVerse.number}
              </span>
              <span className="text-xs text-muted-foreground">{todayVerse.title}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('chapter', todayVerse.id)}
              className={`text-xs gap-1 h-7 px-2 ${partAccentText[part] || partAccentText.A} hover:opacity-80`}
            >
              <BookOpen className="h-3 w-3" />
              Explorer ce chapitre
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
