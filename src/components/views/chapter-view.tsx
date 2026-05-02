'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUp, ChevronLeft, ChevronRight, CheckCircle2, Bookmark, BookmarkCheck } from 'lucide-react'
import { useAppStore } from '@/store/use-app-store'
import { allChapters, getChapterById } from '@/data/chapters'
import type { Chapter } from '@/data/chapters'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

import { VerseDisplay } from '@/components/chapter/verse-display'
import { WordAnalysisTable } from '@/components/chapter/word-analysis-table'
import { ComparisonTableBlock } from '@/components/chapter/comparison-table-block'
import { CalloutBlock } from '@/components/chapter/callout-block'
import { CoherencePoints } from '@/components/chapter/coherence-points'
import { BulletPointsList } from '@/components/chapter/bullet-points-list'
import { TreasuresList } from '@/components/chapter/treasures-list'
import { MetaphorTable } from '@/components/chapter/metaphor-table'
import { MirrorQuestionsTable } from '@/components/chapter/mirror-questions-table'
import { MunajatSection } from '@/components/chapter/munajat-section'
import { TimerSection } from '@/components/chapter/timer-section'
import { ExerciseSection } from '@/components/chapter/exercise-section'
import { ExtraSections } from '@/components/chapter/extra-sections'
import { QuoteBlock } from '@/components/chapter/quote-block'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' },
  }),
}

// Decorative divider component
function DecorativeDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300/40 dark:to-amber-600/30" />
      <span className="text-amber-400/50 dark:text-amber-500/40 text-xs tracking-[0.3em] select-none">✦</span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300/40 dark:to-amber-600/30" />
    </div>
  )
}

// Section header with gradient underline
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1">
      {children}
      <div className="mt-1 h-0.5 w-16 rounded-full bg-gradient-to-r from-amber-500/60 to-transparent dark:from-amber-400/40" />
    </div>
  )
}

