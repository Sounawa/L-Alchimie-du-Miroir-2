'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters } from '@/data/chapters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Download,
  RotateCcw,
  Bookmark,
  Sparkles,
  Heart,
  Flame,
  Trophy,
  ArrowRight,
  BarChart3,
  Award,
  Star,
} from 'lucide-react'
import { StudyStats } from '@/components/shared/study-stats'
import { ReadingStatsPanel } from '@/components/shared/reading-stats-panel'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
}

// Milestone data for celebrations
const milestones = [
  { pct: 25, emoji: '🌱', label: 'Le cheminement commence' },
  { pct: 50, emoji: '🌿', label: 'À mi-chemin' },
  { pct: 75, emoji: '🌳', label: 'La lumière est proche' },
  { pct: 100, emoji: '✨', label: 'Masha\'Allah !' },
]

// Animated number component
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayed, setDisplayed] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasAnimated])

  useEffect(() => {
    if (!hasAnimated) return
    const duration = 800
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [hasAnimated, value])

  return <span ref={ref} className="count-animate">{displayed}{suffix}</span>
}

function getMotivationalMessage(pct: number): { text: string; icon: React.ReactNode } {
  if (pct === 0) return { text: 'Votre voyage spirituel commence ici. Chaque pas compte.', icon: <Sparkles className="size-5 text-amber-500" /> }
  if (pct < 15) return { text: 'Les premiers pas sont les plus courageux. Continuez !', icon: <Heart className="size-5 text-rose-500" /> }
  if (pct < 30) return { text: 'L\'élan est lancé. Votre cœur s\'ouvre à la méditation.', icon: <Flame className="size-5 text-orange-500" /> }
  if (pct < 50) return { text: 'Vous êtes sur la voie. La moitié du chemin vous attend.', icon: <BookOpen className="size-5 text-amber-600" /> }
  if (pct < 70) return { text: 'La lumière grandit en vous. Persévérez !', icon: <Sparkles className="size-5 text-amber-500" /> }
  if (pct < 90) return { text: 'Le sommet est proche. Votre dévotion est admirable.', icon: <Flame className="size-5 text-amber-600" /> }
  if (pct < 100) return { text: 'Presque au but ! La dernière étape est la plus belle.', icon: <Trophy className="size-5 text-amber-500" /> }
  return { text: 'Masha\'Allah ! Vous avez complété le voyage. Que la lumière continue de vous guider.', icon: <Trophy className="size-5 text-amber-500" /> }
}

