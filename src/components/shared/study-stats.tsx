'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters } from '@/data/chapters'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Clock,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Flame,
  Trophy,
  StickyNote,
  PenLine,
  ChevronDown,
  ChevronUp,
  BarChart3,
  BookOpen,
  Timer,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' },
  }),
}

// French day names
const FRENCH_DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export function StudyStats() {
  const completedChapters = useAppStore((s) => s.completedChapters)
  const notes = useAppStore((s) => s.notes)
  const journalEntries = useAppStore((s) => s.journalEntries)
  const currentStreak = useAppStore((s) => s.currentStreak)
  const longestStreak = useAppStore((s) => s.longestStreak)

  const [showDetailed, setShowDetailed] = useState(false)

  const stats = useMemo(() => {
    // Total reading time (estimated based on completed chapters' timerMinutes)
    const totalReadingMinutes = completedChapters.reduce((acc, cc) => {
      const chapter = allChapters.find((c) => c.id === cc.chapterId)
      return acc + (chapter?.timerMinutes || 0)
    }, 0)

    // Chapters completed this week
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() + 1) // Monday
    startOfWeek.setHours(0, 0, 0, 0)
    const chaptersThisWeek = completedChapters.filter(
      (cc) => cc.completedAt >= startOfWeek.getTime()
    ).length

    // Average completion rate (chapters per week since first activity)
    let avgPerWeek = 0
    if (completedChapters.length > 0) {
      const firstCompleted = Math.min(...completedChapters.map((cc) => cc.completedAt))
      const daysSinceFirst = Math.max(1, (Date.now() - firstCompleted) / (1000 * 60 * 60 * 24))
      const weeksSinceFirst = daysSinceFirst / 7
      avgPerWeek = weeksSinceFirst > 0 ? completedChapters.length / weeksSinceFirst : 0
    }

    // Most productive day (day of week with most completions)
    const dayCounts = new Array(7).fill(0)
    completedChapters.forEach((cc) => {
      const day = new Date(cc.completedAt).getDay()
      dayCounts[day]++
    })
    const maxDayIdx = dayCounts.indexOf(Math.max(...dayCounts))
    const mostProductiveDay = completedChapters.length > 0 ? FRENCH_DAYS[maxDayIdx] : '—'

    // Notes written (count of saved notes)
    const notesCount = notes.length

    // Journal entries count
    const journalCount = journalEntries.length

    // Most read part (A/B/C)
    const partCounts: Record<string, number> = { A: 0, B: 0, C: 0 }
    completedChapters.forEach((cc) => {
      const letter = cc.chapterId.charAt(0).toUpperCase()
      if (letter === 'A' || letter === 'B' || letter === 'C') {
        partCounts[letter]++
      }
    })
    const mostReadPart = Object.entries(partCounts).sort((a, b) => b[1] - a[1])[0]

    // Longest reading session (consecutive chapters completed in one day)
    let longestSession = 0
    if (completedChapters.length > 0) {
      const byDate = new Map<string, number>()
      completedChapters.forEach((cc) => {
        const dateKey = new Date(cc.completedAt).toISOString().split('T')[0]
        byDate.set(dateKey, (byDate.get(dateKey) || 0) + 1)
      })
      longestSession = Math.max(...byDate.values())
    }

    // Chapters completed per part (for bar chart)
    const totalPartA = allChapters.filter((c) => c.id.startsWith('a')).length
    const totalPartB = allChapters.filter((c) => c.id.startsWith('b')).length
    const totalPartC = allChapters.filter((c) => c.id.startsWith('c')).length
    const completedPartA = partCounts['A']
    const completedPartB = partCounts['B']
    const completedPartC = partCounts['C']

    return {
      totalReadingMinutes,
      chaptersThisWeek,
      avgPerWeek,
      mostProductiveDay,
      notesCount,
      journalCount,
      mostReadPart,
      longestSession,
      totalPartA,
      totalPartB,
      totalPartC,
      completedPartA,
      completedPartB,
      completedPartC,
    }
  }, [completedChapters, notes, journalEntries])

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h > 0) return `${h}h${m > 0 ? ` ${m}min` : ''}`
    return `${m} min`
  }

  const statCards = [
    {
      icon: Clock,
      label: 'Temps de lecture',
      value: formatTime(stats.totalReadingMinutes),
      gradient: 'from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent',
      iconColor: 'text-amber-500',
      border: 'border-amber-200/50 dark:border-amber-800/30',
    },
    {
      icon: CheckCircle2,
      label: 'Complétés cette semaine',
      value: `${stats.chaptersThisWeek}`,
      gradient: 'from-emerald-50/80 to-emerald-100/30 dark:from-emerald-950/30 dark:to-transparent',
      iconColor: 'text-emerald-500',
      border: 'border-emerald-200/50 dark:border-emerald-800/30',
    },
    {
      icon: TrendingUp,
      label: 'Moyenne / semaine',
      value: stats.avgPerWeek > 0 ? stats.avgPerWeek.toFixed(1) : '—',
      gradient: 'from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent',
      iconColor: 'text-amber-600',
      border: 'border-amber-200/50 dark:border-amber-800/30',
    },
    {
      icon: Calendar,
      label: 'Jour le plus productif',
      value: stats.mostProductiveDay,
      gradient: 'from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent',
      iconColor: 'text-amber-500',
      border: 'border-amber-200/50 dark:border-amber-800/30',
    },
    {
      icon: Flame,
      label: 'Série actuelle',
      value: `${currentStreak} jour${currentStreak > 1 ? 's' : ''}`,
      gradient: 'from-orange-50/80 to-amber-100/30 dark:from-orange-950/30 dark:to-transparent',
      iconColor: 'text-orange-500',
      border: 'border-orange-200/50 dark:border-orange-800/30',
    },
    {
      icon: Trophy,
      label: 'Meilleure série',
      value: `${longestStreak} jour${longestStreak > 1 ? 's' : ''}`,
      gradient: 'from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent',
      iconColor: 'text-amber-500',
      border: 'border-amber-200/50 dark:border-amber-800/30',
    },
    {
      icon: StickyNote,
      label: 'Notes écrites',
      value: `${stats.notesCount}`,
      gradient: 'from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent',
      iconColor: 'text-amber-600',
      border: 'border-amber-200/50 dark:border-amber-800/30',
    },
    {
      icon: PenLine,
      label: 'Entrées de journal',
      value: `${stats.journalCount}`,
      gradient: 'from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent',
      iconColor: 'text-amber-500',
      border: 'border-amber-200/50 dark:border-amber-800/30',
    },
  ]

  const partLabels: Record<string, string> = {
    A: 'Partie A — Al-Fatiha',
    B: 'Partie B — Trésors du Coran',
    C: 'Partie C — Niveaux de lecture',
  }

  const partColors: Record<string, { bar: string; bg: string; text: string }> = {
    A: { bar: 'bg-amber-500 dark:bg-amber-400', bg: 'bg-amber-100/60 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
    B: { bar: 'bg-emerald-500 dark:bg-emerald-400', bg: 'bg-emerald-100/60 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
    C: { bar: 'bg-violet-500 dark:bg-violet-400', bg: 'bg-violet-100/60 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300' },
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.label}
            custom={idx}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Card className={`${card.border} overflow-hidden relative`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} pointer-events-none`} />
              <CardContent className="pt-4 pb-4 text-center relative">
                <card.icon className={`h-5 w-5 mx-auto mb-1.5 ${card.iconColor}`} />
                <p className="text-lg font-bold">{card.value}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed statistics expandable section */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetailed(!showDetailed)}
          className="w-full justify-between text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20"
        >
          <span className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistiques détaillées
          </span>
          {showDetailed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        <AnimatePresence>
          {showDetailed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-3">
                {/* Detailed stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Total reading time */}
                  <Card className="border-amber-200/50 dark:border-amber-800/30 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent pointer-events-none" />
                    <CardContent className="pt-4 pb-4 relative flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/40 shrink-0">
                        <Timer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{formatTime(stats.totalReadingMinutes)}</p>
                        <p className="text-[11px] text-muted-foreground">Temps total de lecture estimé</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Average speed */}
                  <Card className="border-amber-200/50 dark:border-amber-800/30 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-emerald-100/30 dark:from-emerald-950/30 dark:to-transparent pointer-events-none" />
                    <CardContent className="pt-4 pb-4 relative flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 shrink-0">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {stats.avgPerWeek > 0 ? stats.avgPerWeek.toFixed(1) : '0'} chapitres
                        </p>
                        <p className="text-[11px] text-muted-foreground">Vitesse moyenne par semaine</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Most read part */}
                  <Card className="border-amber-200/50 dark:border-amber-800/30 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 to-violet-100/30 dark:from-violet-950/30 dark:to-transparent pointer-events-none" />
                    <CardContent className="pt-4 pb-4 relative flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/40 shrink-0">
                        <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {stats.mostReadPart ? `Partie ${stats.mostReadPart[0]} (${stats.mostReadPart[1]} chap.)` : '—'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">Partie la plus lue</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Longest session */}
                  <Card className="border-amber-200/50 dark:border-amber-800/30 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-orange-100/30 dark:from-orange-950/30 dark:to-transparent pointer-events-none" />
                    <CardContent className="pt-4 pb-4 relative flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/40 shrink-0">
                        <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {stats.longestSession} chapitre{stats.longestSession > 1 ? 's' : ''}
                        </p>
                        <p className="text-[11px] text-muted-foreground">Plus longue session (un jour)</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bar chart: chapters completed per part */}
                <Card className="border-amber-200/50 dark:border-amber-800/30 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 to-transparent dark:from-amber-950/10 dark:to-transparent pointer-events-none" />
                  <CardContent className="pt-4 pb-4 relative space-y-4">
                    <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Chapitres complétés par partie
                    </h3>

                    {(['A', 'B', 'C'] as const).map((part) => {
                      const completed = part === 'A' ? stats.completedPartA : part === 'B' ? stats.completedPartB : stats.completedPartC
                      const total = part === 'A' ? stats.totalPartA : part === 'B' ? stats.totalPartB : stats.totalPartC
                      const pct = total > 0 ? Math.round((completed / total) * 100) : 0
                      const colors = partColors[part]

                      return (
                        <div key={part} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-medium ${colors.text}`}>{partLabels[part]}</span>
                            <span className="text-muted-foreground">{completed}/{total} · {pct}%</span>
                          </div>
                          <div className={`h-4 rounded-full ${colors.bg} overflow-hidden`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                              className={`h-full rounded-full ${colors.bar}`}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Reading pace indicator */}
                <Card className="border-amber-200/50 dark:border-amber-800/30 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-50/60 to-amber-100/20 dark:from-amber-950/20 dark:to-transparent pointer-events-none" />
                  <CardContent className="pt-4 pb-4 relative">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/40 shrink-0 mt-0.5">
                        <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                          Vous lisez {stats.avgPerWeek > 0 ? stats.avgPerWeek.toFixed(1) : '0'} chapitres par semaine en moyenne
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stats.avgPerWeek >= 3
                            ? 'Excellent rythme ! Vous progressez rapidement dans votre méditation.'
                            : stats.avgPerWeek >= 1.5
                              ? 'Bon rythme ! Continuez à pace régulière pour une méditation approfondie.'
                              : stats.avgPerWeek > 0
                                ? 'Prenez votre temps — la qualité prime sur la quantité dans le tadabbur.'
                                : 'Commencez votre voyage de méditation en complétant votre premier chapitre !'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
