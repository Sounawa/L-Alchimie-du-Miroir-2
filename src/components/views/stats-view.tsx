'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters, siteContent } from '@/data/chapters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  BarChart3,
  Clock,
  Flame,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Activity,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
}

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function getWeekNumber(dateStr: string): number {
  const date = new Date(dateStr)
  const start = new Date(date.getFullYear(), 0, 1)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1
}

export function StatsView() {
  const navigate = useAppStore((s) => s.navigate)
  const completedChapters = useAppStore((s) => s.completedChapters)
  const totalMeditationMinutes = useAppStore((s) => s.totalMeditationMinutes)
  const currentStreak = useAppStore((s) => s.currentStreak)
  const longestStreak = useAppStore((s) => s.longestStreak)
  const activityLog = useAppStore((s) => s.activityLog)
  const getProgressPercentage = useAppStore((s) => s.getProgressPercentage)

  const progressPercent = getProgressPercentage()

  // Total meditation time from completed chapters
  const chapterMeditationTime = useMemo(() => {
    let total = 0
    for (const cc of completedChapters) {
      const chapter = allChapters.find((c) => c.id === cc.chapterId)
      if (chapter) total += chapter.timerMinutes
    }
    return total
  }, [completedChapters])

  const totalMinutes = totalMeditationMinutes + chapterMeditationTime

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h > 0) return `${h}h${m > 0 ? ` ${m}min` : ''}`
    return `${m} min`
  }

  // Average session time estimate
  const avgSessionTime = useMemo(() => {
    if (completedChapters.length === 0) return 0
    return Math.round(totalMinutes / completedChapters.length)
  }, [totalMinutes, completedChapters])

  // Chapters completion by part
  const partStats = useMemo(() => {
    const parts = siteContent.parts
    return parts.map((part) => {
      const total = part.chapters.length
      const completed = part.chapters.filter((ch) =>
        completedChapters.some((cc) => cc.chapterId === ch.id)
      ).length
      return {
        letter: part.letter,
        title: part.title,
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    })
  }, [completedChapters])

  // Most-read chapters (completed ones, sorted by most recent)
  const mostReadChapters = useMemo(() => {
    return completedChapters
      .slice()
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 5)
      .map((cc) => {
        const chapter = allChapters.find((c) => c.id === cc.chapterId)
        return chapter
          ? { id: chapter.id, number: chapter.number, title: chapter.title, completedAt: cc.completedAt }
          : null
      })
      .filter(Boolean)
  }, [completedChapters])

  // Activity heatmap for last 16 weeks (112 days)
  const heatmapData = useMemo(() => {
    const today = new Date()
    const days: { date: string; active: boolean; isToday: boolean }[] = []

    for (let i = 111; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      days.push({
        date: dateStr,
        active: activityLog.includes(dateStr),
        isToday: i === 0,
      })
    }
    return days
  }, [activityLog])

  // Weekly activity chart (last 8 weeks)
  const weeklyActivity = useMemo(() => {
    const weeks: { week: number; count: number; label: string }[] = []
    const today = new Date()

    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - (w * 7 + weekStart.getDay()))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)

      let count = 0
      for (const dateStr of activityLog) {
        const d = new Date(dateStr)
        if (d >= weekStart && d <= weekEnd) count++
      }

      weeks.push({
        week: getWeekNumber(weekStart.toISOString()),
        count,
        label: `S${8 - w}`,
      })
    }
    return weeks
  }, [activityLog])

  // Monthly activity (last 6 months)
  const monthlyActivity = useMemo(() => {
    const months: { month: string; count: number }[] = []
    const today = new Date()

    for (let m = 5; m >= 0; m--) {
      const date = new Date(today.getFullYear(), today.getMonth() - m, 1)
      const monthStr = date.toLocaleDateString('fr-FR', { month: 'short' })
      const year = date.getFullYear()
      const month = date.getMonth()

      let count = 0
      for (const dateStr of activityLog) {
        const d = new Date(dateStr)
        if (d.getFullYear() === year && d.getMonth() === month) count++
      }

      months.push({ month: monthStr, count })
    }
    return months
  }, [activityLog])

  const maxWeeklyCount = Math.max(...weeklyActivity.map((w) => w.count), 1)
  const maxMonthlyCount = Math.max(...monthlyActivity.map((m) => m.count), 1)

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
          <ArrowLeft className="h-4 w-4 mr-1" />
          Table des matières
        </Button>
      </motion.div>

      {/* Title */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30">
            <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Statistiques de lecture</h1>
        <p className="text-muted-foreground">
          Visualisez votre parcours de méditation coranique
        </p>
      </motion.div>

      {/* Summary stats cards */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-amber-200/50 dark:border-amber-800/30 shadow-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-4 pb-4 text-center relative">
            <Clock className="h-5 w-5 mx-auto mb-1.5 text-amber-500" />
            <p className="text-2xl font-bold">{formatTime(totalMinutes)}</p>
            <p className="text-[11px] text-muted-foreground">Méditation</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200/50 dark:border-emerald-800/30 shadow-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-emerald-100/30 dark:from-emerald-950/30 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-4 pb-4 text-center relative">
            <Flame className="h-5 w-5 mx-auto mb-1.5 text-orange-500" />
            <p className="text-2xl font-bold">{currentStreak}j</p>
            <p className="text-[11px] text-muted-foreground">Série actuelle</p>
          </CardContent>
        </Card>
        <Card className="border-violet-200/50 dark:border-violet-800/30 shadow-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 to-violet-100/30 dark:from-violet-950/30 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-4 pb-4 text-center relative">
            <TrendingUp className="h-5 w-5 mx-auto mb-1.5 text-violet-500" />
            <p className="text-2xl font-bold">{avgSessionTime > 0 ? `${avgSessionTime}min` : '—'}</p>
            <p className="text-[11px] text-muted-foreground">Session moy.</p>
          </CardContent>
        </Card>
        <Card className="border-rose-200/50 dark:border-rose-800/30 shadow-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 to-rose-100/30 dark:from-rose-950/30 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-4 pb-4 text-center relative">
            <Award className="h-5 w-5 mx-auto mb-1.5 text-rose-500" />
            <p className="text-2xl font-bold">{progressPercent}%</p>
            <p className="text-[11px] text-muted-foreground">Complétion</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity heatmap calendar */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-amber-200/50 dark:border-amber-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Calendrier d&apos;activité
            </CardTitle>
            <p className="text-xs text-muted-foreground">16 dernières semaines</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {/* Day labels */}
              <div className="flex gap-0.5 pl-8 mb-1">
                {['L', '', 'M', '', 'M', '', 'D'].map((d, i) => (
                  <div key={i} className="w-3 h-3 flex items-center justify-center text-[8px] text-muted-foreground/50">
                    {d}
                  </div>
                ))}
              </div>
              {/* Heatmap grid: 16 weeks x 7 days */}
              <div className="flex gap-0.5 flex-wrap">
                {(() => {
                  // Arrange in 7-row x 16-col grid
                  const rows: React.ReactNode[] = []
                  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                    const cells: React.ReactNode[] = []
                    for (let week = 0; week < 16; week++) {
                      const dayIndex = week * 7 + dayOfWeek
                      if (dayIndex < heatmapData.length) {
                        const day = heatmapData[dayIndex]
                        cells.push(
                          <div
                            key={`${week}-${dayOfWeek}`}
                            className={`w-3 h-3 rounded-sm transition-all ${
                              day.isToday
                                ? 'ring-1 ring-amber-500'
                                : ''
                            } ${
                              day.active
                                ? 'bg-amber-500 dark:bg-amber-400'
                                : 'bg-stone-200 dark:bg-stone-700/50'
                            }`}
                            title={`${day.date}${day.active ? ' — Actif' : ''}`}
                          />
                        )
                      } else {
                        cells.push(<div key={`${week}-${dayOfWeek}`} className="w-3 h-3" />)
                      }
                    }
                    rows.push(
                      <div key={dayOfWeek} className="flex gap-0.5 items-center">
                        <div className="w-6 text-right text-[8px] text-muted-foreground/50 pr-1">
                          {['L', 'M', 'M', 'J', 'V', 'S', 'D'][dayOfWeek]}
                        </div>
                        {cells}
                      </div>
                    )
                  }
                  return rows
                })()}
              </div>
              {/* Legend */}
              <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[9px] text-muted-foreground">Moins</span>
                <div className="w-3 h-3 rounded-sm bg-stone-200 dark:bg-stone-700/50" />
                <div className="w-3 h-3 rounded-sm bg-amber-300 dark:bg-amber-600" />
                <div className="w-3 h-3 rounded-sm bg-amber-500 dark:bg-amber-400" />
                <span className="text-[9px] text-muted-foreground">Plus</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chapters completion by part */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-amber-200/50 dark:border-amber-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Complétion par partie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {partStats.map((part) => {
              const partColorMap: Record<string, string> = {
                A: 'from-amber-500 to-amber-400',
                B: 'from-emerald-500 to-emerald-400',
                C: 'from-violet-500 to-violet-400',
              }
              const partBgMap: Record<string, string> = {
                A: 'bg-amber-100 dark:bg-amber-950/20',
                B: 'bg-emerald-100 dark:bg-emerald-950/20',
                C: 'bg-violet-100 dark:bg-violet-950/20',
              }
              const partTextMap: Record<string, string> = {
                A: 'text-amber-700 dark:text-amber-300',
                B: 'text-emerald-700 dark:text-emerald-300',
                C: 'text-violet-700 dark:text-violet-300',
              }

              return (
                <div key={part.letter} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-[10px] border-0 ${partBgMap[part.letter]} ${partTextMap[part.letter]}`}>
                        Partie {part.letter}
                      </Badge>
                      <span className="text-sm font-medium">{part.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {part.completed}/{part.total} chapitres
                    </span>
                  </div>
                  <div className={`h-3 rounded-full ${partBgMap[part.letter]} overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${part.percentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                      className={`h-full rounded-full bg-gradient-to-r ${partColorMap[part.letter]}`}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly progress chart */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-amber-200/50 dark:border-amber-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Activité hebdomadaire
            </CardTitle>
            <p className="text-xs text-muted-foreground">8 dernières semaines</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {weeklyActivity.map((week) => (
                <div key={week.week} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-muted-foreground tabular-nums">
                    {week.count > 0 ? week.count : ''}
                  </span>
                  <div className="w-full bg-stone-100 dark:bg-stone-800/50 rounded-t-sm relative" style={{ height: '100px' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((week.count / maxWeeklyCount) * 100, week.count > 0 ? 8 : 0)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      className="absolute bottom-0 left-0 right-0 rounded-t-sm bg-gradient-to-t from-amber-500 to-amber-400 dark:from-amber-600 dark:to-amber-400"
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground">{week.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly progress chart */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-amber-200/50 dark:border-amber-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Activité mensuelle
            </CardTitle>
            <p className="text-xs text-muted-foreground">6 derniers mois</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-32">
              {monthlyActivity.map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-muted-foreground tabular-nums">
                    {month.count > 0 ? `${month.count}j` : ''}
                  </span>
                  <div className="w-full bg-stone-100 dark:bg-stone-800/50 rounded-t-sm relative" style={{ height: '100px' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((month.count / maxMonthlyCount) * 100, month.count > 0 ? 8 : 0)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      className="absolute bottom-0 left-0 right-0 rounded-t-sm bg-gradient-to-t from-emerald-500 to-emerald-400 dark:from-emerald-600 dark:to-emerald-400"
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground capitalize">{month.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Most-read chapters */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-amber-200/50 dark:border-amber-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Chapitres les plus lus
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mostReadChapters.length > 0 ? (
              <div className="space-y-2">
                {mostReadChapters.map((ch, idx) => {
                  if (!ch) return null
                  return (
                    <div
                      key={ch.id}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-amber-50/50 dark:hover:bg-amber-950/10 transition-colors"
                    >
                      <span className="text-sm font-bold text-amber-500 dark:text-amber-400 w-6 text-center">
                        {idx + 1}
                      </span>
                      <Badge variant="outline" className="text-[10px] text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700">
                        {ch.number}
                      </Badge>
                      <span className="text-sm flex-1 truncate">{ch.title}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(ch.completedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm">Aucun chapitre complété pour le moment</p>
                <p className="text-muted-foreground/60 text-xs mt-1">Commencez à lire pour voir vos statistiques</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick stats summary */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-amber-200/30 dark:border-amber-800/20">
          <CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{completedChapters.length}</p>
                <p className="text-xs text-muted-foreground">Chapitres complétés</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{longestStreak}j</p>
                <p className="text-xs text-muted-foreground">Meilleure série</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{activityLog.length}j</p>
                <p className="text-xs text-muted-foreground">Jours actifs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{17 - completedChapters.length}</p>
                <p className="text-xs text-muted-foreground">Chapitres restants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
