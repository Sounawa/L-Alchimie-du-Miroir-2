'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters } from '@/data/chapters'
import { Card, CardContent } from '@/components/ui/card'
import {
  CheckCircle2,
  Clock,
  Flame,
  Trophy,
  StickyNote,
  PenLine,
  Timer,
  BarChart3,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' },
  }),
}

// French day abbreviations for weekly chart
const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function ReadingStatsPanel() {
  const completedChapters = useAppStore((s) => s.completedChapters)
  const notes = useAppStore((s) => s.notes)
  const journalEntries = useAppStore((s) => s.journalEntries)
  const currentStreak = useAppStore((s) => s.currentStreak)
  const longestStreak = useAppStore((s) => s.longestStreak)
  const totalMeditationMinutes = useAppStore((s) => s.totalMeditationMinutes)

  const stats = useMemo(() => {
    // Total chapters completed
    const chaptersCompleted = completedChapters.length

    // Estimated total meditation time from completed chapters
    const estimatedMinutes = completedChapters.reduce((acc, cc) => {
      const chapter = allChapters.find((c) => c.id === cc.chapterId)
      return acc + (chapter?.timerMinutes || 0)
    }, 0)

    // Use the greater of tracked time or estimated time
    const totalMeditTime = Math.max(totalMeditationMinutes, estimatedMinutes)

    // Notes written
    const notesCount = notes.length

    // Journal entries
    const journalCount = journalEntries.length

    // Weekly activity (last 7 days)
    const now = new Date()
    const weekActivity: number[] = []
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now)
      day.setDate(now.getDate() - i)
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime()
      const dayEnd = dayStart + 24 * 60 * 60 * 1000

      const count = completedChapters.filter((cc) => {
        return cc.completedAt >= dayStart && cc.completedAt < dayEnd
      }).length

      // Also count notes and journal entries for that day
      const noteCount = notes.filter((n) => {
        return n.updatedAt >= dayStart && n.updatedAt < dayEnd
      }).length

      const journalCountDay = journalEntries.filter((j) => {
        return j.createdAt >= dayStart && j.createdAt < dayEnd
      }).length

      weekActivity.push(count + noteCount + journalCountDay)
    }

    return {
      chaptersCompleted,
      totalMeditTime,
      notesCount,
      journalCount,
      weekActivity,
    }
  }, [completedChapters, notes, journalEntries, totalMeditationMinutes])

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h > 0) return `${h}h${m > 0 ? ` ${m}min` : ''}`
    return `${m} min`
  }

  const maxWeekActivity = Math.max(...stats.weekActivity, 1)

  const statCards = [
    {
      icon: CheckCircle2,
      label: 'Chapitres complétés',
      value: `${stats.chaptersCompleted}/17`,
      gradient: 'from-emerald-50/80 to-emerald-100/30 dark:from-emerald-950/30 dark:to-transparent',
      iconColor: 'text-emerald-500',
      border: 'border-emerald-200/50 dark:border-emerald-800/30',
    },
    {
      icon: Timer,
      label: 'Temps de méditation',
      value: formatTime(stats.totalMeditTime),
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
      iconColor: 'text-amber-600',
      border: 'border-amber-200/50 dark:border-amber-800/30',
    },
    {
      icon: StickyNote,
      label: 'Notes écrites',
      value: `${stats.notesCount}`,
      gradient: 'from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent',
      iconColor: 'text-amber-500',
      border: 'border-amber-200/50 dark:border-amber-800/30',
    },
    {
      icon: PenLine,
      label: 'Entrées de journal',
      value: `${stats.journalCount}`,
      gradient: 'from-emerald-50/80 to-amber-100/30 dark:from-emerald-950/30 dark:to-transparent',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-200/50 dark:border-emerald-800/30',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Stat cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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

      {/* Weekly Activity CSS-only Bar Chart */}
      <motion.div
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-amber-200/50 dark:border-amber-800/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 to-transparent dark:from-amber-950/10 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-4 pb-4 relative">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                Activité des 7 derniers jours
              </h3>
            </div>

            <div className="flex items-end gap-2 h-24">
              {stats.weekActivity.map((count, idx) => {
                const barHeight = maxWeekActivity > 0
                  ? Math.max((count / maxWeekActivity) * 100, 4) // minimum 4% height for visibility
                  : 4
                const isToday = idx === 6

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    {/* Bar */}
                    <div className="w-full relative flex items-end justify-center" style={{ height: '72px' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${barHeight}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05, ease: 'easeOut' }}
                        className={`w-full max-w-[28px] rounded-t-md ${
                          isToday
                            ? 'bg-gradient-to-t from-amber-500 to-amber-400 dark:from-amber-600 dark:to-amber-500'
                            : count > 0
                              ? 'bg-gradient-to-t from-amber-300 to-amber-200 dark:from-amber-700 dark:to-amber-600'
                              : 'bg-stone-200 dark:bg-stone-700'
                        }`}
                        style={{ minHeight: '3px' }}
                      />
                    </div>
                    {/* Day label */}
                    <span className={`text-[9px] ${isToday ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-400 dark:text-stone-500'}`}>
                      {WEEK_DAYS[idx]}
                    </span>
                    {/* Activity count */}
                    {count > 0 && (
                      <span className="text-[8px] text-amber-600 dark:text-amber-400 font-medium">
                        {count}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
