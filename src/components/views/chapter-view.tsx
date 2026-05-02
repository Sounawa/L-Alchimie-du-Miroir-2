'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
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

export function ChapterView() {
  const navigate = useAppStore((s) => s.navigate)
  const chapterId = useAppStore((s) => s.currentChapterId)
  const toggleChapterComplete = useAppStore((s) => s.toggleChapterComplete)
  const isChapterComplete = useAppStore((s) => s.isChapterComplete)
  const { toast } = useToast()

  const chapter = chapterId ? (getChapterById(chapterId) as Chapter | undefined) : undefined
  const completed = chapterId ? isChapterComplete(chapterId) : false

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      {/* Back button */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('toc')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Table des matières
        </Button>
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
          <WordAnalysisTable words={chapter.wordAnalysis} />
        </motion.div>
      )}

      {/* Comparison table */}
      {chapter.comparisonTable && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <ComparisonTableBlock
            headers={chapter.comparisonTable.headers}
            rows={chapter.comparisonTable.rows}
          />
        </motion.div>
      )}

      {/* Coherence points */}
      {chapter.coherencePoints && chapter.coherencePoints.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <CoherencePoints points={chapter.coherencePoints} />
        </motion.div>
      )}

      {/* Callout blocks */}
      {chapter.callouts && chapter.callouts.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
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
          <BulletPointsList points={chapter.bulletPoints} />
        </motion.div>
      )}

      {/* Treasures list */}
      {chapter.treasuresList && chapter.treasuresList.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <TreasuresList treasures={chapter.treasuresList} />
        </motion.div>
      )}

      {/* Metaphor table */}
      {chapter.metaphorTable && chapter.metaphorTable.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <MetaphorTable metaphors={chapter.metaphorTable} />
        </motion.div>
      )}

      {/* Mirror questions */}
      {chapter.mirrorQuestions.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <MirrorQuestionsTable questions={chapter.mirrorQuestions} />
        </motion.div>
      )}

      {/* Munajat section */}
      {chapter.munajatPrompts.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <MunajatSection
            chapterId={chapterId}
            prompts={chapter.munajatPrompts}
          />
        </motion.div>
      )}

      {/* Timer section */}
      {chapter.timerMinutes > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <TimerSection
            chapterId={chapterId}
            minutes={chapter.timerMinutes}
          />
        </motion.div>
      )}

      {/* Exercise section */}
      {chapter.exercises.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <ExerciseSection
            chapterId={chapterId}
            exercises={chapter.exercises}
          />
        </motion.div>
      )}

      {/* Extra sections (B3-B10) */}
      {chapter.extraSections && chapter.extraSections.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <ExtraSections
            chapterId={chapterId}
            sections={chapter.extraSections}
          />
        </motion.div>
      )}

      {/* Quotes */}
      {chapter.quotes && chapter.quotes.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
          {chapter.quotes.map((quote, i) => (
            <QuoteBlock
              key={i}
              text={quote.text}
              source={quote.source}
            />
          ))}
        </motion.div>
      )}

      {/* Chapter navigation */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between pt-4 border-t">
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
    </div>
  )
}
