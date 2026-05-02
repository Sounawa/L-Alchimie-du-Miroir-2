'use client'

import { useMemo, useState } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, ChevronLeft, ChevronRight, Flame, ArrowLeft } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
}

// French month names
const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

// French day abbreviations
const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  // Convert Sunday=0 to Monday-first: Sun=6, Mon=0, Tue=1...
  return day === 0 ? 6 : day - 1
}

export function StreakCalendarView() {
  const navigate = useAppStore((s) => s.navigate)
  const activityLog = useAppStore((s) => s.activityLog)
  const currentStreak = useAppStore((s) => s.currentStreak)
  const longestStreak = useAppStore((s) => s.longestStreak)

  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const daysInMonth = useMemo(() => getDaysInMonth(viewYear, viewMonth), [viewYear, viewMonth])
  const firstDayOfWeek = useMemo(() => getFirstDayOfWeek(viewYear, viewMonth), [viewYear, viewMonth])

  // Convert activityLog to a Set for O(1) lookup
  const activityDates = useMemo(() => new Set(activityLog), [activityLog])

  // Count active days in the current view month
  const activeDaysInMonth = useMemo(() => {
    let count = 0
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      if (activityDates.has(dateStr)) count++
    }
    return count
  }, [viewYear, viewMonth, daysInMonth, activityDates])

  // Today's date string
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth()

  // Build calendar grid
  const calendarCells: Array<{ day: number | null; dateStr: string; isActive: boolean; isToday: boolean }> = []
  // Empty cells for days before the 1st
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push({ day: null, dateStr: '', isActive: false, isToday: false })
  }
  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    calendarCells.push({
      day: d,
      dateStr,
      isActive: activityDates.has(dateStr),
      isToday: dateStr === todayStr,
    })
  }

  let sectionIndex = 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-stone-50 to-stone-100/50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Back button */}
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('progress')}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Ma progression
          </Button>
        </motion.div>

        {/* Title */}
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calendar className="h-7 w-7 text-amber-500" />
            <h1 className="text-3xl font-bold tracking-tight">Calendrier de série</h1>
          </div>
          <p className="text-muted-foreground">
            Visualisez vos jours de lecture active
          </p>
        </motion.div>

        {/* Streak Stats */}
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-orange-200/50 dark:border-orange-800/30 shadow-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-amber-100/30 dark:from-orange-950/30 dark:to-transparent pointer-events-none" />
              <CardContent className="pt-4 pb-4 text-center relative">
                <Flame className="h-5 w-5 mx-auto mb-1.5 text-orange-500" />
                <p className="text-2xl font-bold">{currentStreak}j</p>
                <p className="text-[11px] text-muted-foreground">Série actuelle</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200/50 dark:border-amber-800/30 shadow-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-transparent pointer-events-none" />
              <CardContent className="pt-4 pb-4 text-center relative">
                <Flame className="h-5 w-5 mx-auto mb-1.5 text-amber-500" />
                <p className="text-2xl font-bold">{longestStreak}j</p>
                <p className="text-[11px] text-muted-foreground">Meilleure série</p>
              </CardContent>
            </Card>
            <Card className="border-emerald-200/50 dark:border-emerald-800/30 shadow-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-emerald-100/30 dark:from-emerald-950/30 dark:to-transparent pointer-events-none" />
              <CardContent className="pt-4 pb-4 text-center relative">
                <Calendar className="h-5 w-5 mx-auto mb-1.5 text-emerald-500" />
                <p className="text-2xl font-bold">{activeDaysInMonth}</p>
                <p className="text-[11px] text-muted-foreground">Jours ce mois</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Calendar */}
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-amber-200/40 dark:border-amber-800/20 shadow-sm overflow-hidden">
            <CardContent className="pt-5 pb-5">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={handlePrevMonth} className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <h2 className="text-lg font-semibold">{monthNames[viewMonth]} {viewYear}</h2>
                  {isCurrentMonth && (
                    <Badge variant="outline" className="text-[9px] mt-1 border-amber-300/50 dark:border-amber-700/40 text-amber-600 dark:text-amber-400">
                      Mois en cours
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-[10px] font-medium text-muted-foreground/70 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((cell, idx) => {
                  if (cell.day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square" />
                  }
                  return (
                    <motion.div
                      key={cell.dateStr}
                      className={`
                        aspect-square flex items-center justify-center rounded-lg text-sm relative
                        transition-all duration-200
                        ${cell.isActive
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium card-hover-lift'
                          : cell.isToday
                            ? 'bg-amber-100/60 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-medium border border-amber-300/40 dark:border-amber-700/30'
                            : 'text-muted-foreground/50 hover:bg-muted/30'
                        }
                      `}
                      whileHover={cell.isActive ? { scale: 1.1 } : {}}
                      title={cell.isActive ? `Lu le ${cell.day} ${monthNames[viewMonth]}` : cell.isToday ? "Aujourd'hui" : ''}
                    >
                      {cell.day}
                      {cell.isActive && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 streak-dot-pop" />
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">Jour actif</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded bg-amber-100/60 dark:bg-amber-900/20 border border-amber-300/40 dark:border-amber-700/30" />
                  <span className="text-[10px] text-muted-foreground">Aujourd&apos;hui</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded bg-transparent" />
                  <span className="text-[10px] text-muted-foreground">Inactif</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Motivational message */}
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-amber-200/30 dark:border-amber-800/20 bg-gradient-to-r from-amber-50/60 via-stone-50/40 to-amber-50/60 dark:from-amber-950/15 dark:via-stone-900/10 dark:to-amber-950/15 shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-sm italic text-amber-700 dark:text-amber-300/80">
                {currentStreak === 0
                  ? "Commencez votre série aujourd'hui en lisant un chapitre ! 🌱"
                  : currentStreak < 3
                    ? `Continuez ! ${currentStreak} jour${currentStreak > 1 ? 's' : ''} consécutif${currentStreak > 1 ? 's' : ''}, c'est un bon début ! 🌿`
                    : currentStreak < 7
                      ? `Série de ${currentStreak} jours ! La constance est la clé du succès. 🌳`
                      : `Masha'Allah ! ${currentStreak} jours de lecture continue ! ✨`
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
