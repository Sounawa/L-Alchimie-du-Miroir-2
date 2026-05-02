'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Clock, Bell, BellRing } from 'lucide-react'
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

// Approximate prayer times
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
  isApproaching: boolean
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

    if (currentMinutes < start) {
      nextIdx = i
      break
    }

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
    minutesUntilNext = (24 * 60 - currentMinutes) + nextStart
  }

  // Approaching = within 15 minutes of next prayer
  const isApproaching = minutesUntilNext <= 15 && minutesUntilNext > 0

  return { current, next: nextPrayer, minutesUntilNext, isApproaching }
}

function formatCountdown(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}min` : `${h}h`
  }
  return `${minutes}min`
}

function formatTime12(hour: number, min: number): string {
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  const ampm = hour >= 12 ? 'PM' : 'AM'
  return `${h}:${String(min).padStart(2, '0')} ${ampm}`
}

export function PrayerTimesBadge() {
  const [showTooltip, setShowTooltip] = useState(false)
  const [prayerInfo, setPrayerInfo] = useState(() => getCurrentPrayerInfo())

  // Update prayer info every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setPrayerInfo(getCurrentPrayerInfo())
    }, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const isNight = prayerInfo.current?.icon === 'moon' || (!prayerInfo.current && (new Date().getHours() >= 21 || new Date().getHours() < 6))

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full border transition-all duration-200 ${
              prayerInfo.isApproaching
                ? 'border-amber-400 dark:border-amber-500 bg-gradient-to-r from-amber-100/80 to-amber-50/60 dark:from-amber-900/30 dark:to-amber-950/20 shadow-sm shadow-amber-200/50 dark:shadow-amber-800/20'
                : 'border-violet-200/50 dark:border-violet-700/30 bg-gradient-to-r from-violet-50/60 to-amber-50/60 dark:from-violet-950/20 dark:to-amber-950/20 hover:from-violet-100/60 hover:to-amber-100/60 dark:hover:from-violet-900/25 dark:hover:to-amber-900/25'
            }`}
            aria-label="Horaires de prière"
          >
            {/* Approaching notification pulse */}
            {prayerInfo.isApproaching && (
              <motion.span
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <BellRing className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              </motion.span>
            )}
            {!prayerInfo.isApproaching && (
              isNight ? (
                <Moon className="h-3 w-3 text-violet-500 dark:text-violet-400" />
              ) : (
                <Sun className="h-3 w-3 text-amber-500 dark:text-amber-400" />
              )
            )}

            {/* Current prayer name */}
            {prayerInfo.current && (
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 hidden sm:inline">
                {prayerInfo.current.name}
              </span>
            )}

            {/* Next prayer countdown */}
            {!prayerInfo.current && (
              <>
                <span className="text-[10px] font-medium text-violet-700 dark:text-violet-300 hidden sm:inline">
                  {prayerInfo.next.name}
                </span>
                <span className={`text-[9px] hidden sm:inline ${
                  prayerInfo.isApproaching
                    ? 'text-amber-600 dark:text-amber-400 font-semibold'
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  dans {formatCountdown(prayerInfo.minutesUntilNext)}
                </span>
              </>
            )}

            {/* Active indicator */}
            {prayerInfo.current && (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[9px] text-emerald-600 dark:text-emerald-400 hidden sm:inline"
              >
                ●
              </motion.span>
            )}

            {/* Approaching badge */}
            {prayerInfo.isApproaching && (
              <span className="text-[9px] font-semibold text-amber-700 dark:text-amber-300 hidden sm:inline">
                bientôt
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end" className="w-64 p-0 overflow-hidden">
          <div className="p-3 space-y-2">
            {/* Header with current/next status */}
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                Horaires de prière
              </span>
            </div>

            {/* Approaching notification */}
            <AnimatePresence>
              {prayerInfo.isApproaching && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30 px-2.5 py-2 flex items-center gap-2"
                >
                  <Bell className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                      {prayerInfo.next.name} approche
                    </p>
                    <p className="text-[9px] text-amber-600/70 dark:text-amber-400/70">
                      dans {formatCountdown(prayerInfo.minutesUntilNext)}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prayer times list */}
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
                    {/* Status dot */}
                    {isCurrent ? (
                      <motion.span
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
                      />
                    ) : isNext ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-300 dark:bg-stone-600" />
                    )}

                    {/* Name */}
                    <span className={isCurrent ? 'text-emerald-700 dark:text-emerald-300' : 'text-stone-700 dark:text-stone-300'}>
                      {prayer.name}
                    </span>

                    {/* Arabic name */}
                    <span className="arabic-verse text-[10px] text-stone-400 dark:text-stone-500" lang="ar" dir="rtl">
                      {prayer.nameAr}
                    </span>

                    {/* Icon */}
                    {prayer.icon === 'sun' ? (
                      <Sun className="h-3 w-3 text-amber-400 dark:text-amber-500" />
                    ) : (
                      <Moon className="h-3 w-3 text-violet-400 dark:text-violet-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status label */}
                    {isCurrent && (
                      <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400">
                        En cours
                      </span>
                    )}
                    {isNext && !isCurrent && (
                      <span className="text-[9px] text-amber-600 dark:text-amber-400">
                        dans {formatCountdown(prayerInfo.minutesUntilNext)}
                      </span>
                    )}
                    <span className="tabular-nums text-stone-500 dark:text-stone-400">
                      {formatTime12(prayer.startHour, prayer.startMin)}
                    </span>
                  </div>
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
