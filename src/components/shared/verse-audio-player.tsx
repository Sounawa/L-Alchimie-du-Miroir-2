'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Loader2, Repeat, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { PartType } from '@/components/chapter/verse-display'

interface VerseAudioPlayerProps {
  arabicText: string
  part?: PartType
}

type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5
type RepeatCount = 1 | 3 | 7

const SPEED_CYCLE: PlaybackSpeed[] = [1, 1.25, 1.5, 0.75, 0.5]
const REPEAT_CYCLE: RepeatCount[] = [1, 3, 7]

// Waveform bar count
const WAVEFORM_BARS = 24

// Resolve part key for color mappings
function partKey(part?: PartType): 'A' | 'B' | 'C' {
  if (part === 'B') return 'B'
  if (part === 'C') return 'C'
  return 'A'
}

// Part-aware waveform active bar colors
const partWaveActive: Record<string, string> = {
  A: 'bg-amber-500 dark:bg-amber-400',
  B: 'bg-emerald-500 dark:bg-emerald-400',
  C: 'bg-violet-500 dark:bg-violet-400',
}

// Part-aware waveform past bar colors
const partWavePast: Record<string, string> = {
  A: 'bg-amber-400/60 dark:bg-amber-500/40',
  B: 'bg-emerald-400/60 dark:bg-emerald-500/40',
  C: 'bg-violet-400/60 dark:bg-violet-500/40',
}

// Part-aware play button glow
const partPlayGlow: Record<string, string> = {
  A: 'bg-amber-400/20 dark:bg-amber-500/15',
  B: 'bg-emerald-400/20 dark:bg-emerald-500/15',
  C: 'bg-violet-400/20 dark:bg-violet-500/15',
}

// Part-aware play button color
const partPlayBtn: Record<string, string> = {
  A: 'text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30',
  B: 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
  C: 'text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/30',
}

// Part-aware progress bar fill
const partProgressFill: Record<string, string> = {
  A: 'bg-amber-500 dark:bg-amber-400',
  B: 'bg-emerald-500 dark:bg-emerald-400',
  C: 'bg-violet-500 dark:bg-violet-400',
}

// Part-aware speed/repeat control active colors
const partControlActive: Record<string, string> = {
  A: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50',
  B: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50',
  C: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 hover:bg-violet-100 dark:hover:bg-violet-950/50',
}

// Part-aware speed/repeat control inactive hover colors
const partControlHover: Record<string, string> = {
  A: 'hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30',
  B: 'hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
  C: 'hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30',
}

// Part-aware repeat progress text
const partRepeatText: Record<string, string> = {
  A: 'text-amber-600 dark:text-amber-400',
  B: 'text-emerald-600 dark:text-emerald-400',
  C: 'text-violet-600 dark:text-violet-400',
}

