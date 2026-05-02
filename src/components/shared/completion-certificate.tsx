'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { Star, Eye, Lightbulb, Compass, Flame, Zap, Sun, Award } from 'lucide-react'

const sevenLevels = [
  { id: 'c1', name: 'Tilawa', label: 'Récitation', icon: Star },
  { id: 'c2', name: 'Tarjamah', label: 'Compréhension', icon: Eye },
  { id: 'c3', name: 'Tadabbur', label: 'Réflexion', icon: Lightbulb },
  { id: 'c4', name: 'Tafakkur', label: 'Contemplation', icon: Compass },
  { id: 'c5', name: 'Tazakkur', label: 'Rappel', icon: Flame },
  { id: 'c6', name: 'Tahqiq', label: 'Vérification', icon: Zap },
  { id: 'c7', name: 'Tajalli', label: 'Révélation', icon: Sun },
]

export function CompletionCertificate() {
  const isChapterComplete = useAppStore((s) => s.isChapterComplete)
  const completedChapters = useAppStore((s) => s.completedChapters)

  // Check if all 7 C chapters are completed
  const allCComplete = sevenLevels.every((level) => isChapterComplete(level.id))
  if (!allCComplete) return null

  // Get completion dates for each level
  const levelData = sevenLevels.map((level) => {
    const cc = completedChapters.find((c) => c.chapterId === level.id)
    return {
      ...level,
      completedAt: cc ? new Date(cc.completedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      <div className="relative rounded-2xl border-2 border-violet-300/60 dark:border-violet-600/40 bg-gradient-to-b from-violet-50/90 via-stone-50/80 to-amber-50/60 dark:from-violet-950/30 dark:via-stone-900/20 dark:to-amber-950/15 p-6 md:p-8 shadow-lg shadow-violet-200/20 dark:shadow-violet-900/10 overflow-hidden">
        {/* SVG decorative border — Islamic geometric pattern */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 500"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top decorative arch */}
          <path d="M0 0 L400 0 L400 40 Q200 80 0 40 Z" fill="url(#certGradTop)" opacity="0.1" />
          {/* Bottom decorative arch */}
          <path d="M0 500 L400 500 L400 460 Q200 420 0 460 Z" fill="url(#certGradBot)" opacity="0.1" />
          {/* Side geometric patterns */}
          {/* Left border */}
          <line x1="8" y1="30" x2="8" y2="470" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.2" />
          <line x1="12" y1="30" x2="12" y2="470" stroke="#8b5cf6" strokeWidth="0.3" opacity="0.15" />
          {/* Right border */}
          <line x1="388" y1="30" x2="388" y2="470" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.2" />
          <line x1="392" y1="30" x2="392" y2="470" stroke="#8b5cf6" strokeWidth="0.3" opacity="0.15" />

          {/* Corner Islamic star patterns */}
          {/* Top-left star */}
          <g transform="translate(20, 20)" opacity="0.15">
            <polygon points="0,-8 2.5,-2.5 8,0 2.5,2.5 0,8 -2.5,2.5 -8,0 -2.5,-2.5" fill="#8b5cf6" />
          </g>
          {/* Top-right star */}
          <g transform="translate(380, 20)" opacity="0.15">
            <polygon points="0,-8 2.5,-2.5 8,0 2.5,2.5 0,8 -2.5,2.5 -8,0 -2.5,-2.5" fill="#8b5cf6" />
          </g>
          {/* Bottom-left star */}
          <g transform="translate(20, 480)" opacity="0.15">
            <polygon points="0,-8 2.5,-2.5 8,0 2.5,2.5 0,8 -2.5,2.5 -8,0 -2.5,-2.5" fill="#8b5cf6" />
          </g>
          {/* Bottom-right star */}
          <g transform="translate(380, 480)" opacity="0.15">
            <polygon points="0,-8 2.5,-2.5 8,0 2.5,2.5 0,8 -2.5,2.5 -8,0 -2.5,-2.5" fill="#8b5cf6" />
          </g>

          {/* Mid-side decorative elements */}
          <circle cx="8" cy="250" r="3" fill="#8b5cf6" opacity="0.15" />
          <circle cx="392" cy="250" r="3" fill="#8b5cf6" opacity="0.15" />

          <defs>
            <linearGradient id="certGradTop" x1="200" y1="0" x2="200" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="certGradBot" x1="200" y1="420" x2="200" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Title */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-violet-400/40 dark:to-violet-500/30" />
              <Award className="h-5 w-5 text-violet-500 dark:text-violet-400" />
              <span className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-violet-400/40 dark:to-violet-500/30" />
            </div>
            <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-violet-700 via-violet-600 to-amber-600 dark:from-violet-300 dark:via-violet-400 dark:to-amber-400 bg-clip-text text-transparent">
              Certificat de Complétion
            </h3>
            <p className="text-sm text-violet-600/70 dark:text-violet-400/60 mt-1">
              Les Sept Niveaux de Lecture
            </p>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="h-px w-8 bg-violet-300/30 dark:bg-violet-600/20" />
            <span className="text-violet-400/40 dark:text-violet-500/30 text-[8px] tracking-[0.4em]">✦ ❋ ✦ ❋ ✦</span>
            <span className="h-px w-8 bg-violet-300/30 dark:bg-violet-600/20" />
          </div>

          {/* Congratulation text */}
          <p className="text-sm text-stone-600 dark:text-stone-300/80 mb-5 leading-relaxed max-w-sm mx-auto">
            Masha&apos;Allah ! Vous avez parcouru les sept niveaux de lecture du Coran, de la récitation sacrée jusqu&apos;à l&apos;illumination spirituelle. Que cette lumière continue de guider votre chemin.
          </p>

          {/* Seven levels list with completion dates */}
          <div className="grid grid-cols-1 gap-1.5 max-w-xs mx-auto mb-6">
            {levelData.map((level, idx) => {
              const LevelIcon = level.icon
              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  className="flex items-center gap-2.5 rounded-lg bg-violet-100/40 dark:bg-violet-900/15 px-3 py-1.5 border border-violet-200/30 dark:border-violet-700/15"
                >
                  <div className="flex items-center justify-center rounded-full bg-violet-200/60 dark:bg-violet-800/30 h-6 w-6 shrink-0">
                    <LevelIcon className="h-3 w-3 text-violet-600 dark:text-violet-300" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-300">
                      {idx + 1}. {level.name}
                    </span>
                  </div>
                  <span className="text-[9px] text-violet-500/60 dark:text-violet-400/50 shrink-0">
                    {level.completedAt}
                  </span>
                </motion.div>
              )
            })}
          </div>

          {/* Golden seal/stamp */}
          <div className="flex items-center justify-center mt-4">
            <div className="relative">
              {/* Outer ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.8, duration: 0.6, type: 'spring', stiffness: 150 }}
                className="w-20 h-20 rounded-full border-3 border-amber-400/60 dark:border-amber-500/40 flex items-center justify-center relative"
              >
                {/* Inner ring */}
                <div className="w-14 h-14 rounded-full border-2 border-amber-300/50 dark:border-amber-600/30 flex items-center justify-center bg-gradient-to-br from-amber-100/50 to-amber-200/30 dark:from-amber-900/20 dark:to-amber-800/10">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block leading-tight">SEPT</span>
                    <span className="text-[8px] text-amber-600/70 dark:text-amber-400/50 block leading-tight">NIVEAUX</span>
                    <span className="text-amber-500 dark:text-amber-400 text-[8px]">✦</span>
                  </div>
                </div>
              </motion.div>

              {/* Decorative rays around seal */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-2 bg-amber-400/30 dark:bg-amber-500/20 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-44px)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom decorative text */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-violet-300/30 dark:to-violet-600/20" />
            <span className="text-[8px] text-violet-400/40 dark:text-violet-500/30 tracking-[0.3em] uppercase">L&apos;Alchimie du Miroir</span>
            <span className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-violet-300/30 dark:to-violet-600/20" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
