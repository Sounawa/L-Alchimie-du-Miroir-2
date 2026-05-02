'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters } from '@/data/chapters'
import { Card, CardContent } from '@/components/ui/card'
import {
  Clock,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Flame,
  Trophy,
  StickyNote,
  PenLine,
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

    return {
      totalReadingMinutes,
      chaptersThisWeek,
      avgPerWeek,
      mostProductiveDay,
      notesCount,
      journalCount,
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

  return (
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
  )
}