export function ProgressView() {
  const navigate = useAppStore((s) => s.navigate)
  const completedChapters = useAppStore((s) => s.completedChapters)
  const bookmarks = useAppStore((s) => s.bookmarks)
  const getProgressPercentage = useAppStore((s) => s.getProgressPercentage)
  const isBookmarked = useAppStore((s) => s.isBookmarked)
  const exportNotes = useAppStore((s) => s.exportNotes)
  const toggleChapterComplete = useAppStore((s) => s.toggleChapterComplete)
  const currentStreak = useAppStore((s) => s.currentStreak)
  const longestStreak = useAppStore((s) => s.longestStreak)
  const currentChapterId = useAppStore((s) => s.currentChapterId)

  const progressPercent = getProgressPercentage()
  const completedCount = completedChapters.length
  const totalCount = 17 // A1-A7 + B1-B10
  const remainingCount = totalCount - completedCount

  // Total meditation time (sum of timerMinutes for completed chapters)
  const totalMinutes = useMemo(() => {
    let total = 0
    for (const cc of completedChapters) {
      const chapter = allChapters.find((c) => c.id === cc.chapterId)
      if (chapter) {
        total += chapter.timerMinutes
      }
    }
    return total
  }, [completedChapters])

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h > 0) return `${h}h${m > 0 ? ` ${m}min` : ''}`
    return `${m} min`
  }

  const handleExportNotes = () => {
    const text = exportNotes()
    navigator.clipboard.writeText(text).then(
      () => {
        // Success - could show toast
      },
      () => {
        // Error - could show toast
      }
    )
  }

  const handleResetProgress = () => {
    // Uncheck all chapters
    for (const cc of completedChapters) {
      toggleChapterComplete(cc.chapterId)
    }
  }

  // Get completion date for a chapter
  const getCompletionDate = (chapterId: string): string | null => {
    const cc = completedChapters.find((c) => c.chapterId === chapterId)
    if (!cc) return null
    return new Date(cc.completedAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const motivation = getMotivationalMessage(progressPercent)

  // Find next incomplete chapter for CTA
  const nextIncompleteChapter = useMemo(() => {
    return allChapters.find((c) => !completedChapters.some((cc) => cc.chapterId === c.id))
  }, [completedChapters])

  let sectionIndex = 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('toc')}
          className="text-muted-foreground hover:text-foreground"
        >
          ← Table des matières
        </Button>
      </motion.div>

      {/* Title */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Ma Progression</h1>
        <p className="text-muted-foreground">
          Suivez votre cheminement spirituel à travers les chapitres
        </p>
      </motion.div>

      {/* Timeline / Roadmap */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-stone-200 shadow-sm overflow-hidden relative">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
              {allChapters.map((ch, idx) => {
                const isComplete = completedChapters.some((c) => c.chapterId === ch.id)
                const isCurrent = currentChapterId === ch.id
                const isPartC = ch.part === 'C'
                const cLevelMatch = ch.number.match(/C(\d)/)
                const cLevel = cLevelMatch ? parseInt(cLevelMatch[1]) : 0

                return (
                  <div key={ch.id} className="flex items-center shrink-0">
                    <button
                      onClick={() => navigate('chapter', ch.id)}
                      className="flex flex-col items-center gap-0.5"
                      title={`${ch.number} — ${ch.title}`}
                    >
                      {isPartC && cLevel > 0 ? (
                        /* Staircase metaphor for Partie C — ascending diamond shape */
                        <div
                          className={`flex items-center justify-center transition-all duration-300 ${
                            isComplete
                              ? 'w-7 h-7 rounded-sm rotate-45 border-2 border-violet-400 bg-violet-400 dark:border-violet-500 dark:bg-violet-500'
                              : isCurrent
                                ? 'w-7 h-7 rounded-sm rotate-45 border-2 border-violet-500 bg-violet-100 dark:border-violet-400 dark:bg-violet-900/40 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                                : 'w-6 h-6 rounded-sm rotate-45 border border-stone-300 bg-stone-50 dark:border-stone-600 dark:bg-stone-800'
                          }`}
                          style={{ marginTop: `${(7 - cLevel) * 1.5}px` }}
                        >
                          <div className="rotate-[-45deg]">
                            {isComplete ? (
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            ) : isCurrent ? (
                              <span className="text-[8px] font-bold text-violet-700 dark:text-violet-200">{cLevel}</span>
                            ) : (
                              <span className="text-[7px] text-stone-400 dark:text-stone-500">{cLevel}</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Standard circle for Part A & B */
                        <div
                          className={`flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                            isComplete
                              ? 'h-7 w-7 border-emerald-400 bg-emerald-400 dark:border-emerald-500 dark:bg-emerald-500'
                              : isCurrent
                                ? 'h-7 w-7 border-amber-500 bg-amber-100 dark:border-amber-400 dark:bg-amber-950/40'
                                : 'h-6 w-6 border-stone-300 bg-stone-50 dark:border-stone-600 dark:bg-stone-800'
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          ) : isCurrent ? (
                            <div className="h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                          ) : null}
                        </div>
                      )}
                      <span className={`text-[9px] leading-tight ${
                        isCurrent
                          ? isPartC
                            ? 'text-violet-600 dark:text-violet-400 font-bold'
                            : 'text-amber-600 dark:text-amber-400 font-bold'
                          : 'text-stone-400 dark:text-stone-500'
                      }`}>
                        {ch.number}
                      </span>
                    </button>
                    {idx < allChapters.length - 1 && (
                      <div className={`h-0.5 w-3 ${
                        isComplete && completedChapters.some((c) => c.chapterId === allChapters[idx + 1].id)
                          ? isPartC
                            ? 'bg-violet-400 dark:bg-violet-500'
                            : 'bg-emerald-400 dark:bg-emerald-500'
                          : 'bg-stone-200 dark:bg-stone-700'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full border border-emerald-400 bg-emerald-400" />
                <span className="text-[9px] text-stone-500">Complété</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm rotate-45 border border-violet-400 bg-violet-100" />
                <span className="text-[9px] text-stone-500">Partie C (ascension)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full border border-stone-300 bg-stone-50" />
                <span className="text-[9px] text-stone-500">À lire</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Continue Reading CTA */}
      {nextIncompleteChapter && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <Button
            onClick={() => navigate('chapter', nextIncompleteChapter.id)}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-amber-50 shadow-lg shadow-amber-600/20 hover:from-amber-500 hover:to-amber-400 gap-2"
            size="lg"
          >
            <BookOpen className="h-5 w-5" />
            Continuer la lecture — {nextIncompleteChapter.number}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {/* Progress Ring / Bar */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-amber-200/50 dark:border-amber-800/30 shadow-sm overflow-hidden relative">
          {/* Subtle gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-6 relative">
            <div className="flex flex-col items-center gap-4">
              {/* Animated progress circle with particle trail */}
              <div className={`relative w-44 h-44 ${progressPercent > 0 ? 'progress-circle-glow' : ''}`}>
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-stone-200 dark:text-muted/20"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - progressPercent / 100)}`}
                    className="text-amber-500 dark:text-amber-400"
                    style={{
                      transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      animation: progressPercent > 0 ? 'progressStrokeDraw 1.5s cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
                      '--circumference': `${2 * Math.PI * 52}`,
                      '--target-offset': `${2 * Math.PI * 52 * (1 - progressPercent / 100)}`,
                    } as React.CSSProperties}
                  />
                  {/* Particle trail orbiting the progress circle */}
                  {progressPercent > 0 && (
                    <g className="progress-particle">
                      <circle cx="60" cy="60" r="2.5" fill="#f59e0b" opacity="0.8" />
                      <circle cx="60" cy="60" r="1.5" fill="#fbbf24" opacity="0.5" style={{ animationDelay: '0.5s' }} />
                    </g>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    <AnimatedNumber value={progressPercent} suffix="%" />
                  </span>
                  <span className="text-xs text-muted-foreground">complété</span>
                </div>
                {/* Milestone badges */}
                {milestones.map((milestone) => (
                  progressPercent >= milestone.pct && (
                    <div
                      key={milestone.pct}
                      className="milestone-pop absolute"
                      style={{
                        top: milestone.pct === 25 ? '8%' : milestone.pct === 50 ? '8%' : milestone.pct === 75 ? '8%' : '8%',
                        right: milestone.pct === 25 ? '0' : milestone.pct === 50 ? '-4%' : milestone.pct === 75 ? '0' : '-8%',
                      }}
                    >
                      <span className="text-xs" title={milestone.label}>{milestone.emoji}</span>
                    </div>
                  )
                ))}
              </div>
              <Progress value={progressPercent} className="h-2 w-full max-w-sm" />
            </div>

            {/* Motivational message */}
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-amber-50/80 dark:bg-amber-950/20 px-4 py-2.5">
              {motivation.icon}
              <p className="text-sm text-amber-700 dark:text-amber-300/80 italic">
                {motivation.text}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Cards with gradient backgrounds and animated numbers */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-emerald-200/50 dark:border-emerald-800/30 shadow-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-emerald-100/30 dark:from-emerald-950/30 dark:to-transparent pointer-events-none shadow-inner" />
          <CardContent className="pt-4 pb-4 text-center relative">
            <CheckCircle2 className="h-5 w-5 mx-auto mb-1.5 text-emerald-500" />
            <p className="text-2xl font-bold"><AnimatedNumber value={completedCount} /></p>
            <p className="text-[11px] text-muted-foreground">Complétés</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200/50 dark:border-amber-800/30 overflow-hidden relative shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent pointer-events-none shadow-inner" />
          <CardContent className="pt-4 pb-4 text-center relative">
            <Circle className="h-5 w-5 mx-auto mb-1.5 text-amber-500" />
            <p className="text-2xl font-bold"><AnimatedNumber value={remainingCount} /></p>
            <p className="text-[11px] text-muted-foreground">Restants</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200/50 dark:border-amber-800/30 overflow-hidden relative shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent pointer-events-none shadow-inner" />
          <CardContent className="pt-4 pb-4 text-center relative">
            <Clock className="h-5 w-5 mx-auto mb-1.5 text-amber-500" />
            <p className="text-2xl font-bold">{formatTime(totalMinutes)}</p>
            <p className="text-[11px] text-muted-foreground">Méditation</p>
          </CardContent>
        </Card>
        {/* Streak card */}
        <Card className="border-orange-200/50 dark:border-orange-800/30 shadow-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-amber-100/30 dark:from-orange-950/30 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-4 pb-4 text-center relative">
            <Flame className="h-5 w-5 mx-auto mb-1.5 text-orange-500" />
            <p className="text-2xl font-bold"><AnimatedNumber value={currentStreak} suffix="j" /></p>
            <p className="text-[11px] text-muted-foreground">🔥 Série{longestStreak > currentStreak && <span className="ml-1 text-orange-400">({longestStreak}j max)</span>}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Part-level mini progress bars */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-stone-200 shadow-sm">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold">Progression par partie</span>
            </div>
            {[
              { letter: 'A', label: 'Partie A — Al-Fatiha', color: 'bg-amber-500 dark:bg-amber-400', barColor: 'from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-300' },
              { letter: 'B', label: 'Partie B — Trésors du Coran', color: 'bg-emerald-500 dark:bg-emerald-400', barColor: 'from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-300' },
              { letter: 'C', label: 'Partie C — Les Sept Niveaux', color: 'bg-violet-500 dark:bg-violet-400', barColor: 'from-violet-400 to-violet-600 dark:from-violet-500 dark:to-violet-300' },
            ].map((part) => {
              const partChapters = allChapters.filter((c) => c.part === part.letter)
              const completedInPart = partChapters.filter((c) => completedChapters.some((cc) => cc.chapterId === c.id)).length
              const partPct = partChapters.length > 0 ? Math.round((completedInPart / partChapters.length) * 100) : 0
              return (
                <div key={part.letter} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${part.color}`} />
                      <span className="text-xs text-stone-600 dark:text-stone-400">{part.label}</span>
                    </div>
                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-300">{completedInPart}/{partChapters.length} ({partPct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${partPct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${part.barColor}`}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistiques détaillées */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-semibold">Statistiques détaillées</h2>
        </div>
        <StudyStats />
      </motion.div>

      {/* Panneau de statistiques de lecture */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-semibold">Panneau de lecture</h2>
        </div>
        <ReadingStatsPanel />
      </motion.div>

      {/* Chapter List */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="shadow-sm border-stone-200 dark:border-stone-700/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Chapitres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {allChapters.map((chapter) => {
              const isComplete = completedChapters.some((c) => c.chapterId === chapter.id)
              const isBooked = isBookmarked(chapter.id)
              const completionDate = getCompletionDate(chapter.id)

              return (
                <button
                  key={chapter.id}
                  onClick={() => navigate('chapter', chapter.id)}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-amber-50/50 dark:hover:bg-muted/50 text-left group"
                >
                  {/* Status icon */}
                  <span className="shrink-0">
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-stone-300 dark:text-muted-foreground/30" />
                    )}
                  </span>

                  {/* Chapter info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/30 px-1.5 py-0.5 rounded">
                        {chapter.number}
                      </span>
                      <span className={`truncate ${isComplete ? 'line-through opacity-60' : 'font-medium'}`}>
                        {chapter.title}
                      </span>
                    </div>
                    {completionDate && (
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="size-3 text-emerald-400" />
                        Complété le {completionDate}
                      </p>
                    )}
                  </div>

                  {/* Bookmark + time */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {chapter.timerMinutes}min
                    </span>
                    {isBooked && (
                      <Bookmark className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    )}
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Chapter Completion Checklist */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="shadow-sm border-stone-200 dark:border-stone-700/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Liste de complétion
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {allChapters.map((chapter, idx) => {
                const isComplete = completedChapters.some((c) => c.chapterId === chapter.id)
                const completionDate = getCompletionDate(chapter.id)
                const partLetter = chapter.id.charAt(0).toUpperCase()
                const dotColor = partLetter === 'A'
                  ? 'bg-amber-500 dark:bg-amber-400'
                  : partLetter === 'B'
                    ? 'bg-emerald-500 dark:bg-emerald-400'
                    : 'bg-violet-500 dark:bg-violet-400'

                return (
                  <div
                    key={chapter.id}
                    className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-amber-50/40 dark:hover:bg-amber-950/10 ${
                      idx % 2 === 0 ? 'bg-stone-50/50 dark:bg-stone-900/20' : ''
                    }`}
                  >
                    {/* Part color dot */}
                    <span className={`shrink-0 h-2 w-2 rounded-full ${dotColor}`} />

                    {/* Chapter number + title */}
                    <span className="font-medium text-xs text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/30 px-1.5 py-0.5 rounded shrink-0">
                      {chapter.number}
                    </span>
                    <span className={`flex-1 min-w-0 truncate text-xs ${isComplete ? 'line-through opacity-50' : ''}`}>
                      {chapter.title}
                    </span>

                    {/* Completion status */}
                    <span className="shrink-0">
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-stone-300 dark:text-stone-600" />
                      )}
                    </span>

                    {/* Date completed */}
                    {completionDate && (
                      <span className="text-[10px] text-muted-foreground/60 shrink-0 hidden sm:inline">
                        {completionDate}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleExportNotes}
        >
          <Download className="h-4 w-4" />
          Exporter les notes
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 gap-2 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser la progression
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Réinitialiser la progression ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action marquera tous les chapitres comme non complétés. Vos notes personnelles
                ne seront pas supprimées. Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetProgress}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Réinitialiser
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  )
}