export function VerseAudioPlayer({ arabicText, part }: VerseAudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1)
  const [repeatCount, setRepeatCount] = useState<RepeatCount>(1)
  const [currentRepeat, setCurrentRepeat] = useState(0)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pk = partKey(part)

  // Generate deterministic waveform bar heights based on text
  const waveformHeights = useMemo(() => {
    const heights: number[] = []
    let seed = 0
    for (const ch of arabicText) {
      seed = (seed * 31 + ch.charCodeAt(0)) & 0xffffff
    }
    for (let i = 0; i < WAVEFORM_BARS; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      heights.push(30 + (seed % 70)) // 30-100% height
    }
    return heights
  }, [arabicText])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [audioUrl])

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setProgress(0)
    setCurrentRepeat(0)
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])

  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100
        setProgress(pct)
      }
    }, 100)
  }, [])

  const playAudio = useCallback(async () => {
    if (!audioRef.current) return
    audioRef.current.playbackRate = playbackSpeed
    await audioRef.current.play()
    setIsPlaying(true)
    startProgressTracking()
  }, [playbackSpeed, startProgressTracking])

  const handleAudioEnded = useCallback(() => {
    const nextRepeat = currentRepeat + 1
    if (nextRepeat < repeatCount) {
      setCurrentRepeat(nextRepeat)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      setIsPlaying(false)
      setProgress(100)
      setCurrentRepeat(0)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      setTimeout(() => setProgress(0), 500)
    }
  }, [currentRepeat, repeatCount])

  const generateAudio = useCallback(async () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
      } else {
        audioRef.current.currentTime = 0
        setCurrentRepeat(0)
        await playAudio()
      }
      return
    }

    setIsLoading(true)
    try {
      const basePath = process.env.NODE_ENV === 'production' ? '/L-Alchimie-du-Miroir-2' : ''
      const response = await fetch(`${basePath}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: arabicText, lang: 'ar' }),
      })

      if (!response.ok) {
        throw new Error('TTS generation failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)

      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = handleAudioEnded
      audio.onerror = () => {
        setIsPlaying(false)
        setProgress(0)
      }

      setCurrentRepeat(0)
      await playAudio()
    } catch (error) {
      console.error('Audio playback error:', error)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }, [arabicText, audioUrl, isPlaying, playAudio, handleAudioEnded])

  const handleToggle = useCallback(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    } else {
      generateAudio()
    }
  }, [isPlaying, generateAudio])

  const cycleSpeed = useCallback(() => {
    const currentIdx = SPEED_CYCLE.indexOf(playbackSpeed)
    const nextIdx = (currentIdx + 1) % SPEED_CYCLE.length
    setPlaybackSpeed(SPEED_CYCLE[nextIdx])
  }, [playbackSpeed])

  const cycleRepeat = useCallback(() => {
    stopPlayback()
    const currentIdx = REPEAT_CYCLE.indexOf(repeatCount)
    const nextIdx = (currentIdx + 1) % REPEAT_CYCLE.length
    setRepeatCount(REPEAT_CYCLE[nextIdx])
  }, [repeatCount, stopPlayback])

  // Update playback rate when speed changes while playing
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.playbackRate = playbackSpeed
    }
  }, [playbackSpeed, isPlaying])

  // Re-attach onended handler when repeatCount or currentRepeat changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = handleAudioEnded
    }
  }, [handleAudioEnded])

  // Calculate which bars are "active" based on progress
  const activeBars = Math.floor((progress / 100) * WAVEFORM_BARS)

  return (
    <div className="space-y-3">
      {/* Waveform visualization */}
      <div className="flex items-center gap-[2px] h-12 px-1">
        {waveformHeights.map((heightPct, idx) => {
          const isActive = isPlaying && idx <= activeBars
          const isPast = !isPlaying && progress > 0 && idx <= activeBars

          return (
            <div
              key={idx}
              className="flex-1 relative"
              style={{ height: '100%' }}
            >
              <motion.div
                className={`absolute bottom-0 w-full rounded-sm ${
                  isActive
                    ? partWaveActive[pk]
                    : isPast
                      ? partWavePast[pk]
                      : 'bg-stone-200 dark:bg-stone-700'
                }`}
                style={{ height: `${heightPct}%` }}
                animate={isActive ? {
                  scaleY: [1, 1.15, 0.9, 1.1, 1],
                } : {}}
                transition={isActive ? {
                  duration: 0.8,
                  repeat: Infinity,
                  delay: idx * 0.04,
                  ease: 'easeInOut',
                } : {}}
              />
            </div>
          )
        })}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Main play/pause button */}
        <div className="relative">
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute inset-0 rounded-lg ${partPlayGlow[pk]} blur-md`}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative h-9 w-9 p-0 rounded-lg ${partPlayBtn[pk]}`}
            aria-label={isPlaying ? 'Pause' : 'Écouter le verset'}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.span
                  key="loading"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                </motion.span>
              ) : isPlaying ? (
                <motion.span
                  key="playing"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Pause className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Play className="h-4 w-4 ml-0.5" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Progress bar */}
        <div className="flex-1 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden min-w-[60px]">
          <motion.div
            className={`h-full ${partProgressFill[pk]} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.15, ease: 'linear' }}
          />
        </div>

        {/* Speed control */}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={cycleSpeed}
                className={`h-7 min-w-[2.5rem] px-1.5 text-[10px] font-mono font-bold rounded ${
                  playbackSpeed !== 1
                    ? partControlActive[pk]
                    : `text-stone-500 dark:text-stone-400 ${partControlHover[pk]}`
                }`}
                aria-label={`Vitesse de lecture: ${playbackSpeed}x`}
              >
                {playbackSpeed}x
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Vitesse : {playbackSpeed}x — Cliquez pour changer
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Repeat control */}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={cycleRepeat}
                className={`h-7 min-w-[2.25rem] px-1.5 text-[10px] font-bold rounded ${
                  repeatCount > 1
                    ? partControlActive[pk]
                    : `text-stone-500 dark:text-stone-400 ${partControlHover[pk]}`
                }`}
                aria-label={`Répétition: ${repeatCount} fois`}
              >
                <Repeat className="h-3 w-3 mr-0.5" />
                {repeatCount > 1 ? repeatCount : ''}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Répétition : {repeatCount} fois
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Repeat progress indicator */}
        {isPlaying && repeatCount > 1 && (
          <span className={`text-[9px] ${partRepeatText[pk]} font-medium tabular-nums`}>
            {currentRepeat + 1}/{repeatCount}
          </span>
        )}

        {/* Volume icon (visual only) */}
        <Volume2 className="h-3.5 w-3.5 text-stone-300 dark:text-stone-600" />

        {/* Hidden label for accessibility */}
        <span className="sr-only">
          {isPlaying ? 'Lecture en cours' : 'Écouter le verset'} — Vitesse {playbackSpeed}x — Répétition {repeatCount} fois
        </span>
      </div>
    </div>
  )
}
