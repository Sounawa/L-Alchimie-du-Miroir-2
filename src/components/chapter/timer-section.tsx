'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface TimerSectionProps {
  chapterId: string;
  minutes: number;
}

export function TimerSection({ chapterId, minutes }: TimerSectionProps) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            clearTimer()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearTimer()
    }
    return clearTimer
  }, [isRunning, clearTimer])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(minutes * 60)
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    clearTimer()
    setTimeLeft(minutes * 60)
  }

  const isComplete = timeLeft === 0
  const totalSeconds = minutes * 60
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
          ⏱️ Minuterie — Chapitre {chapterId.toUpperCase()}
        </h3>
        <p className="text-sm text-muted-foreground">
          Durée recommandée : {minutes} minutes
        </p>
      </div>

      {/* Progress ring */}
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="currentColor"
              className="text-muted/30"
              strokeWidth="6"
            />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="currentColor"
              className={isComplete ? 'text-amber-500' : 'text-amber-600 dark:text-amber-400'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progressPercent / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p
              className={`text-2xl font-mono font-bold tracking-wider ${
                isComplete
                  ? 'text-amber-600 dark:text-amber-400'
                  : isRunning
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>

      {isComplete && (
        <p className="text-center text-amber-600 dark:text-amber-400 font-semibold animate-pulse">
          Temps écoulé ✨
        </p>
      )}

      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={handleStart}
          disabled={isRunning}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          ▶ Démarrer
        </Button>
        <Button
          onClick={handlePause}
          variant="outline"
          disabled={!isRunning}
        >
          ⏸ Pause
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
        >
          ↺ Reset
        </Button>
      </div>
    </div>
  )
}
