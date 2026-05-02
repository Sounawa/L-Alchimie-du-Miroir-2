'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Moon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Hijri month names in Arabic
const HIJRI_MONTHS_AR = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الثانية',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
]

// Hijri month names in French
const HIJRI_MONTHS_FR = [
  'Mouharram',
  'Safar',
  'Rabi\u02BF al-Awwal',
  'Rabi\u02BF ath-Thani',
  'Joumada al-Oula',
  'Joumada ath-Thania',
  'Rajab',
  'Cha\u02BFbane',
  'Ramadan',
  'Chawwal',
  'Dhou al-Qi\u02BFda',
  'Dhou al-Hijja',
]

// Important Islamic events keyed by month number (1-indexed)
const ISLAMIC_EVENTS: Record<number, { name: string; nameAr: string; description: string }> = {
  1: { name: 'Nouvel an hégirien', nameAr: 'رأس السنة الهجرية', description: 'Début de l\'année musulmane' },
  7: { name: 'Isra et Mi\'raj', nameAr: 'الإسراء والمعراج', description: 'Le voyage nocturne du Prophète' },
  8: { name: 'Sha\'ban bénit', nameAr: 'شعبان', description: 'Mois de préparation avant le Ramadan' },
  9: { name: 'Ramadan', nameAr: 'رمضان', description: 'Mois du jeûne sacré' },
  10: { name: 'Aïd al-Fitr', nameAr: 'عيد الفطر', description: 'Fête de la rupture du jeûne' },
  12: { name: 'Aïd al-Adha', nameAr: 'عيد الأضحى', description: 'Fête du sacrifice' },
}

/**
 * Approximate Gregorian-to-Hijri conversion.
 *
 * Algorithm:
 * - Epoch: July 16, 622 CE (Julian) = 1 Muharram 1 AH
 * - The Hijri year is ~354.36667 days (lunar year)
 * - We calculate days since the epoch and convert
 */
function gregorianToHijri(date: Date): { day: number; month: number; year: number } {
  // Julian Day Number for the given Gregorian date
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12)
  const y = date.getFullYear() + 4800 - a
  const m = (date.getMonth() + 1) + 12 * a - 3
  const jdn = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045

  // Julian Day Number for the Hijri epoch: July 16, 622 CE (Julian) = 1948439.5
  // We use the integer part for simplicity
  const epochJDN = 1948440

  // Days since epoch
  const daysSinceEpoch = jdn - epochJDN

  // Average lunar year length
  const lunarYearDays = 354.36667
  const lunarMonthDays = 29.53059

  // Calculate Hijri year
  let hijriYear = Math.floor(daysSinceEpoch / lunarYearDays) + 1

  // Calculate remaining days in the year
  let daysInYear = daysSinceEpoch - Math.floor((hijriYear - 1) * lunarYearDays)

  // Calculate month
  let hijriMonth = Math.floor(daysInYear / lunarMonthDays) + 1
  if (hijriMonth > 12) hijriMonth = 12

  // Calculate day
  let daysInMonth = daysInYear - Math.floor((hijriMonth - 1) * lunarMonthDays)
  let hijriDay = Math.floor(daysInMonth) + 1

  // Adjust bounds
  if (hijriDay < 1) hijriDay = 1
  if (hijriDay > 30) hijriDay = 30

  return { day: hijriDay, month: hijriMonth, year: hijriYear }
}

export function HijriDateDisplay() {
  const [isExpanded, setIsExpanded] = useState(false)

  const hijriDate = useMemo(() => {
    const now = new Date()
    const hijri = gregorianToHijri(now)

    const monthAr = HIJRI_MONTHS_AR[hijri.month - 1] || ''
    const monthFr = HIJRI_MONTHS_FR[hijri.month - 1] || ''
    const event = ISLAMIC_EVENTS[hijri.month]

    // Gregorian date for tooltip
    const gregorianStr = now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return {
      ...hijri,
      monthAr,
      monthFr,
      event,
      gregorianStr,
    }
  }, [])

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip open={isExpanded} onOpenChange={setIsExpanded}>
        <TooltipTrigger asChild>
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onClick={() => setIsExpanded((prev) => !prev)}
            className="w-full rounded-lg border border-amber-200/60 dark:border-amber-800/30 bg-gradient-to-br from-amber-50/80 via-amber-50/40 to-stone-50/60 dark:from-amber-950/20 dark:via-stone-900/30 dark:to-stone-900/20 p-3 text-left hover:border-amber-300/80 dark:hover:border-amber-700/40 transition-all duration-300 group cursor-pointer"
            aria-label={`Date hégirien : ${hijriDate.day} ${hijriDate.monthFr} ${hijriDate.year} AH`}
          >
            {/* Header row */}
            <div className="flex items-center gap-2 mb-1.5">
              <Moon className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
              <span className="text-[10px] uppercase tracking-wider text-amber-700/70 dark:text-amber-400/60 font-semibold">
                Date hégirien
              </span>
            </div>

            {/* Arabic month + day + year */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-foreground tabular-nums">
                {hijriDate.day}
              </span>
              <span
                className="text-sm font-medium text-amber-800 dark:text-amber-300 arabic-verse"
                lang="ar"
                dir="rtl"
              >
                {hijriDate.monthAr}
              </span>
              <span className="text-sm font-bold text-foreground tabular-nums">
                {hijriDate.year}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">AH</span>
            </div>

            {/* French month name */}
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {hijriDate.monthFr}
            </p>

            {/* Islamic event for current month */}
            {hijriDate.event && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-2 pt-2 border-t border-amber-200/40 dark:border-amber-800/20"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">✦</span>
                  <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                    {hijriDate.event.name}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 ml-4">
                  {hijriDate.event.description}
                </p>
              </motion.div>
            )}

            {/* Click hint */}
            <p className="text-[9px] text-muted-foreground/50 mt-1.5 text-center group-hover:text-muted-foreground/70 transition-colors">
              Appuyez pour plus de détails
            </p>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs p-3" sideOffset={4}>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Date hégirien complète
            </p>
            <p className="text-xs">
              {hijriDate.day} {hijriDate.monthAr} {hijriDate.year} AH
            </p>
            <p className="text-xs text-muted-foreground">
              {hijriDate.day} {hijriDate.monthFr} {hijriDate.year} AH
            </p>
            <div className="border-t pt-1.5 mt-1.5">
              <p className="text-[10px] text-muted-foreground">
                Grégorien : {hijriDate.gregorianStr}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
