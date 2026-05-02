'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ChapterProgressIndicator() {
  const [scrollPercent, setScrollPercent] = useState(0)
  const initialized = useRef(false)

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    if (docHeight > 0) {
      const percent = Math.round((scrollTop / docHeight) * 100)
      setScrollPercent(Math.min(100, Math.max(0, percent)))
    }
  }, [])

  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState in effect
    const raf = requestAnimationFrame(() => {
      handleScroll()
      initialized.current = true
    })
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Only show after scrolling past 20%
  const isVisible = scrollPercent >= 20

  // SVG ring calculations
  const size = 40
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (scrollPercent / 100) * circumference

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-20 right-6 z-20 flex items-center justify-center"
          title={`Progression : ${scrollPercent}%`}
        >
          <div className="relative">
            <svg
              width={size}
              height={size}
              className="-rotate-90"
              viewBox={`0 0 ${size} ${size}`}
            >
              {/* Background ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-stone-200 dark:text-stone-700"
              />
              {/* Progress ring with amber gradient */}
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
              />
            </svg>
            {/* Percentage number */}
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-amber-700 dark:text-amber-300">
              {scrollPercent}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
