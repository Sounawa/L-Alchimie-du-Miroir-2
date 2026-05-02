'use client'

import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowLeft, ArrowUp, ChevronLeft, ChevronRight, CheckCircle2, Bookmark, BookmarkCheck, List, ChevronDown, Clock, Sparkles, BookOpen, Eye, Lightbulb, Gem } from 'lucide-react'
import { useAppStore } from '@/store/use-app-store'
import { allChapters, getChapterById } from '@/data/chapters'
import type { Chapter } from '@/data/chapters'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

import { VerseDisplay } from '@/components/chapter/verse-display'
import { ChapterNotesSummary } from '@/components/shared/chapter-notes-summary'
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
import { ChapterProgressIndicator } from '@/components/shared/chapter-progress-indicator'
import { CompletionSummaryCard } from '@/components/shared/completion-summary-card'

// Decorative divider component
function DecorativeDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300/30 to-amber-400/50 dark:via-amber-600/20 dark:to-amber-600/30" />
      <span className="text-amber-400/50 dark:text-amber-500/40 text-xs tracking-[0.3em] select-none">✦</span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-300/30 to-amber-400/50 dark:via-amber-600/20 dark:to-amber-600/30" />
    </div>
  )
}

// Calculate reading time for a chapter
function getChapterReadingTime(chapter: Chapter): number {
  let wordCount = 0
  if (chapter.arabicVerse) wordCount += chapter.arabicVerse.split(/\s+/).length
  if (chapter.translation) wordCount += chapter.translation.split(/\s+/).length
  wordCount += chapter.wordAnalysis.reduce((acc, w) => acc + (w.mirrorDimension?.split(/\s+/).length || 0) + (w.literalMeaning?.split(/\s+/).length || 0), 0)
  wordCount += chapter.mirrorQuestions.reduce((acc, q) => acc + (q.question?.split(/\s+/).length || 0) + (q.meditation?.split(/\s+/).length || 0), 0)
  wordCount += chapter.munajatPrompts.reduce((acc, p) => acc + (p?.split(/\s+/).length || 0), 0)
  wordCount += chapter.exercises.reduce((acc, e) => acc + (e.question?.split(/\s+/).length || 0), 0)
  if (chapter.coherencePoints) wordCount += chapter.coherencePoints.reduce((acc, p) => acc + (p?.split(/\s+/).length || 0), 0)
  if (chapter.bulletPoints) wordCount += chapter.bulletPoints.reduce((acc, p) => acc + (p?.split(/\s+/).length || 0), 0)
  if (chapter.callouts) wordCount += chapter.callouts.reduce((acc, c) => acc + (c.title?.split(/\s+/).length || 0) + (c.content?.split(/\s+/).length || 0), 0)
  if (chapter.treasuresList) wordCount += chapter.treasuresList.reduce((acc, t) => acc + (t?.split(/\s+/).length || 0), 0)
  if (chapter.metaphorTable) wordCount += chapter.metaphorTable.reduce((acc, m) => acc + (m.interpretation?.split(/\s+/).length || 0) + (m.metaphor?.split(/\s+/).length || 0), 0)
  if (chapter.extraSections) wordCount += chapter.extraSections.reduce((acc, s) => acc + (s.translation?.split(/\s+/).length || 0) + (s.commentary?.split(/\s+/).length || 0), 0)
  if (chapter.quotes) wordCount += chapter.quotes.reduce((acc, q) => acc + (q.text?.split(/\s+/).length || 0), 0)
  const readMinutes = Math.ceil(wordCount / 200)
  return Math.max(readMinutes, 3)
}

// Part-based background gradient
const partBgGradient: Record<string, string> = {
  A: 'from-amber-50/30 via-transparent to-amber-50/20 dark:from-amber-950/10 dark:via-transparent dark:to-amber-950/5',
  B: 'from-emerald-50/20 via-transparent to-amber-50/20 dark:from-emerald-950/8 dark:via-transparent dark:to-amber-950/5',
  C: 'from-violet-50/20 via-transparent to-amber-50/20 dark:from-violet-950/8 dark:via-transparent dark:to-amber-950/5',
}

// Part-based section icon color
const partIconColor: Record<string, string> = {
  A: 'text-amber-500 dark:text-amber-400',
  B: 'text-emerald-500 dark:text-emerald-400',
  C: 'text-violet-500 dark:text-violet-400',
}

