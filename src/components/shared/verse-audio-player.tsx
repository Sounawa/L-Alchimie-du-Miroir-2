'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Loader2, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VerseAudioPlayerProps {
  arabicText: string
}

export function VerseAudioPlayer({ arabicText }: VerseAudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const generateAudio = useCallback(async () => {
    if (audioUrl && audioRef.current) {
      // Already have audio, just play/pause
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
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

      audio.onended = () => {
        setIsPlaying(false)
      }

      audio.onerror = () => {
        setIsPlaying(false)
      }

      await audio.play()
      setIsPlaying(true)
    } catch (error) {
      console.error('Audio playback error:', error)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }, [arabicText, audioUrl, isPlaying])

  const handleToggle = useCallback(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      generateAudio()
    }
  }, [isPlaying, generateAudio])

  return (
    <div className="inline-flex items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={isLoading}
        className="h-8 gap-1.5 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs"
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
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            </motion.span>
          ) : isPlaying ? (
            <motion.span
              key="playing"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-0.5"
            >
              <Pause className="h-3.5 w-3.5" />
              {/* Waveform animation */}
              <span className="flex items-center gap-px ml-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="inline-block w-0.5 rounded-full bg-amber-500 dark:bg-amber-400"
                    animate={{
                      height: [4, 10, 6, 10, 4],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.15,
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
              <Volume2 className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Écouter'}</span>
      </Button>
    </div>
  )
}
