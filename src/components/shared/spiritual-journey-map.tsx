'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { CheckCircle2, Star, Eye, Lightbulb, Compass, Flame, Zap, Sun } from 'lucide-react'

// Seven Levels data
const sevenLevels = [
  { id: 'c1', name: 'Tilawa', label: 'Récitation', icon: Star },
  { id: 'c2', name: 'Tarjamah', label: 'Compréhension', icon: Eye },
  { id: 'c3', name: 'Tadabbur', label: 'Réflexion', icon: Lightbulb },
  { id: 'c4', name: 'Tafakkur', label: 'Contemplation', icon: Compass },
  { id: 'c5', name: 'Tazakkur', label: 'Rappel', icon: Flame },
  { id: 'c6', name: 'Tahqiq', label: 'Vérification', icon: Zap },
  { id: 'c7', name: 'Tajalli', label: 'Révélation', icon: Sun },
]

// Color gradient from earth tones (bottom) to bright gold (top)
const levelColors = [
  { bg: 'from-amber-800/80 to-amber-900/80 dark:from-amber-900/60 dark:to-amber-950/60', text: 'text-amber-100 dark:text-amber-200', ring: '#92400e' },
  { bg: 'from-amber-700/80 to-amber-800/70 dark:from-amber-800/60 dark:to-amber-900/50', text: 'text-amber-100 dark:text-amber-200', ring: '#b45309' },
  { bg: 'from-amber-600/70 to-violet-700/60 dark:from-amber-700/50 dark:to-violet-800/50', text: 'text-amber-50 dark:text-amber-100', ring: '#d97706' },
  { bg: 'from-violet-600/70 to-violet-700/70 dark:from-violet-700/50 dark:to-violet-800/50', text: 'text-violet-50 dark:text-violet-100', ring: '#7c3aed' },
  { bg: 'from-violet-500/70 to-violet-600/70 dark:from-violet-600/50 dark:to-violet-700/50', text: 'text-violet-50 dark:text-violet-100', ring: '#8b5cf6' },
  { bg: 'from-violet-500/70 to-yellow-500/60 dark:from-violet-600/50 dark:to-yellow-600/40', text: 'text-violet-50 dark:text-yellow-100', ring: '#a78bfa' },
  { bg: 'from-yellow-400/70 to-amber-400/80 dark:from-yellow-500/50 dark:to-amber-500/50', text: 'text-yellow-950 dark:text-amber-100', ring: '#fbbf24' },
]

