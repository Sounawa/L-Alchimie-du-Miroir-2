'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Loader2, Repeat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface VerseAudioPlayerProps {
  arabicText: string
}

type PlaybackSpeed = 1 | 0.75 | 0.5
type RepeatCount = 1 | 3 | 7

const SPEED_CYCLE: PlaybackSpeed[] = [1, 0.75, 0.5]
const REPEAT_CYCLE: RepeatCount[] = [1, 3, 7]

export function VerseAudioPlayer({ arabicText }: VerseAudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1)
  const [repeatCount, setRepeatCount] = useState<RepeatCount>(1)
  const [currentRepeat, setCurrentRepeat] = useState(0)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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
      // Repeat the audio
      setCurrentRepeat(nextRepeat)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      // All repeats done
      setIsPlaying(false)
      setProgress(100)
      setCurrentRepeat(0)
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      // Reset progress after a brief moment
      setTimeout(() => setProgress(0), 500)
    }
  }, [currentRepeat, repeatCount])

  const generateAudio = useCallback(async () => {
    if (audioUrl && audioRef.current) {
      // Already have audio, just play/pause
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
      const response = await fetch('/api/tts', {
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
    stopPlayback()
    const currentIdx = SPEED_CYCLE.indexOf(playbackSpeed)
    const nextIdx = (currentIdx + 1) % SPEED_CYCLE.length
    setPlaybackSpeed(SPEED_CYCLE[nextIdx])
  }, [playbackSpeed, stopPlayback])

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

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      {/* Main play/pause button with glow */}
      <div className="relative">
        {/* Pulse glow effect during playback */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.3 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 rounded-lg bg-amber-400/20 dark:bg-amber-500/15 blur-md"
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
            />
          )}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          disabled={isLoading}
          className="relative h-10 w-10 p-0 rounded-lg text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
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
                className="flex items-center gap-0.5"
              >
                {/* Animated waveform bars */}
                <span className="flex items-center gap-[3px]">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="inline-block w-[3px] rounded-full bg-amber-500 dark:bg-amber-400"
                      animate={{
                        height: [6, 14, 8, 14, 6],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </span>
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Volume2 className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Progress bar */}
      <div className="w-16 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-amber-500 dark:bg-amber-400 rounded-full"
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
              className="h-7 min-w-[2.25rem] px-1.5 text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded"
              aria-label={`Vitesse de lecture: ${playbackSpeed}x`}
            >
              {playbackSpeed}x
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            Vitesse : {playbackSpeed}x
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
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50'
                  : 'text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
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

      {/* Repeat progress indicator (show which repeat we're on) */}
      {isPlaying && repeatCount > 1 && (
        <span className="text-[9px] text-amber-600 dark:text-amber-400 font-medium tabular-nums">
          {currentRepeat + 1}/{repeatCount}
        </span>
      )}

      {/* Hidden label for accessibility */}
      <span className="sr-only">
        {isPlaying ? 'Lecture en cours' : 'Écouter le verset'} — Vitesse {playbackSpeed}x — Répétition {repeatCount} fois
      </span>
    </div>
  )
}