// Animated section wrapper using framer-motion useInView
function AnimatedSection({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// Section header with gradient underline and colored icon
function SectionHeader({ children, id, part = 'A', icon }: { children: React.ReactNode; id?: string; part?: string; icon?: React.ReactNode }) {
  const iconColor = partIconColor[part] || partIconColor.A
  return (
    <div className="mb-2" id={id}>
      <div className="flex items-center gap-2">
        {icon && <span className={iconColor}>{icon}</span>}
        {children}
      </div>
      <div className="mt-1.5 h-0.5 w-20 rounded-full bg-gradient-to-r from-amber-500/50 to-transparent dark:from-amber-400/30" />
    </div>
  )
}

// Build list of sections for the mini-TOC
function buildSectionsList(chapter: Chapter) {
  const sections: { id: string; label: string }[] = []
  if (chapter.arabicVerse) sections.push({ id: 'section-verse', label: 'Verset' })
  if (chapter.wordAnalysis.length > 0) sections.push({ id: 'section-words', label: 'Analyse des mots' })
  if (chapter.comparisonTable) sections.push({ id: 'section-comparison', label: 'Tableau comparatif' })
  if (chapter.coherencePoints && chapter.coherencePoints.length > 0) sections.push({ id: 'section-coherence', label: 'Cohérence' })
  if (chapter.callouts && chapter.callouts.length > 0) sections.push({ id: 'section-callouts', label: 'Encadrés' })
  if (chapter.bulletPoints && chapter.bulletPoints.length > 0) sections.push({ id: 'section-bullets', label: 'Points clés' })
  if (chapter.treasuresList && chapter.treasuresList.length > 0) sections.push({ id: 'section-treasures', label: 'Trésors' })
  if (chapter.metaphorTable && chapter.metaphorTable.length > 0) sections.push({ id: 'section-metaphors', label: 'Métaphores' })
  if (chapter.mirrorQuestions.length > 0) sections.push({ id: 'section-mirror', label: 'Questions miroir' })
  if (chapter.munajatPrompts.length > 0) sections.push({ id: 'section-munajat', label: 'Munajat' })
  if (chapter.timerMinutes > 0) sections.push({ id: 'section-timer', label: 'Méditation silencieuse' })
  if (chapter.exercises.length > 0) sections.push({ id: 'section-exercises', label: 'Exercices' })
  if (chapter.extraSections && chapter.extraSections.length > 0) sections.push({ id: 'section-extra', label: 'Sections supplémentaires' })
  if (chapter.quotes && chapter.quotes.length > 0) sections.push({ id: 'section-quotes', label: 'Citations' })
  return sections
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
  const partLetter = chapter?.part || 'A'

  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showStickyTitle, setShowStickyTitle] = useState(false)
  const [showTocDropdown, setShowTocDropdown] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
      setShowStickyTitle(window.scrollY > 250)
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

  // Build sections list for mini-TOC
  const sectionsList = useMemo(() => chapter ? buildSectionsList(chapter) : [], [chapter])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setShowTocDropdown(false)
  }, [])

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

  const handleToggleComplete = () => {
    toggleChapterComplete(chapterId)
    const nowComplete = !completed
    if (nowComplete) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
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
    <>
      {/* Sticky chapter title bar */}
      <AnimatePresence>
        {showStickyTitle && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-14 left-0 right-0 z-30 border-b bg-background/85 backdrop-blur-lg dark:bg-background/75 lg:left-72"
          >
            <div className="mx-auto flex h-10 max-w-3xl items-center gap-3 px-4">
              <Badge variant="outline" className="text-[10px] text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 shrink-0">
                {chapter.number}
              </Badge>
              <span className="truncate text-sm font-medium">{chapter.title}</span>
              {/* Mini TOC dropdown toggle */}
              <div className="relative ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTocDropdown(!showTocDropdown)}
                  className="h-7 gap-1 text-xs text-muted-foreground"
                >
                  <List className="h-3.5 w-3.5" />
                  <ChevronDown className={`h-3 w-3 transition-transform ${showTocDropdown ? 'rotate-180' : ''}`} />
                </Button>
                <AnimatePresence>
                  {showTocDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 w-52 rounded-lg border bg-background/95 backdrop-blur-md shadow-lg p-1 z-50"
                    >
                      {sectionsList.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-left hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors"
                        >
                          <span className="h-1 w-1 rounded-full bg-amber-400 dark:bg-amber-500 shrink-0" />
                          {section.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration overlay when chapter completed */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="rounded-2xl border border-amber-300/40 bg-gradient-to-br from-amber-50 to-amber-100/80 dark:from-stone-800 dark:to-amber-950/30 px-8 py-6 text-center shadow-2xl"
            >
              <div className="text-4xl mb-2">🎉🎊✨</div>
              <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300 mb-1">Masha&apos;Allah !</h3>
              <p className="text-sm text-stone-600 dark:text-stone-300/80">Chapitre complété avec succès !</p>
              <p className="text-xs text-stone-500 dark:text-stone-400/60 mt-1">Que cette lumière continue de vous guider.</p>
            </motion.div>
            {/* Floating confetti emojis */}
            {['🎉', '✨', '🌟', '⭐', '🎊'].map((emoji, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1, y: 0, x: 0 }}
                animate={{
                  opacity: 0,
                  y: -200 - i * 40,
                  x: (i - 2) * 80,
                  rotate: (i - 2) * 120,
                }}
                transition={{ duration: 1.5 + i * 0.2, ease: 'easeOut' }}
                className="fixed top-1/2 left-1/2 text-2xl pointer-events-none"
                style={{ zIndex: 51 }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`max-w-3xl mx-auto px-4 md:px-8 py-6 space-y-6 scroll-smooth bg-gradient-to-b ${partBgGradient[partLetter] || partBgGradient.A} min-h-screen`}>
        {/* Back button and Bookmark */}
        <AnimatedSection>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('toc')}
              className="text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-[0.97]"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Table des matières
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleBookmark}
              className={`${bookmarked ? 'text-amber-500' : 'text-muted-foreground'} transition-all duration-200 active:scale-[0.97]`}
            >
              {bookmarked ? <BookmarkCheck className="h-4 w-4 mr-1" /> : <Bookmark className="h-4 w-4 mr-1" />}
              {bookmarked ? 'Favoris' : 'Ajouter aux favoris'}
            </Button>
          </div>
        </AnimatedSection>

        {/* Chapter header */}
        <AnimatedSection className="text-center space-y-2">
          <Badge variant="outline" className="text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 mb-2">
            Chapitre {chapter.number}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {chapter.title}
          </h1>
          <p className="text-lg text-muted-foreground">{chapter.subtitle}</p>
          {/* Reading time badge */}
          <div className="flex justify-center mt-1">
            <Badge
              variant="outline"
              className="text-[11px] border-amber-300/60 dark:border-amber-700/40 bg-amber-50/60 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 gap-1"
            >
              <Clock className="h-3 w-3" />
              {getChapterReadingTime(chapter)} min de lecture
            </Badge>
          </div>
        </AnimatedSection>

        {/* Mini TOC in chapter */}
        {sectionsList.length > 3 && (
          <AnimatedSection>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {sectionsList.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 px-2.5 py-1 text-[10px] text-stone-600 dark:text-stone-400 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 dark:hover:border-amber-700 dark:hover:bg-amber-950/30 dark:hover:text-amber-300"
                >
                  {section.label}
                </button>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Bismillah header */}
        <AnimatedSection>
          <div className="rounded-xl border-2 border-amber-200/60 dark:border-amber-700/40 bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-amber-950/30 px-6 py-5 text-center relative overflow-hidden shadow-[inset_0_0_30px_rgba(217,169,99,0.08)] dark:shadow-[inset_0_0_30px_rgba(217,169,99,0.05)]">
            {/* Decorative corner accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-300/40 dark:border-amber-600/30 rounded-tl-sm" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-300/40 dark:border-amber-600/30 rounded-tr-sm" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-300/40 dark:border-amber-600/30 rounded-bl-sm" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-300/40 dark:border-amber-600/30 rounded-br-sm" />
            <p
              dir="rtl"
              lang="ar"
              className="arabic-verse text-2xl md:text-3xl text-amber-800 dark:text-amber-200 mb-2 relative z-10"
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <p className="text-sm italic text-amber-700/70 dark:text-amber-300/60 relative z-10">
              Au nom de Dieu, le Tout-Miséricordieux, le Très-Miséricordieux
            </p>
          </div>
        </AnimatedSection>

        {/* Decorative divider */}
        <DecorativeDivider />

        {/* Verse display */}
        {chapter.arabicVerse && (
          <AnimatedSection id="section-verse">
            <VerseDisplay
              arabicVerse={chapter.arabicVerse}
              translation={chapter.translation}
              translationSource={chapter.translationSource}
              chapterTitle={`${chapter.number} — ${chapter.title}`}
            />
          </AnimatedSection>
        )}

        {/* Word analysis table */}
        {chapter.wordAnalysis.length > 0 && (
          <AnimatedSection id="section-words">
            <DecorativeDivider />
            <SectionHeader part={partLetter} icon={<Sparkles className="h-4 w-4" />}>
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300/80">Analyse des mots</h2>
            </SectionHeader>
            <WordAnalysisTable words={chapter.wordAnalysis} />
          </AnimatedSection>
        )}

        {/* Comparison table */}
        {chapter.comparisonTable && (
          <AnimatedSection id="section-comparison">
            <DecorativeDivider />
            <SectionHeader part={partLetter} icon={<Eye className="h-4 w-4" />}>
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300/80">Tableau comparatif</h2>
            </SectionHeader>
            <ComparisonTableBlock
              headers={chapter.comparisonTable.headers}
              rows={chapter.comparisonTable.rows}
            />
          </AnimatedSection>
        )}

        {/* Coherence points */}
        {chapter.coherencePoints && chapter.coherencePoints.length > 0 && (
          <AnimatedSection id="section-coherence">
            <DecorativeDivider />
            <SectionHeader part={partLetter} icon={<Lightbulb className="h-4 w-4" />}>
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300/80">Cohérence</h2>
            </SectionHeader>
            <CoherencePoints points={chapter.coherencePoints} />
          </AnimatedSection>
        )}

        {/* Callout blocks */}
        {chapter.callouts && chapter.callouts.length > 0 && (
          <AnimatedSection className="space-y-3" id="section-callouts">
            <DecorativeDivider />
            {chapter.callouts.map((callout, i) => (
              <CalloutBlock
                key={i}
                type={callout.type}
                title={callout.title}
                content={callout.content}
              />
            ))}
          </AnimatedSection>
        )}

        {/* Bullet points */}
        {chapter.bulletPoints && chapter.bulletPoints.length > 0 && (
          <AnimatedSection id="section-bullets">
            <DecorativeDivider />
            <SectionHeader part={partLetter} icon={<Sparkles className="h-4 w-4" />}>
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300/80">Points clés</h2>
            </SectionHeader>
            <BulletPointsList points={chapter.bulletPoints} />
          </AnimatedSection>
        )}

        {/* Treasures list */}
        {chapter.treasuresList && chapter.treasuresList.length > 0 && (
          <AnimatedSection id="section-treasures">
            <DecorativeDivider />
            <SectionHeader part={partLetter} icon={<Gem className="h-4 w-4" />}>
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300/80">Trésors</h2>
            </SectionHeader>
            <TreasuresList treasures={chapter.treasuresList} />
          </AnimatedSection>
        )}

        {/* Metaphor table */}
        {chapter.metaphorTable && chapter.metaphorTable.length > 0 && (
          <AnimatedSection id="section-metaphors">
            <DecorativeDivider />
            <SectionHeader part={partLetter} icon={<Eye className="h-4 w-4" />}>
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300/80">Métaphores</h2>
            </SectionHeader>
            <MetaphorTable metaphors={chapter.metaphorTable} />
          </AnimatedSection>
        )}

        {/* Mirror questions */}
        {chapter.mirrorQuestions.length > 0 && (
          <AnimatedSection id="section-mirror">
            <DecorativeDivider />
            <SectionHeader part={partLetter} icon={<Lightbulb className="h-4 w-4" />}>
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300/80">Questions miroir</h2>
            </SectionHeader>
            <MirrorQuestionsTable questions={chapter.mirrorQuestions} />
          </AnimatedSection>
        )}

        {/* Munajat section */}
        {chapter.munajatPrompts.length > 0 && (
          <AnimatedSection id="section-munajat">
            <DecorativeDivider />
            <SectionHeader part={partLetter} icon={<BookOpen className="h-4 w-4" />}>
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300/80">Munajat — Méditation intime</h2>
            </SectionHeader>
            <MunajatSection
              chapterId={chapterId}
              prompts={chapter.munajatPrompts}
            />
          </AnimatedSection>
        )}

        {/* Timer section */}
        {chapter.timerMinutes > 0 && (
          <AnimatedSection id="section-timer">
            <DecorativeDivider />
            <SectionHeader part={partLetter} icon={<Clock className="h-4 w-4" />}>
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300/80">Méditation silencieuse</h2>
            </SectionHeader>
            <TimerSection
              chapterId={chapterId}
              minutes={chapter.timerMinutes}
            />
          </AnimatedSection>
        )}

        {/* Exercise section */}
        {chapter.exercises.length > 0 && (
          <AnimatedSection id="section-exercises">
            <DecorativeDivider />
            <SectionHeader part={partLetter} icon={<Lightbulb className="h-4 w-4" />}>
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300/80">Exercices</h2>
            </SectionHeader>
            <ExerciseSection
              chapterId={chapterId}
              exercises={chapter.exercises}
            />
          </AnimatedSection>
        )}

        {/* Extra sections (B3-B10) */}
        {chapter.extraSections && chapter.extraSections.length > 0 && (
          <AnimatedSection id="section-extra">
            <DecorativeDivider />
            <SectionHeader part={partLetter} icon={<BookOpen className="h-4 w-4" />}>
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300/80">Sections supplémentaires</h2>
            </SectionHeader>
            <ExtraSections
              chapterId={chapterId}
              sections={chapter.extraSections}
            />
          </AnimatedSection>
        )}

        {/* Quotes */}
        {chapter.quotes && chapter.quotes.length > 0 && (
          <AnimatedSection className="space-y-3" id="section-quotes">
            <DecorativeDivider />
            {chapter.quotes.map((quote, i) => (
              <QuoteBlock
                key={i}
                text={quote.text}
                source={quote.source}
              />
            ))}
          </AnimatedSection>
        )}

        {/* Decorative end divider */}
        <DecorativeDivider />

        {/* Chapter Notes Summary */}
        <AnimatedSection>
          <ChapterNotesSummary chapterId={chapterId} />
        </AnimatedSection>

        {/* Chapter navigation with titles */}
        <AnimatedSection className="pt-4 border-t border-stone-200/60 dark:border-stone-700/30">
          <div className="flex items-stretch justify-between gap-3">
            {prevChapter ? (
              <button
                onClick={() => navigate('chapter', prevChapter.id)}
                className="group flex items-center gap-3 rounded-xl border border-stone-200/80 dark:border-stone-700/40 bg-stone-50/50 dark:bg-stone-800/30 px-4 py-3 text-left transition-all hover:border-amber-300/60 hover:bg-amber-50/50 dark:hover:border-amber-700/40 dark:hover:bg-amber-950/20 hover:shadow-sm flex-1 max-w-[48%]"
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Précédent</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-300/50 dark:border-amber-700/40 text-amber-700 dark:text-amber-400 shrink-0">
                      {prevChapter.number}
                    </Badge>
                    <span className="text-sm font-medium truncate group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                      {prevChapter.title}
                    </span>
                  </div>
                </div>
              </button>
            ) : (
              <div className="flex-1 max-w-[48%]" />
            )}

            {nextChapter ? (
              <button
                onClick={() => navigate('chapter', nextChapter.id)}
                className="group flex items-center gap-3 rounded-xl border border-stone-200/80 dark:border-stone-700/40 bg-stone-50/50 dark:bg-stone-800/30 px-4 py-3 text-right transition-all hover:border-amber-300/60 hover:bg-amber-50/50 dark:hover:border-amber-700/40 dark:hover:bg-amber-950/20 hover:shadow-sm flex-1 max-w-[48%]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Suivant</p>
                  <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                    <span className="text-sm font-medium truncate group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                      {nextChapter.title}
                    </span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-300/50 dark:border-amber-700/40 text-amber-700 dark:text-amber-400 shrink-0">
                      {nextChapter.number}
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors shrink-0" />
              </button>
            ) : (
              <div className="flex-1 max-w-[48%]" />
            )}
          </div>
        </AnimatedSection>

        {/* Complete chapter section — enhanced with celebration */}
        <AnimatedSection
          className={`rounded-xl border p-4 transition-all duration-500 shadow-sm ${
            completed
              ? 'border-emerald-300/50 bg-emerald-50/50 dark:border-emerald-700/30 dark:bg-emerald-950/20'
              : 'border-stone-200 dark:border-stone-700/30 bg-white dark:bg-stone-900/30'
          }`}
        >
          <div className="flex items-center gap-3">
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
              {completed && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            </label>
          </div>
          {completed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <CompletionSummaryCard
                chapterId={chapterId}
                chapterTitle={chapter.title}
                chapterNumber={chapter.number}
              />
            </motion.div>
          )}
        </AnimatedSection>

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

        {/* Chapter scroll progress indicator */}
        <ChapterProgressIndicator />
      </div>
    </>
  )
}