export function SpiritualJourneyMap() {
  const isChapterComplete = useAppStore((s) => s.isChapterComplete)
  const currentChapterId = useAppStore((s) => s.currentChapterId)

  return (
    <div className="relative w-full max-w-sm mx-auto py-4">
      {/* SVG mountain/path background */}
      <svg
        viewBox="0 0 200 520"
        className="absolute inset-0 w-full h-full pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mountain silhouette */}
        <defs>
          <linearGradient id="mountainGrad" x1="100" y1="0" x2="100" y2="520" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.15" />
            <stop offset="30%" stopColor="#8b5cf6" stopOpacity="0.12" />
            <stop offset="70%" stopColor="#7c3aed" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#92400e" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="pathGrad" x1="100" y1="520" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#92400e" stopOpacity="0.5" />
            <stop offset="30%" stopColor="#7c3aed" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Mountain shape */}
        <path
          d="M100 20 L160 180 L180 320 L170 450 L140 500 L60 500 L30 450 L20 320 L40 180 Z"
          fill="url(#mountainGrad)"
          className="dark:opacity-80"
        />

        {/* Ascending path line */}
        <path
          d="M100 490 C90 460 110 440 95 410 C80 380 115 360 100 330 C85 300 115 280 100 250 C85 220 115 200 100 170 C85 140 115 120 100 90 C92 70 108 55 100 35"
          stroke="url(#pathGrad)"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Glowing star at peak */}
        <circle cx="100" cy="28" r="6" fill="#fbbf24" opacity="0.3" filter="url(#glowFilter)">
          <animate attributeName="r" values="5;8;5" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="28" r="3" fill="#fbbf24" opacity="0.8" />
      </svg>

      {/* Level nodes */}
      <div className="relative z-10 flex flex-col items-center gap-0">
        {sevenLevels.map((level, idx) => {
          const isComplete = isChapterComplete(level.id)
          const isCurrent = currentChapterId === level.id
          const isFuture = !isComplete && !isCurrent
          const LevelIcon = level.icon
          const color = levelColors[idx]

          // Vertical position — ascending from bottom (idx 0) to top (idx 6)
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4, ease: 'easeOut' }}
              className="w-full flex items-center gap-3"
              style={{ minHeight: '62px' }}
            >
              {/* Level node circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`
                    relative flex items-center justify-center rounded-full border-2 shrink-0 transition-all duration-700
                    ${isCurrent
                      ? 'h-10 w-10 border-violet-400 bg-gradient-to-br ' + color.bg + ' shadow-[0_0_20px_rgba(139,92,246,0.4)] dark:shadow-[0_0_24px_rgba(139,92,246,0.3)]'
                      : isComplete
                        ? 'h-9 w-9 border-violet-400/80 bg-gradient-to-br ' + color.bg + ' shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                        : 'h-8 w-8 border-stone-300/60 dark:border-stone-600/40 bg-stone-100/80 dark:bg-stone-800/50'
                    }
                  `}
                  animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
                  transition={isCurrent ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                >
                  {/* Glowing ring for current */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full border-2 border-violet-400/40 animate-ping opacity-30" />
                  )}
                  {isComplete ? (
                    <CheckCircle2 className={`h-4 w-4 text-white`} />
                  ) : (
                    <LevelIcon className={`h-4 w-4 ${isCurrent ? color.text : 'text-stone-400 dark:text-stone-500'}`} />
                  )}
                </motion.div>

                {/* Connecting line to next level */}
                {idx < sevenLevels.length - 1 && (
                  <div className={`w-0.5 h-5 rounded-full transition-all duration-700 ${
                    isComplete
                      ? 'bg-gradient-to-b from-violet-400/60 to-violet-300/30 dark:from-violet-500/50 dark:to-violet-600/20'
                      : 'bg-stone-200/60 dark:bg-stone-700/30'
                  }`} />
                )}
              </div>

              {/* Level info */}
              <div className={`flex-1 min-w-0 ${isFuture ? 'opacity-40' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-xs ${
                    isCurrent
                      ? 'text-violet-700 dark:text-violet-300'
                      : isComplete
                        ? 'text-violet-600/80 dark:text-violet-400/70'
                        : 'text-stone-400 dark:text-stone-500'
                  }`}>
                    {idx + 1}. {level.name}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    isCurrent
                      ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 border border-violet-300/50 dark:border-violet-700/40 font-medium'
                      : 'bg-stone-100/60 dark:bg-stone-800/30 text-stone-400 dark:text-stone-500'
                  }`}>
                    {level.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[8px] text-violet-500 dark:text-violet-400 font-medium animate-pulse">← vous êtes ici</span>
                  )}
                </div>
                {/* Level number indicator */}
                <div className="mt-0.5 flex items-center gap-1">
                  <div className="h-1 flex-1 rounded-full bg-stone-200/40 dark:bg-stone-700/20 overflow-hidden max-w-20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isComplete ? '100%' : isCurrent ? '50%' : '0%' }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-500 dark:from-violet-500 dark:to-violet-400"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Top label */}
      <div className="text-center mt-2">
        <span className="text-[9px] text-yellow-500/70 dark:text-yellow-400/50 font-medium tracking-wider uppercase">
          ✦ Tajalli — Illumination ✦
        </span>
      </div>
    </div>
  )
}
