'use client'

import React, { useCallback, useState } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, Target, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const dhikrOptions = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah', meaning: 'Gloire à Allah' },
  { id: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', meaning: 'Louange à Allah' },
  { id: 'allahuakbar', arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning: 'Allah est le plus grand' },
  { id: 'lailahaillallah', arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah', meaning: 'Il n\'y a de dieu qu\'Allah' },
]

const targetOptions = [33, 99]

export function TasbihCounter() {
  const {
    tasbihCount,
    tasbihTarget,
    tasbihDhikr,
    incrementTasbih,
    resetTasbih,
    setTasbihTarget,
    setTasbihDhikr,
  } = useAppStore()

  const [showRipple, setShowRipple] = useState(false)
  const [rippleKey, setRippleKey] = useState(0)
  const [showPulse, setShowPulse] = useState(false)
  const [showDhikrPicker, setShowDhikrPicker] = useState(false)
  const [showTargetPicker, setShowTargetPicker] = useState(false)
  const [customTarget, setCustomTarget] = useState('')

  const currentDhikr = dhikrOptions.find((d) => d.id === tasbihDhikr) || dhikrOptions[0]
  const progress = tasbihTarget > 0 ? Math.min(tasbihCount / tasbihTarget, 1) : 0
  const isComplete = tasbihCount >= tasbihTarget && tasbihTarget > 0

  const handleTap = useCallback(() => {
    incrementTasbih()
    // Visual feedback - ripple
    setRippleKey((k) => k + 1)
    setShowRipple(true)
    setTimeout(() => setShowRipple(false), 400)

    // Pulse effect
    setShowPulse(true)
    setTimeout(() => setShowPulse(false), 200)
  }, [incrementTasbih])

  const handleReset = useCallback(() => {
    resetTasbih()
  }, [resetTasbih])

  const handleTargetSelect = useCallback((target: number) => {
    setTasbihTarget(target)
    setShowTargetPicker(false)
    setCustomTarget('')
  }, [setTasbihTarget])

  const handleCustomTarget = useCallback(() => {
    const val = parseInt(customTarget, 10)
    if (val > 0 && val <= 9999) {
      setTasbihTarget(val)
      setShowTargetPicker(false)
      setCustomTarget('')
    }
  }, [customTarget, setTasbihTarget])

  const handleDhikrSelect = useCallback((id: string) => {
    setTasbihDhikr(id)
    setShowDhikrPicker(false)
  }, [setTasbihDhikr])

  // SVG progress ring parameters
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="max-w-lg mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold text-foreground">Tasbih</h1>
        <p className="text-muted-foreground text-sm mt-1">Compteur de dhikr digital</p>
      </motion.div>

      {/* Dhikr selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="w-full mb-6"
      >
        <button
          onClick={() => {
            setShowDhikrPicker(!showDhikrPicker)
            setShowTargetPicker(false)
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg
            border border-amber-300/60 dark:border-amber-700/40
            bg-amber-50/50 dark:bg-amber-950/20
            hover:bg-amber-100/60 dark:hover:bg-amber-900/30
            transition-colors"
        >
          <span className="arabic-verse text-lg">{currentDhikr.arabic}</span>
          <ChevronDown className={`h-4 w-4 text-amber-600 dark:text-amber-400 transition-transform ${showDhikrPicker ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {showDhikrPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 grid grid-cols-1 gap-1.5">
                {dhikrOptions.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleDhikrSelect(d.id)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all
                      ${tasbihDhikr === d.id
                        ? 'border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/30'
                        : 'border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700'
                      }
                    `}
                  >
                    <span className="arabic-verse text-base">{d.arabic}</span>
                    <span className="text-xs text-muted-foreground">
                      {d.transliteration} — {d.meaning}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress Ring + Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="relative mb-6"
      >
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-stone-200 dark:text-stone-700"
          />
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="url(#tasbihGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="tasbihGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Arabic dhikr */}
          <p className="arabic-verse text-xl text-amber-700 dark:text-amber-300 mb-2" lang="ar" dir="rtl">
            {currentDhikr.arabic}
          </p>

          {/* Count display */}
          <motion.div
            key={tasbihCount}
            initial={{ scale: 1.15, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="text-6xl font-bold text-foreground tabular-nums"
          >
            {tasbihCount}
          </motion.div>

          {/* Target display */}
          <p className="text-sm text-muted-foreground mt-1">
            / {tasbihTarget}
          </p>

          {/* Completion badge */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Badge className="mt-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0">
                  ✦ Complété ✦
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pulse overlay */}
        <AnimatePresence>
          {showPulse && (
            <motion.div
              key={`pulse-${rippleKey}`}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-full bg-amber-400/10 dark:bg-amber-400/5 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tap button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="w-full mb-6"
      >
        <button
          onClick={handleTap}
          className={`
            relative w-full py-8 rounded-2xl font-semibold text-lg
            transition-all duration-150 select-none
            active:scale-[0.97]
            ${isComplete
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30'
              : 'bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900/30'
            }
          `}
          aria-label="Incrémenter le compteur"
        >
          {/* Ripple effect */}
          <AnimatePresence>
            {showRipple && (
              <motion.span
                key={rippleKey}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-white/30 pointer-events-none"
              />
            )}
          </AnimatePresence>
          <span className="relative z-10">
            {isComplete ? '✦ Alhamdulillah ✦' : 'Taper pour compter'}
          </span>
        </button>
      </motion.div>

      {/* Controls row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full flex flex-col sm:flex-row gap-3"
      >
        {/* Target selector */}
        <div className="flex-1">
          <button
            onClick={() => {
              setShowTargetPicker(!showTargetPicker)
              setShowDhikrPicker(false)
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
              border border-amber-300/60 dark:border-amber-700/40
              bg-amber-50/50 dark:bg-amber-950/20
              hover:bg-amber-100/60 dark:hover:bg-amber-900/30
              transition-colors text-sm"
          >
            <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Objectif : {tasbihTarget}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-amber-600 dark:text-amber-400 transition-transform ${showTargetPicker ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showTargetPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 flex flex-col gap-2 p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-card">
                  <div className="flex gap-2">
                    {targetOptions.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleTargetSelect(t)}
                        className={`
                          flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                          ${tasbihTarget === t
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-stone-100 dark:bg-stone-800 text-muted-foreground hover:bg-amber-50 dark:hover:bg-amber-950/20'
                          }
                        `}
                      >
                        {t}×
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="9999"
                      value={customTarget}
                      onChange={(e) => setCustomTarget(e.target.value)}
                      placeholder="Personnalisé"
                      className="flex-1 px-3 py-2 rounded-lg text-sm border border-stone-200 dark:border-stone-700
                        bg-background text-foreground placeholder:text-muted-foreground
                        focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-600"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCustomTarget()
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={handleCustomTarget}
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      OK
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reset button */}
        <Button
          variant="outline"
          onClick={handleReset}
          className="gap-2 border-amber-300/60 dark:border-amber-700/40 hover:bg-amber-50 dark:hover:bg-amber-950/20"
        >
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
      </motion.div>
    </div>
  )
}