export function ChapterView() {
  const navigate = useAppStore((s) => s.navigate)
  const chapterId = useAppStore((s) => s.currentChapterId)
  const toggleChapterComplete = useAppStore((s) => s.toggleChapterComplete)
  const isChapterComplete = useAppStore((s) => s.isChapterComplete)
  const addBookmark = useAppStore((s) => s.addBookmark)
  const removeBookmark = useAppStore((s) => s.removeBookmark)
  const isBookmarked = useAppStore((s) => s.isBookmarked)
  const { toast } = useToast()

  const chapter = chapterId ? (getChapterById(chapterId) as Chapter | undefined) : undefined
  const completed = chapterId ? isChapterComplete(chapterId) : false
  const bookmarked = chapterId ? isBookmarked(chapterId) : false

  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Find prev/next chapters
  const { prevChapter, nextChapter } = useMemo(() => {
    if (!chapterId) return { prevChapter: null, nextChapter: null }
    const idx = allChapters.findIndex((c) => c.id === chapterId)
    return {
      prevChapter: idx > 0 ? allChapters[idx - 1] : null,
      nextChapter: idx < allChapters.length - 1 ? allChapters[idx + 1] : null,
    }
  }, [chapterId])

  if (!chapter || !chapterId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Chapitre introuvable.</p>
        <Button variant="outline" onClick={() => navigate('toc')} className="mt-4">
          Retour à la table des matières
        </Button>
      </div>
    )
  }

  let sectionIndex = 0

  const handleToggleComplete = () => {
    toggleChapterComplete(chapterId)
    const nowComplete = !completed
    toast({
      description: nowComplete
        ? 'Chapitre marqué comme terminé ✓'
        : 'Chapitre marqué comme en cours',
    })
  }

  const handleToggleBookmark = () => {
    if (!chapterId || !chapter) return
    if (bookmarked) {
      removeBookmark(chapterId)
      toast({ description: 'Retiré des favoris' })
    } else {
      addBookmark(chapterId, `${chapter.number} — ${chapter.title}`)
      toast({ description: 'Ajouté aux favoris ★' })
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Back button and Bookmark */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('toc')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Table des matières
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleBookmark}
            className={bookmarked ? 'text-amber-500' : 'text-muted-foreground'}
          >
            {bookmarked ? <BookmarkCheck className="h-4 w-4 mr-1" /> : <Bookmark className="h-4 w-4 mr-1" />}
            {bookmarked ? 'Favoris' : 'Ajouter aux favoris'}
          </Button>
        </div>
      </motion.div>

      {/* Chapter header */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="text-center space-y-2">
        <Badge variant="outline" className="text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 mb-2">
          Chapitre {chapter.number}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {chapter.title}
        </h1>
        <p className="text-lg text-muted-foreground">{chapter.subtitle}</p>
      </motion.div>

      {/* Decorative divider */}
      <DecorativeDivider />

      {/* Verse display */}
      {chapter.arabicVerse && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <VerseDisplay
            arabicVerse={chapter.arabicVerse}
            translation={chapter.translation}
            translationSource={chapter.translationSource}
          />
        </motion.div>
      )}

      {/* Word analysis table */}
      {chapter.wordAnalysis.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <DecorativeDivider />
          <SectionHeader>
            <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-300/80">Analyse des mots</h2>
          </SectionHeader>
          <WordAnalysisTable words={chapter.wordAnalysis} />
        </motion.div>
      )}

      {/* Comparison table */}
      {chapter.comparisonTable && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <DecorativeDivider />
          <SectionHeader>
            <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-300/80">Tableau comparatif</h2>
          </SectionHeader>
          <ComparisonTableBlock
            headers={chapter.comparisonTable.headers}
            rows={chapter.comparisonTable.rows}
          />
        </motion.div>
      )}

      {/* Coherence points */}
      {chapter.coherencePoints && chapter.coherencePoints.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <DecorativeDivider />
          <SectionHeader>
            <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-300/80">Cohérence</h2>
          </SectionHeader>
          <CoherencePoints points={chapter.coherencePoints} />
        </motion.div>
      )}

      {/* Callout blocks */}
      {chapter.callouts && chapter.callouts.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
          <DecorativeDivider />
          {chapter.callouts.map((callout, i) => (
            <CalloutBlock
              key={i}
              type={callout.type}
              title={callout.title}
              content={callout.content}
            />
          ))}
        </motion.div>
      )}

      {/* Bullet points */}
      {chapter.bulletPoints && chapter.bulletPoints.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <DecorativeDivider />
          <SectionHeader>
            <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-300/80">Points clés</h2>
          </SectionHeader>
          <BulletPointsList points={chapter.bulletPoints} />
        </motion.div>
      )}

      {/* Treasures list */}
      {chapter.treasuresList && chapter.treasuresList.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <DecorativeDivider />
          <SectionHeader>
            <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-300/80">Trésors</h2>
          </SectionHeader>
          <TreasuresList treasures={chapter.treasuresList} />
        </motion.div>
      )}

      {/* Metaphor table */}
      {chapter.metaphorTable && chapter.metaphorTable.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <DecorativeDivider />
          <SectionHeader>
            <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-300/80">Métaphores</h2>
          </SectionHeader>
          <MetaphorTable metaphors={chapter.metaphorTable} />
        </motion.div>
      )}

      {/* Mirror questions */}
      {chapter.mirrorQuestions.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <DecorativeDivider />
          <SectionHeader>
            <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-300/80">Questions miroir</h2>
          </SectionHeader>
          <MirrorQuestionsTable questions={chapter.mirrorQuestions} />
        </motion.div>
      )}

      {/* Munajat section */}
      {chapter.munajatPrompts.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <DecorativeDivider />
          <SectionHeader>
            <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-300/80">Munajat — Méditation intime</h2>
          </SectionHeader>
          <MunajatSection
            chapterId={chapterId}
            prompts={chapter.munajatPrompts}
          />
        </motion.div>
      )}

      {/* Timer section */}
      {chapter.timerMinutes > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <DecorativeDivider />
          <SectionHeader>
            <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-300/80">Méditation silencieuse</h2>
          </SectionHeader>
          <TimerSection
            chapterId={chapterId}
            minutes={chapter.timerMinutes}
          />
        </motion.div>
      )}

      {/* Exercise section */}
      {chapter.exercises.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <DecorativeDivider />
          <SectionHeader>
            <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-300/80">Exercices</h2>
          </SectionHeader>
          <ExerciseSection
            chapterId={chapterId}
            exercises={chapter.exercises}
          />
        </motion.div>
      )}

      {/* Extra sections (B3-B10) */}
      {chapter.extraSections && chapter.extraSections.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <DecorativeDivider />
          <SectionHeader>
            <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-300/80">Sections supplémentaires</h2>
          </SectionHeader>
          <ExtraSections
            chapterId={chapterId}
            sections={chapter.extraSections}
          />
        </motion.div>
      )}

      {/* Quotes */}
      {chapter.quotes && chapter.quotes.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
          <DecorativeDivider />
          {chapter.quotes.map((quote, i) => (
            <QuoteBlock
              key={i}
              text={quote.text}
              source={quote.source}
            />
          ))}
        </motion.div>
      )}

      {/* Decorative end divider */}
      <DecorativeDivider />

      {/* Chapter navigation */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between pt-4 border-t border-stone-200/60 dark:border-stone-700/30">
        {prevChapter ? (
          <Button
            variant="outline"
            onClick={() => navigate('chapter', prevChapter.id)}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Chapitre précédent</span>
            <span className="sm:hidden">Précédent</span>
          </Button>
        ) : (
          <div />
        )}

        {nextChapter ? (
          <Button
            variant="outline"
            onClick={() => navigate('chapter', nextChapter.id)}
            className="gap-1"
          >
            <span className="hidden sm:inline">Chapitre suivant</span>
            <span className="sm:hidden">Suivant</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div />
        )}
      </motion.div>

      {/* Complete chapter checkbox */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3 py-4">
        <Checkbox
          id={`complete-${chapterId}`}
          checked={completed}
          onCheckedChange={handleToggleComplete}
        />
        <label
          htmlFor={`complete-${chapterId}`}
          className="text-sm font-medium leading-none cursor-pointer select-none flex items-center gap-2"
        >
          Marquer ce chapitre comme terminé
          {completed && <CheckCircle2 className="h-4 w-4 text-green-600" />}
        </label>
      </motion.div>

      {/* Back to top floating button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg hover:bg-amber-700 transition-colors"
          aria-label="Retour en haut"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  )
}
