'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Share2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/use-app-store'
import { allChapters, getChapterById } from '@/data/chapters'

// 5 French Islamic motivational quotes
const motivationalQuotes = [
  {
    text: "Celui qui chemine vers Dieu, Dieu vient à sa rencontre à grande allure.",
    source: "Hadith — Sahih Muslim",
  },
  {
    text: "La connaissance est une lumière que Dieu dépose dans le cœur.",
    source: "Sagesse d'Al-Ghazālī",
  },
  {
    text: "Chaque jour qui passe sans augmentation de ta science est un jour perdu.",
    source: "Ibn al-Qayyim",
  },
  {
    text: "Les croyants sont comme un édifice dont les parties se soutiennent mutuellement.",
    source: "Hadith — Sahih al-Bukhârî",
  },
  {
    text: "Dieu ne change pas l'état d'un peuple tant que celui-ci ne change pas ce qui est en lui-même.",
    source: "Coran 13:11",
  },
]

interface CompletionSummaryCardProps {
  chapterId: string
  chapterTitle: string
  chapterNumber: string
}

export function CompletionSummaryCard({
  chapterId,
  chapterTitle,
  chapterNumber,
}: CompletionSummaryCardProps) {
  const navigate = useAppStore((s) => s.navigate)
  const isChapterComplete = useAppStore((s) => s.isChapterComplete)
  const completed = isChapterComplete(chapterId)

  // Find next chapter
  const nextChapter = useMemo(() => {
    const idx = allChapters.findIndex((c) => c.id === chapterId)
    return idx < allChapters.length - 1 ? allChapters[idx + 1] : null
  }, [chapterId])

  // Pick a random motivational quote (deterministic based on chapterId)
  const quote = useMemo(() => {
    const hash = chapterId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return motivationalQuotes[hash % motivationalQuotes.length]
  }, [chapterId])

  // Estimate reading time from chapter data
  const readingTime = useMemo(() => {
    const chapter = getChapterById(chapterId)
    if (!chapter) return 0
    let wordCount = 0
    if (chapter.arabicVerse) wordCount += chapter.arabicVerse.split(/\s+/).length
    if (chapter.translation) wordCount += chapter.translation.split(/\s+/).length
    wordCount += chapter.wordAnalysis.reduce((acc, w) => acc + (w.mirrorDimension?.split(/\s+/).length || 0) + (w.literalMeaning?.split(/\s+/).length || 0), 0)
    wordCount += chapter.mirrorQuestions.reduce((acc, q) => acc + (q.question?.split(/\s+/).length || 0) + (q.meditation?.split(/\s+/).length || 0), 0)
    wordCount += chapter.munajatPrompts.reduce((acc, p) => acc + (p?.split(/\s+/).length || 0), 0)
    wordCount += chapter.exercises.reduce((acc, e) => acc + (e.question?.split(/\s+/).length || 0), 0)
    return Math.max(3, Math.ceil(wordCount / 200))
  }, [chapterId])

  // Share handler
  const handleShare = () => {
    const text = `✨ J'ai terminé le Chapitre ${chapterNumber} — ${chapterTitle} dans L'Alchimie du Miroir !\n\n"${quote.text}"\n— ${quote.source}`
    if (navigator.share) {
      navigator.share({
        title: "L'Alchimie du Miroir — Accomplissement",
        text,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).catch(() => {})
    }
  }

  // Only show when chapter is completed
  if (!completed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-xl overflow-hidden border border-emerald-300/40 dark:border-emerald-700/30 shadow-lg"
    >
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-emerald-500/90 via-emerald-600/80 to-amber-500/80 dark:from-emerald-700/80 dark:via-emerald-800/70 dark:to-amber-700/70 px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-200" />
          <h3 className="text-lg font-bold text-white">✨ Chapitre terminé !</h3>
        </div>
        <p className="text-sm text-white/90 mt-1 font-medium">{chapterNumber} — {chapterTitle}</p>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-b from-emerald-50/80 to-amber-50/50 dark:from-stone-800/60 dark:to-stone-900/40 px-5 py-4 space-y-4">
        {/* Reading time */}
        <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300/80">
          <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span>Temps de lecture estimé : <strong>{readingTime} min</strong></span>
        </div>

        {/* Motivational quote */}
        <div className="rounded-lg border border-amber-200/60 dark:border-amber-700/30 bg-amber-50/60 dark:bg-amber-950/20 px-4 py-3">
          <p className="text-sm italic text-stone-700 dark:text-stone-200/80 leading-relaxed">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="text-xs text-amber-700/70 dark:text-amber-300/50 mt-1.5 font-medium">
            — {quote.source}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {nextChapter && (
            <Button
              onClick={() => navigate('chapter', nextChapter.id)}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md gap-2"
              size="sm"
            >
              Continuer
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex-1 border-amber-300/60 dark:border-amber-700/40 hover:bg-amber-50 dark:hover:bg-amber-950/20 gap-2"
            size="sm"
          >
            <Share2 className="h-4 w-4" />
            Partager votre accomplissement
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
