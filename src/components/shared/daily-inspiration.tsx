'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { useAppStore } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'

interface InspirationQuote {
  arabic: string
  french: string
  source: string
}

const inspirations: InspirationQuote[] = [
  {
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    french: 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux.',
    source: 'Sourate Al-Fatiha, 1:1',
  },
  {
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    french: 'Louange à Allah, Seigneur de l\'univers.',
    source: 'Sourate Al-Fatiha, 1:2',
  },
  {
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    french: 'C\'est par le rappel d\'Allah que les cœurs trouvent la paix.',
    source: 'Sourate Ar-Ra\'d, 13:28',
  },
  {
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    french: 'Et quiconque place sa confiance en Allah, Il lui suffit.',
    source: 'Sourate At-Talaq, 65:3',
  },
  {
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    french: 'Certes, avec la difficulté vient la facilité.',
    source: 'Sourate Ash-Sharh, 94:5',
  },
  {
    arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ',
    french: 'Ne vous laissez pas abattre, ne vous affligez pas alors que vous êtes les supérieurs, si vous êtes de vrais croyants.',
    source: 'Sourate Ali \'Imran, 3:139',
  },
  {
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    french: 'Allah n\'impose à aucune âme une charge supérieure à sa capacité.',
    source: 'Sourate Al-Baqarah, 2:286',
  },
  {
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    french: 'Ô mon Seigneur, ouvre-moi ma poitrine, et facilite ma mission.',
    source: 'Sourate Ta-Ha, 20:25-26',
  },
  {
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    french: 'Dis : Il est Allah, l\'Unique.',
    source: 'Sourate Al-Ikhlas, 112:1',
  },
  {
    arabic: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
    french: 'Allah est la Lumière des cieux et de la terre.',
    source: 'Sourate An-Nur, 24:35',
  },
  {
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    french: 'Certes, Allah est avec les patients.',
    source: 'Sourate Al-Baqarah, 2:153',
  },
  {
    arabic: 'وَمَن يُوقَ شُحَّ نَفْسِهِ فَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ',
    french: 'Et quiconque se garde de l\'avarice de son âme, ceux-là sont les bienheureux.',
    source: 'Sourate Al-Hashr, 59:9',
  },
  {
    arabic: 'ادْعُوا رَبَّكُمْ تَضَرُّعًا وَخُفْيَةً',
    french: 'Invoquez votre Seigneur en toute humilité et en secret.',
    source: 'Sourate Al-A\'raf, 7:55',
  },
  {
    arabic: 'إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    french: 'Certes, Allah ne laisse pas se perdre la récompense des bienfaiteurs.',
    source: 'Sourate At-Tawbah, 9:120',
  },
]

/** Deterministic daily quote based on the date */
function getDailyInspiration(): InspirationQuote {
  const now = new Date()
  // Use day of year for deterministic rotation
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  const index = dayOfYear % inspirations.length
  return inspirations[index]
}

export function DailyInspiration() {
  const isDailyInspirationDismissed = useAppStore((s) => s.isDailyInspirationDismissed)
  const dismissDailyInspiration = useAppStore((s) => s.dismissDailyInspiration)

  const inspiration = useMemo(() => getDailyInspiration(), [])
  const isDismissed = isDailyInspirationDismissed()

  if (isDismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-100/60 via-amber-50/80 to-amber-100/40 p-5 md:p-6 dark:border-amber-600/20 dark:from-amber-950/40 dark:via-amber-900/30 dark:to-stone-900/40"
      >
        {/* Decorative background pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(217, 169, 99, 0.5) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(217, 169, 99, 0.3) 0%, transparent 50%)
            `,
          }}
        />

        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-7 w-7 text-amber-500/40 hover:text-amber-600/80 hover:bg-amber-100/50 dark:text-amber-400/40 dark:hover:text-amber-300/80 dark:hover:bg-amber-900/20"
          onClick={dismissDailyInspiration}
          aria-label="Masquer l'inspiration du jour"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-amber-500/70 dark:text-amber-400/70" />
            <span className="text-xs font-medium tracking-wider uppercase text-amber-600/70 dark:text-amber-400/70">
              Inspiration du jour
            </span>
          </div>

          {/* Arabic verse */}
          <p
            className="arabic-verse text-2xl md:text-3xl leading-relaxed text-amber-800 dark:text-amber-200/90 mb-4 text-center"
            dir="rtl"
            lang="ar"
          >
            {inspiration.arabic}
          </p>

          {/* Decorative separator */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/30 dark:to-amber-500/30" />
            <span className="text-amber-400/40 dark:text-amber-500/40 text-xs">✦</span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/30 dark:to-amber-500/30" />
          </div>

          {/* French translation */}
          <p className="text-sm md:text-base text-stone-600 dark:text-stone-300/80 text-center italic leading-relaxed mb-3">
            &ldquo;{inspiration.french}&rdquo;
          </p>

          {/* Source */}
          <p className="text-xs text-amber-600/60 dark:text-amber-500/50 text-center">
            — {inspiration.source}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
