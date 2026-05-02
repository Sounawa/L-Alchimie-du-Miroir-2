'use client'

import { useMemo } from 'react'
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
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
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

      {/* Progress Ring / Bar */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-amber-200/50 dark:border-amber-800/30 overflow-hidden relative">
          {/* Subtle gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-6 relative">
            <div className="flex flex-col items-center gap-4">
              {/* Animated progress circle */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-stone-200 dark:text-muted/20"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - progressPercent / 100)}`}
                    className="text-amber-500 dark:text-amber-400 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {progressPercent}%
                  </span>
                  <span className="text-xs text-muted-foreground">complété</span>
                </div>
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

      {/* Statistics Cards with gradient backgrounds */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-emerald-200/50 dark:border-emerald-800/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-emerald-100/30 dark:from-emerald-950/30 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-4 pb-4 text-center relative">
            <CheckCircle2 className="h-5 w-5 mx-auto mb-1.5 text-emerald-500" />
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-[11px] text-muted-foreground">Complétés</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200/50 dark:border-amber-800/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-4 pb-4 text-center relative">
            <Circle className="h-5 w-5 mx-auto mb-1.5 text-amber-500" />
            <p className="text-2xl font-bold">{remainingCount}</p>
            <p className="text-[11px] text-muted-foreground">Restants</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200/50 dark:border-amber-800/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-4 pb-4 text-center relative">
            <Clock className="h-5 w-5 mx-auto mb-1.5 text-amber-500" />
            <p className="text-2xl font-bold">{formatTime(totalMinutes)}</p>
            <p className="text-[11px] text-muted-foreground">Méditation</p>
          </CardContent>
        </Card>
        {/* Streak card */}
        <Card className="border-orange-200/50 dark:border-orange-800/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-amber-100/30 dark:from-orange-950/30 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-4 pb-4 text-center relative">
            <Flame className="h-5 w-5 mx-auto mb-1.5 text-orange-500" />
            <p className="text-2xl font-bold">{currentStreak}j</p>
            <p className="text-[11px] text-muted-foreground">🔥 Série{longestStreak > currentStreak && <span className="ml-1 text-orange-400">({longestStreak}j max)</span>}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chapter List */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card>
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
