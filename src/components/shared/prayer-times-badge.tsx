'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Clock } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface PrayerTime {
  id: string
  name: string
  nameAr: string
  startHour: number
  startMin: number
  endHour: number
  endMin: number
  icon: 'sun' | 'moon'
}

// Approximate prayer times (can be refined with API later)
const PRAYER_TIMES: PrayerTime[] = [
  { id: 'fajr', name: 'Fajr', nameAr: 'الفجر', startHour: 5, startMin: 0, endHour: 6, endMin: 30, icon: 'moon' },
  { id: 'dhuhr', name: 'Dhuhr', nameAr: 'الظهر', startHour: 12, startMin: 30, endHour: 14, endMin: 0, icon: 'sun' },
  { id: 'asr', name: 'Asr', nameAr: 'العصر', startHour: 15, startMin: 0, endHour: 16, endMin: 30, icon: 'sun' },
  { id: 'maghrib', name: 'Maghrib', nameAr: 'المغرب', startHour: 17, startMin: 30, endHour: 21, endMin: 0, icon: 'moon' },
  { id: 'isha', name: 'Isha', nameAr: 'العشاء', startHour: 21, startMin: 0, endHour: 23, endMin: 59, icon: 'moon' },
]

function timeToMinutes(h: number, m: number): number {
  return h * 60 + m
}

function getCurrentPrayerInfo(): {
  current: PrayerTime | null
  next: PrayerTime
  minutesUntilNext: number
} {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  let current: PrayerTime | null = null
  let nextIdx = 0

  for (let i = 0; i < PRAYER_TIMES.length; i++) {
    const prayer = PRAYER_TIMES[i]
    const start = timeToMinutes(prayer.startHour, prayer.startMin)
    const end = timeToMinutes(prayer.endHour, prayer.endMin)

    if (currentMinutes >= start && currentMinutes <= end) {
      current = prayer
      nextIdx = (i + 1) % PRAYER_TIMES.length
      break
    }

    // Check if we're before this prayer time
    if (currentMinutes < start) {
      nextIdx = i
      break
    }

    // After last prayer, next is Fajr tomorrow
    if (i === PRAYER_TIMES.length - 1) {
      nextIdx = 0
    }
  }

  const nextPrayer = PRAYER_TIMES[nextIdx]
  const nextStart = timeToMinutes(nextPrayer.startHour, nextPrayer.startMin)

  let minutesUntilNext: number
  if (currentMinutes <= nextStart) {
    minutesUntilNext = nextStart - currentMinutes
  } else {
    // Wraps around midnight
    minutesUntilNext = (24 * 60 - currentMinutes) + nextStart
  }

  return { current, next: nextPrayer, minutesUntilNext }
}

function formatCountdown(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}min` : `${h}h`
  }
  return `${minutes}min`
}

export function PrayerTimesBadge() {
  const [showTooltip, setShowTooltip] = useState(false)

  const prayerInfo = useMemo(() => getCurrentPrayerInfo(), [])

  const isNight = prayerInfo.current?.icon === 'moon' || (!prayerInfo.current && (new Date().getHours() >= 21 || new Date().getHours() < 6))

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-violet-200/50 dark:border-violet-700/30 bg-gradient-to-r from-violet-50/60 to-amber-50/60 dark:from-violet-950/20 dark:to-amber-950/20 hover:from-violet-100/60 hover:to-amber-100/60 dark:hover:from-violet-900/25 dark:hover:to-amber-900/25 transition-all duration-200"
            aria-label="Horaires de prière"
          >
            {isNight ? (
              <Moon className="h-3 w-3 text-violet-500 dark:text-violet-400" />
            ) : (
              <Sun className="h-3 w-3 text-amber-500 dark:text-amber-400" />
            )}
            <span className="text-[10px] font-medium text-violet-700 dark:text-violet-300 hidden sm:inline">
              {prayerInfo.current ? prayerInfo.current.name : prayerInfo.next.name}
            </span>
            {!prayerInfo.current && (
              <span className="text-[9px] text-amber-600 dark:text-amber-400 hidden sm:inline">
                dans {formatCountdown(prayerInfo.minutesUntilNext)}
              </span>
            )}
            {prayerInfo.current && (
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                ●
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end" className="w-56 p-0 overflow-hidden">
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                Horaires de prière
              </span>
            </div>
            {PRAYER_TIMES.map((prayer) => {
              const isCurrent = prayerInfo.current?.id === prayer.id
              const isNext = prayerInfo.next.id === prayer.id
              return (
                <div
                  key={prayer.id}
                  className={`flex items-center justify-between text-xs px-2 py-1.5 rounded-md transition-colors ${
                    isCurrent
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 font-semibold'
                      : isNext
                        ? 'bg-amber-50 dark:bg-amber-950/20'
                        : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                    )}
                    {isNext && !isCurrent && (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                    )}
                    {!isCurrent && !isNext && (
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-300 dark:bg-stone-600" />
                    )}
                    <span className={isCurrent ? 'text-emerald-700 dark:text-emerald-300' : 'text-stone-700 dark:text-stone-300'}>
                      {prayer.name}
                    </span>
                    <span className="arabic-verse text-[10px] text-stone-400 dark:text-stone-500" lang="ar" dir="rtl">
                      {prayer.nameAr}
                    </span>
                  </div>
                  <span className="tabular-nums text-stone-500 dark:text-stone-400">
                    {String(prayer.startHour).padStart(2, '0')}:{String(prayer.startMin).padStart(2, '0')}
                  </span>
                </div>
              )
            })}
            <div className="pt-1 border-t border-stone-200/60 dark:border-stone-700/30">
              <p className="text-[9px] text-stone-400 dark:text-stone-500 text-center">
                Horaires approximatifs · {prayerInfo.current
                  ? `Prière actuelle : ${prayerInfo.current.name}`
                  : `Prochaine : ${prayerInfo.next.name} dans ${formatCountdown(prayerInfo.minutesUntilNext)}`
                }
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
