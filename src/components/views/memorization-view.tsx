'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters } from '@/data/chapters'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  GraduationCap,
  Eye,
  EyeOff,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  Trophy,
  Brain,
  Type,
  Shuffle,
  XCircle,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react'

type Difficulty = 'facile' | 'moyen' | 'difficile'
type GameMode = 'classic' | 'fill-blank' | 'ordering' | 'progressive'

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; description: string; color: string }> = {
  facile: {
    label: 'Facile',
    description: 'Première lettre visible',
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40',
  },
  moyen: {
    label: 'Moyen',
    description: 'Un mot sur deux visible',
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40',
  },
  difficile: {
    label: 'Difficile',
    description: 'Tout est caché',
    color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40',
  },
}

const GAME_MODE_CONFIG: Record<GameMode, { label: string; description: string; icon: React.ElementType }> = {
  classic: {
    label: 'Classique',
    description: 'Révélation progressive des mots',
    icon: Eye,
  },
  'fill-blank': {
    label: 'Texte à trous',
    description: 'Tapez les mots manquants',
    icon: Type,
  },
  ordering: {
    label: 'Ordonnancement',
    description: 'Remettez les mots en ordre',
    icon: Shuffle,
  },
  progressive: {
    label: 'Progressif',
    description: 'Révélez mot par mot en tapant',
    icon: Brain,
  },
}

function getWordsToShow(words: string[], difficulty: Difficulty): boolean[] {
  return words.map((_, idx) => {
    switch (difficulty) {
      case 'facile':
        // Show first letter hint — word is "revealed" if it's the first or every 3rd
        return idx % 3 === 0
      case 'moyen':
        return idx % 2 === 0
      case 'difficile':
        return false
    }
  })
}

/** Get first letter of a word for the easy hint */
function getFirstLetter(word: string): string {
  return word.charAt(0)
}

/** Chunk words into groups of 2-3 for verse chunking display */
function chunkWords(words: string[], size: number = 3): string[][] {
  const chunks: string[][] = []
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size))
  }
  return chunks
}

/** Fisher-Yates shuffle that guarantees the order is different from original */
function shuffleWords(words: string[]): number[] {
  const indices = words.map((_, i) => i)
  let attempts = 0
  do {
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    attempts++
  } while (attempts < 10 && indices.every((v, i) => v === i))
  return indices
}

export function MemorizationView() {
  const navigate = useAppStore((s) => s.navigate)
  const memorizationProgress = useAppStore((s) => s.memorizationProgress)
  const updateMemorizationProgress = useAppStore((s) => s.updateMemorizationProgress)

  const [selectedChapterId, setSelectedChapterId] = useState<string>('')
  const [difficulty, setDifficulty] = useState<Difficulty>('facile')
  const [gameMode, setGameMode] = useState<GameMode>('classic')
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
  const [showFullVerse, setShowFullVerse] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const [userInputs, setUserInputs] = useState<Record<number, string>>({})

  // Fill-in-blank specific state
  const [blankInputs, setBlankInputs] = useState<Record<number, string>>({})
  const [blankChecked, setBlankChecked] = useState(false)

  // Ordering game specific state
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([])
  const [userOrder, setUserOrder] = useState<number[]>([])
  const [orderingChecked, setOrderingChecked] = useState(false)

  // Progressive mode specific state
  const [progressiveIndex, setProgressiveIndex] = useState(0) // current word to reveal
  const [progressiveInput, setProgressiveInput] = useState('')
  const [progressiveRevealed, setProgressiveRevealed] = useState<Set<number>>(new Set())
  const [progressiveMistakes, setProgressiveMistakes] = useState(0)
  const [progressiveCompleted, setProgressiveCompleted] = useState(false)
  const progressiveInputRef = useRef<HTMLInputElement>(null)

  // Audio state
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const chapter = useMemo(
    () => allChapters.find((c) => c.id === selectedChapterId),
    [selectedChapterId]
  )

  const words = useMemo(() => {
    if (!chapter?.arabicVerse) return []
    return chapter.arabicVerse.split(/\s+/)
  }, [chapter])

  const chunks = useMemo(() => chunkWords(words, 3), [words])

  const visibleMap = useMemo(
    () => getWordsToShow(words, difficulty),
    [words, difficulty]
  )

  // Get indices of hidden words for fill-in-blank mode
  const hiddenIndices = useMemo(() => {
    return words.map((_, idx) => idx).filter((idx) => !visibleMap[idx])
  }, [words, visibleMap])

  const handleChapterChange = useCallback((id: string) => {
    setSelectedChapterId(id)
    resetAllState()
  }, [])

  const handleDifficultyChange = useCallback((d: Difficulty) => {
    setDifficulty(d)
    resetAllState()
  }, [])

  const handleGameModeChange = useCallback((m: GameMode) => {
    setGameMode(m)
    resetAllState()
    if (m === 'ordering' && words.length > 0) {
      const shuffled = shuffleWords(words)
      setShuffledIndices(shuffled)
      setUserOrder([])
    }
    if (m === 'progressive') {
      setProgressiveIndex(0)
      setProgressiveRevealed(new Set())
      setProgressiveMistakes(0)
      setProgressiveCompleted(false)
      setTimeout(() => progressiveInputRef.current?.focus(), 100)
    }
  }, [words])

  function resetAllState() {
    setRevealedIndices(new Set())
    setShowFullVerse(false)
    setHasChecked(false)
    setUserInputs({})
    setBlankInputs({})
    setBlankChecked(false)
    setShuffledIndices([])
    setUserOrder([])
    setOrderingChecked(false)
    setProgressiveIndex(0)
    setProgressiveInput('')
    setProgressiveRevealed(new Set())
    setProgressiveMistakes(0)
    setProgressiveCompleted(false)
  }

  // Audio playback
  const handlePlayAudio = useCallback(() => {
    if (!chapter?.arabicVerse) return
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(chapter.arabicVerse)
    utterance.lang = 'ar-SA'
    utterance.rate = 0.7
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    utteranceRef.current = utterance
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }, [chapter, isSpeaking])

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const handleHint = useCallback(() => {
    if (gameMode === 'classic') {
      for (let i = 0; i < words.length; i++) {
        if (!visibleMap[i] && !revealedIndices.has(i)) {
          setRevealedIndices((prev) => new Set([...prev, i]))
          return
        }
      }
    } else if (gameMode === 'fill-blank') {
      for (const idx of hiddenIndices) {
        if (!blankInputs[idx]) {
          setBlankInputs((prev) => ({ ...prev, [idx]: words[idx] }))
          return
        }
      }
    } else if (gameMode === 'ordering') {
      const nextIdx = userOrder.length
      if (nextIdx < words.length) {
        setUserOrder((prev) => [...prev, nextIdx])
      }
    } else if (gameMode === 'progressive') {
      // Reveal current word as hint
      if (progressiveIndex < words.length) {
        setProgressiveRevealed((prev) => new Set([...prev, progressiveIndex]))
        setProgressiveMistakes((prev) => prev + 1)
        setProgressiveIndex((prev) => prev + 1)
        setProgressiveInput('')
        setTimeout(() => progressiveInputRef.current?.focus(), 50)
      }
    }
  }, [gameMode, words, visibleMap, revealedIndices, hiddenIndices, blankInputs, userOrder, progressiveIndex])

  const handleCheck = useCallback(() => {
    if (gameMode === 'classic') {
      setShowFullVerse(true)
      setHasChecked(true)

      let correct = 0
      let total = 0
      words.forEach((word, idx) => {
        if (!visibleMap[idx] && !revealedIndices.has(idx)) {
          total++
          const userInput = userInputs[idx]?.trim()
          if (userInput && userInput === word) {
            correct++
          }
        }
      })

      const score = total > 0 ? Math.round((correct / total) * 100) : 100
      if (chapter) {
        updateMemorizationProgress(chapter.id, difficulty, score)
      }
    } else if (gameMode === 'fill-blank') {
      setBlankChecked(true)
      let correct = 0
      let total = hiddenIndices.length
      for (const idx of hiddenIndices) {
        const input = blankInputs[idx]?.trim()
        if (input && input === words[idx]) {
          correct++
        }
      }
      const score = total > 0 ? Math.round((correct / total) * 100) : 100
      if (chapter) {
        updateMemorizationProgress(chapter.id, difficulty, score)
      }
    } else if (gameMode === 'ordering') {
      setOrderingChecked(true)
      let correct = 0
      userOrder.forEach((wordIdx, pos) => {
        if (wordIdx === pos) correct++
      })
      const total = words.length
      const score = total > 0 ? Math.round((correct / total) * 100) : 100
      if (chapter) {
        updateMemorizationProgress(chapter.id, difficulty, score)
      }
    } else if (gameMode === 'progressive') {
      setProgressiveCompleted(true)
      // Score: based on mistakes vs total words
      const total = words.length
      const mistakeRatio = progressiveMistakes / total
      const score = Math.max(0, Math.round((1 - mistakeRatio) * 100))
      if (chapter) {
        updateMemorizationProgress(chapter.id, difficulty, score)
      }
    }
  }, [gameMode, words, visibleMap, revealedIndices, userInputs, blankInputs, hiddenIndices, userOrder, chapter, difficulty, updateMemorizationProgress, progressiveMistakes])

  const handleReset = useCallback(() => {
    resetAllState()
    if (gameMode === 'ordering' && words.length > 0) {
      const shuffled = shuffleWords(words)
      setShuffledIndices(shuffled)
      setUserOrder([])
    }
    if (gameMode === 'progressive') {
      setTimeout(() => progressiveInputRef.current?.focus(), 100)
    }
  }, [gameMode, words])

  const handleWordReveal = useCallback((idx: number) => {
    if (visibleMap[idx] || revealedIndices.has(idx) || showFullVerse) return
    setRevealedIndices((prev) => new Set([...prev, idx]))
  }, [visibleMap, revealedIndices, showFullVerse])

  // Progressive mode: handle typing the next word
  const handleProgressiveSubmit = useCallback(() => {
    if (progressiveIndex >= words.length) return
    const currentWord = words[progressiveIndex]
    const input = progressiveInput.trim()

    if (input === currentWord) {
      // Correct!
      setProgressiveRevealed((prev) => new Set([...prev, progressiveIndex]))
      setProgressiveIndex((prev) => prev + 1)
      setProgressiveInput('')
      setTimeout(() => progressiveInputRef.current?.focus(), 50)
    } else {
      // Wrong — count mistake
      setProgressiveMistakes((prev) => prev + 1)
    }
  }, [progressiveIndex, words, progressiveInput])

  // Ordering game: add word to order
  const handleOrderingAdd = useCallback((wordIdx: number) => {
    if (orderingChecked) return
    if (userOrder.includes(wordIdx)) return
    setUserOrder((prev) => [...prev, wordIdx])
  }, [userOrder, orderingChecked])

  // Ordering game: remove last word
  const handleOrderingRemoveLast = useCallback(() => {
    if (orderingChecked) return
    setUserOrder((prev) => prev.slice(0, -1))
  }, [orderingChecked])

  // Score calculations
  const classicScoreResult = useMemo(() => {
    if (!hasChecked) return null
    let correct = 0
    let total = 0
    words.forEach((word, idx) => {
      if (!visibleMap[idx] && !revealedIndices.has(idx)) {
        total++
        const userInput = userInputs[idx]?.trim()
        if (userInput && userInput === word) {
          correct++
        }
      }
    })
    return { correct, total, score: total > 0 ? Math.round((correct / total) * 100) : 100 }
  }, [hasChecked, words, visibleMap, revealedIndices, userInputs])

  const fillBlankScoreResult = useMemo(() => {
    if (!blankChecked) return null
    let correct = 0
    const total = hiddenIndices.length
    for (const idx of hiddenIndices) {
      const input = blankInputs[idx]?.trim()
      if (input && input === words[idx]) {
        correct++
      }
    }
    return { correct, total, score: total > 0 ? Math.round((correct / total) * 100) : 100 }
  }, [blankChecked, hiddenIndices, blankInputs, words])

  const orderingScoreResult = useMemo(() => {
    if (!orderingChecked) return null
    let correct = 0
    userOrder.forEach((wordIdx, pos) => {
      if (wordIdx === pos) correct++
    })
    const total = words.length
    return { correct, total, score: total > 0 ? Math.round((correct / total) * 100) : 100 }
  }, [orderingChecked, userOrder, words])

  const progressiveScoreResult = useMemo(() => {
    if (!progressiveCompleted) return null
    const total = words.length
    const score = Math.max(0, Math.round((1 - progressiveMistakes / total) * 100))
    return { correct: total - progressiveMistakes, total, score, mistakes: progressiveMistakes }
  }, [progressiveCompleted, words, progressiveMistakes])

  const activeScoreResult = gameMode === 'classic' ? classicScoreResult : gameMode === 'fill-blank' ? fillBlankScoreResult : gameMode === 'ordering' ? orderingScoreResult : progressiveScoreResult

  // Live memorization score for progressive mode
  const liveProgressiveScore = useMemo(() => {
    if (gameMode !== 'progressive' || words.length === 0) return null
    const revealed = progressiveRevealed.size
    const total = words.length
    const mistakes = progressiveMistakes
    const rawScore = Math.max(0, Math.round((1 - mistakes / total) * 100))
    return { revealed, total, mistakes, score: rawScore }
  }, [gameMode, words, progressiveRevealed, progressiveMistakes])

  const progress = chapter ? memorizationProgress[chapter.id] : null

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' },
    }),
  }

  let sectionIndex = 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('toc')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Table des matières
        </Button>
      </motion.div>

      {/* Title */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Brain className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Mode Mémorisation</h1>
        <p className="text-muted-foreground">
          Mémorisez les versets coraniques par révélation progressive
        </p>
      </motion.div>

      {/* Chapter selector + Difficulty toggle + Game mode */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-amber-200/50 dark:border-amber-800/30">
          <CardContent className="pt-4 pb-4 space-y-4">
            {/* Chapter selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Choisir un chapitre</label>
              <Select value={selectedChapterId} onValueChange={handleChapterChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un chapitre..." />
                </SelectTrigger>
                <SelectContent>
                  {allChapters.filter(c => c.arabicVerse).map((ch) => (
                    <SelectItem key={ch.id} value={ch.id}>
                      {ch.number} — {ch.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Game mode selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Mode de jeu</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.entries(GAME_MODE_CONFIG) as [GameMode, typeof GAME_MODE_CONFIG[GameMode]][]).map(([key, config]) => {
                  const Icon = config.icon
                  return (
                    <button
                      key={key}
                      onClick={() => handleGameModeChange(key)}
                      className={`rounded-lg border px-3 py-2 text-center transition-all duration-200 ${
                        gameMode === key
                          ? 'bg-amber-100 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 ring-2 ring-offset-1 ring-amber-400 dark:ring-amber-600'
                          : 'border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-0.5">
                        <Icon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <p className="text-sm font-semibold">{config.label}</p>
                      </div>
                      <p className="text-[10px] opacity-70">{config.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Difficulty selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Niveau de difficulté</label>
              <div className="flex gap-2">
                {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleDifficultyChange(key)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-center transition-all duration-200 ${
                      difficulty === key
                        ? config.color + ' ring-2 ring-offset-1 ring-amber-400 dark:ring-amber-600'
                        : 'border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700'
                    }`}
                  >
                    <p className="text-sm font-semibold">{config.label}</p>
                    <p className="text-[10px] opacity-70">{config.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Previous attempts info */}
            {progress && (
              <div className="flex items-center gap-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/20 px-3 py-2">
                <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
                <div className="text-xs text-amber-700 dark:text-amber-300/80">
                  <span className="font-medium">Meilleur score : {progress.bestScore}%</span>
                  <span className="mx-1.5">·</span>
                  <span>{progress.attempts} tentative{progress.attempts > 1 ? 's' : ''}</span>
                  <span className="mx-1.5">·</span>
                  <span>Niveau : {DIFFICULTY_CONFIG[progress.level as Difficulty]?.label || progress.level}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Verse memorization area */}
      {chapter && chapter.arabicVerse ? (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="overflow-hidden border-amber-200/60 dark:border-amber-700/40">
            {/* Card header with chapter info */}
            <div className="px-4 py-3 border-b border-amber-200/40 dark:border-amber-700/30 bg-gradient-to-r from-amber-50/60 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <Badge variant="outline" className="text-[10px] text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700">
                  {chapter.number}
                </Badge>
                <span className="text-sm font-medium">{chapter.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Audio button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayAudio}
                  className="h-7 w-7 p-0 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                  title="Écouter le verset"
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Badge className={`text-[10px] border ${DIFFICULTY_CONFIG[difficulty].color}`}>
                  {DIFFICULTY_CONFIG[difficulty].label}
                </Badge>
                <Badge variant="outline" className="text-[10px] border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400">
                  {GAME_MODE_CONFIG[gameMode].label}
                </Badge>
              </div>
            </div>

            {/* Live score for progressive mode */}
            {liveProgressiveScore && !progressiveCompleted && (
              <div className="px-4 py-2 border-b border-amber-200/30 dark:border-amber-700/20 bg-amber-50/40 dark:bg-amber-950/10">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                      Mots révélés : <span className="font-semibold text-amber-700 dark:text-amber-300">{liveProgressiveScore.revealed}/{liveProgressiveScore.total}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Erreurs : <span className={`font-semibold ${liveProgressiveScore.mistakes > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{liveProgressiveScore.mistakes}</span>
                    </span>
                  </div>
                  <span className="font-bold text-amber-700 dark:text-amber-300">{liveProgressiveScore.score}%</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-stone-200/60 dark:bg-stone-700/40 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                    animate={{ width: `${(liveProgressiveScore.revealed / liveProgressiveScore.total) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            <CardContent className="pt-6 pb-6 px-6">
              {/* ===== CLASSIC MODE ===== */}
              {gameMode === 'classic' && (
                <div className="relative">
                  <div className="text-center mb-6 text-amber-500 dark:text-amber-400 tracking-[0.5em] text-sm select-none">
                    ✦ ✦ ✦
                  </div>
                  {/* Chunked display */}
                  <div className="space-y-4">
                    {chunks.map((chunk, chunkIdx) => {
                      const startIdx = chunkIdx * 3
                      return (
                        <div
                          key={chunkIdx}
                          dir="rtl"
                          lang="ar"
                          className="arabic-verse text-3xl md:text-4xl text-center leading-loose flex flex-wrap justify-center gap-x-2 gap-y-3"
                        >
                          {chunk.map((word, wordIdx) => {
                            const idx = startIdx + wordIdx
                            if (idx >= words.length) return null
                            const isVisible = visibleMap[idx] || revealedIndices.has(idx) || showFullVerse
                            const isHidden = !isVisible

                            // Easy mode: show first letter hint
                            const showHint = difficulty === 'facile' && isHidden && !showFullVerse

                            let wordColor = 'text-amber-900 dark:text-amber-100'
                            if (hasChecked && showFullVerse && !visibleMap[idx] && !revealedIndices.has(idx)) {
                              const userInput = userInputs[idx]?.trim()
                              if (userInput && userInput === word) {
                                wordColor = 'text-emerald-600 dark:text-emerald-400'
                              } else if (userInput) {
                                wordColor = 'text-rose-500 dark:text-rose-400'
                              }
                            }

                            return (
                              <motion.span
                                key={idx}
                                initial={false}
                                animate={{
                                  opacity: isVisible ? 1 : 0.3,
                                  scale: isVisible ? 1 : 0.95,
                                }}
                                transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                                className={`relative cursor-pointer inline-block ${wordColor} ${isHidden ? 'hover:opacity-50' : ''}`}
                                onClick={() => handleWordReveal(idx)}
                              >
                                {isVisible ? (
                                  <span>{word}</span>
                                ) : (
                                  <span className="inline-block min-w-[3ch] rounded bg-amber-200/60 dark:bg-amber-800/40 px-2 py-0.5 select-none">
                                    {showHint ? (
                                      <span className="text-amber-400 dark:text-amber-500 text-lg">{getFirstLetter(word)}...</span>
                                    ) : (
                                      <span className="text-transparent">{word}</span>
                                    )}
                                  </span>
                                )}
                              </motion.span>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-center mt-6 text-amber-500 dark:text-amber-400 tracking-[0.5em] text-sm select-none">
                    ✦ ✦ ✦
                  </div>
                </div>
              )}

              {/* ===== FILL-IN-BLANK MODE ===== */}
              {gameMode === 'fill-blank' && (
                <div className="relative">
                  <div className="text-center mb-6 text-amber-500 dark:text-amber-400 tracking-[0.5em] text-sm select-none">
                    ✦ ✦ ✦
                  </div>
                  <div
                    dir="rtl"
                    lang="ar"
                    className="arabic-verse text-2xl md:text-3xl text-center leading-loose flex flex-wrap justify-center gap-x-2 gap-y-3 min-h-[120px]"
                  >
                    {words.map((word, idx) => {
                      const isBlank = !visibleMap[idx]

                      if (!isBlank) {
                        return (
                          <span key={idx} className="text-amber-900 dark:text-amber-100">
                            {word}
                          </span>
                        )
                      }

                      // Blank word - show input
                      const isCorrect = blankChecked && blankInputs[idx]?.trim() === word
                      const isIncorrect = blankChecked && blankInputs[idx]?.trim() && blankInputs[idx]?.trim() !== word
                      const isEmpty = blankChecked && !blankInputs[idx]?.trim()

                      return (
                        <motion.span
                          key={idx}
                          initial={false}
                          animate={{
                            scale: isCorrect ? 1.05 : isIncorrect ? 0.95 : 1,
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="relative inline-flex items-center"
                        >
                          <Input
                            dir="rtl"
                            lang="ar"
                            className={`w-auto min-w-[4ch] max-w-[12ch] h-9 text-center text-lg arabic-verse px-1 py-0 border-2 transition-all duration-300 ${
                              isCorrect
                                ? 'border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                                : isIncorrect
                                  ? 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300'
                                  : isEmpty
                                    ? 'border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                                    : 'border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-950/10'
                            }`}
                            value={blankInputs[idx] || ''}
                            onChange={(e) => {
                              if (!blankChecked) {
                                setBlankInputs((prev) => ({ ...prev, [idx]: e.target.value }))
                              }
                            }}
                            placeholder="..."
                            disabled={blankChecked}
                          />
                          {(isIncorrect || isEmpty) && blankChecked && (
                            <motion.span
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[11px] text-emerald-600 dark:text-emerald-400 whitespace-nowrap"
                            >
                              {word}
                            </motion.span>
                          )}
                          {isCorrect && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2"
                            >
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </motion.span>
                          )}
                          {isIncorrect && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2"
                            >
                              <XCircle className="h-4 w-4 text-rose-500" />
                            </motion.span>
                          )}
                        </motion.span>
                      )
                    })}
                  </div>
                  <div className="text-center mt-8 text-amber-500 dark:text-amber-400 tracking-[0.5em] text-sm select-none">
                    ✦ ✦ ✦
                  </div>
                </div>
              )}

              {/* ===== ORDERING MODE ===== */}
              {gameMode === 'ordering' && shuffledIndices.length > 0 && (
                <div className="space-y-6">
                  {/* User's assembled verse */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-3 text-center">
                      Votre ordre — cliquez sur les mots ci-dessous pour les placer
                    </p>
                    <div
                      dir="rtl"
                      lang="ar"
                      className="arabic-verse text-2xl md:text-3xl text-center leading-loose flex flex-wrap justify-center gap-x-2 gap-y-3 min-h-[80px] rounded-lg border-2 border-dashed border-amber-300/40 dark:border-amber-700/30 p-4 bg-amber-50/20 dark:bg-amber-950/10"
                    >
                      {userOrder.length === 0 ? (
                        <span className="text-muted-foreground/40 text-base italic">
                          Cliquez sur les mots pour les placer dans l&apos;ordre...
                        </span>
                      ) : (
                        userOrder.map((wordIdx, pos) => {
                          const isCorrect = orderingChecked && wordIdx === pos
                          const isIncorrect = orderingChecked && wordIdx !== pos

                          return (
                            <motion.span
                              key={`placed-${wordIdx}-${pos}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                backgroundColor: isCorrect
                                  ? 'rgba(16, 185, 129, 0.1)'
                                  : isIncorrect
                                    ? 'rgba(244, 63, 94, 0.1)'
                                    : 'transparent',
                              }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                              className={`inline-block rounded px-2 py-1 cursor-pointer transition-colors ${
                                isCorrect
                                  ? 'text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-400 dark:ring-emerald-500'
                                  : isIncorrect
                                    ? 'text-rose-600 dark:text-rose-400 ring-1 ring-rose-400 dark:ring-rose-500'
                                    : 'text-amber-900 dark:text-amber-100 hover:bg-amber-100/50 dark:hover:bg-amber-900/20'
                              }`}
                              onClick={handleOrderingRemoveLast}
                            >
                              {words[wordIdx]}
                              {isCorrect && <span className="text-[10px] mr-1">✓</span>}
                              {isIncorrect && <span className="text-[10px] mr-1">✗</span>}
                            </motion.span>
                          )
                        })
                      )}
                    </div>
                    {userOrder.length > 0 && !orderingChecked && (
                      <div className="text-center mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleOrderingRemoveLast}
                          className="text-xs text-muted-foreground"
                        >
                          ← Retirer le dernier mot
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Available words pool */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-3 text-center">
                      Mots disponibles
                    </p>
                    <div
                      dir="rtl"
                      lang="ar"
                      className="arabic-verse text-2xl text-center leading-loose flex flex-wrap justify-center gap-x-2 gap-y-2"
                    >
                      {shuffledIndices.map((wordIdx) => {
                        const isUsed = userOrder.includes(wordIdx)
                        return (
                          <motion.button
                            key={`pool-${wordIdx}`}
                            initial={false}
                            animate={{
                              opacity: isUsed ? 0.3 : 1,
                              scale: isUsed ? 0.9 : 1,
                            }}
                            transition={{ duration: 0.2 }}
                            onClick={() => handleOrderingAdd(wordIdx)}
                            disabled={isUsed || orderingChecked}
                            className={`inline-block rounded-lg px-3 py-1.5 transition-all ${
                              isUsed
                                ? 'bg-stone-100 dark:bg-stone-800/30 text-stone-300 dark:text-stone-600 cursor-not-allowed'
                                : 'bg-amber-100/60 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 hover:bg-amber-200/60 dark:hover:bg-amber-800/30 cursor-pointer hover:scale-105'
                            }`}
                          >
                            {words[wordIdx]}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== PROGRESSIVE MODE ===== */}
              {gameMode === 'progressive' && (
                <div className="space-y-6">
                  <div className="text-center mb-4 text-amber-500 dark:text-amber-400 tracking-[0.5em] text-sm select-none">
                    ✦ ✦ ✦
                  </div>
                  {/* Verse display with revealed/hidden words */}
                  <div
                    dir="rtl"
                    lang="ar"
                    className="arabic-verse text-3xl md:text-4xl text-center leading-loose flex flex-wrap justify-center gap-x-2 gap-y-3 min-h-[120px]"
                  >
                    {words.map((word, idx) => {
                      const isRevealed = progressiveRevealed.has(idx) || progressiveCompleted
                      const isCurrent = idx === progressiveIndex && !progressiveCompleted

                      return (
                        <motion.span
                          key={idx}
                          initial={false}
                          animate={{
                            opacity: isRevealed ? 1 : isCurrent ? 0.6 : 0.2,
                            scale: isCurrent ? 1.05 : isRevealed ? 1 : 0.95,
                          }}
                          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                          className={`relative inline-block ${
                            isRevealed
                              ? 'text-amber-900 dark:text-amber-100'
                              : isCurrent
                                ? 'text-amber-600 dark:text-amber-300 border-b-2 border-amber-400 dark:border-amber-500'
                                : 'text-transparent'
                          }`}
                        >
                          {isRevealed ? (
                            word
                          ) : isCurrent ? (
                            // Show first letter as hint for current word
                            <span className="inline-block min-w-[3ch]">
                              {difficulty === 'facile' ? `${getFirstLetter(word)}___` : '___'}
                            </span>
                          ) : (
                            <span className="inline-block min-w-[3ch] rounded bg-amber-200/60 dark:bg-amber-800/40 px-2 py-0.5">
                              <span className="text-transparent">{word}</span>
                            </span>
                          )}
                        </motion.span>
                      )
                    })}
                  </div>
                  <div className="text-center mt-4 text-amber-500 dark:text-amber-400 tracking-[0.5em] text-sm select-none">
                    ✦ ✦ ✦
                  </div>

                  {/* Input for current word */}
                  {!progressiveCompleted && progressiveIndex < words.length && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className="relative">
                        <Input
                          ref={progressiveInputRef}
                          dir="rtl"
                          lang="ar"
                          className="w-48 h-11 text-center text-xl arabic-verse border-2 border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-950/10 focus:border-amber-500 dark:focus:border-amber-500"
                          value={progressiveInput}
                          onChange={(e) => setProgressiveInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleProgressiveSubmit()
                            }
                          }}
                          placeholder="Tapez le mot..."
                          autoComplete="off"
                        />
                      </div>
                      <Button
                        onClick={handleProgressiveSubmit}
                        size="sm"
                        className="bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400"
                      >
                        Vérifier
                      </Button>
                    </div>
                  )}

                  {/* Completion message */}
                  {progressiveCompleted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-4"
                    >
                      <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                        {progressiveMistakes === 0
                          ? "Masha'Allah ! Mémorisation parfaite ! 🌟"
                          : progressiveMistakes <= 2
                            ? 'Très bien ! Quelques hésitations seulement. ✨'
                            : 'Bon effort ! Continuez à pratiquer. 💪'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {progressiveMistakes} erreur{progressiveMistakes > 1 ? 's' : ''} sur {words.length} mots
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Translation reference */}
              {chapter.translation && (
                <div className="mt-6 text-center">
                  <p className="text-sm italic text-muted-foreground/70 leading-relaxed">
                    {chapter.translation}
                  </p>
                  <p className="text-xs text-muted-foreground/50 mt-1">
                    — {chapter.translationSource}
                  </p>
                </div>
              )}
            </CardContent>

            {/* Action buttons */}
            <div className="px-4 pb-4 flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleHint}
                disabled={gameMode === 'classic' ? showFullVerse : gameMode === 'fill-blank' ? blankChecked : gameMode === 'ordering' ? orderingChecked : progressiveCompleted}
                className="gap-1.5"
              >
                <Lightbulb className="h-4 w-4" />
                Indice
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheck}
                disabled={gameMode === 'classic' ? showFullVerse : gameMode === 'fill-blank' ? blankChecked : gameMode === 'ordering' ? orderingChecked || userOrder.length !== words.length : progressiveCompleted}
                className="gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Vérifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-1.5"
              >
                <RotateCcw className="h-4 w-4" />
                Recommencer
              </Button>
              {gameMode === 'classic' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFullVerse(!showFullVerse)}
                  className="gap-1.5"
                >
                  {showFullVerse ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showFullVerse ? 'Cacher' : 'Voir tout'}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-dashed border-amber-200/50 dark:border-amber-800/30">
            <CardContent className="pt-8 pb-8 text-center space-y-3">
              <div className="flex justify-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-100/60 dark:bg-amber-950/30">
                  <GraduationCap className="h-8 w-8 text-amber-500/60 dark:text-amber-400/60" />
                </div>
              </div>
              <p className="text-muted-foreground font-medium">Sélectionnez un chapitre pour commencer</p>
              <p className="text-sm text-muted-foreground/60">
                Choisissez un chapitre dans le menu déroulant ci-dessus pour commencer la mémorisation
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Score result */}
      <AnimatePresence>
        {activeScoreResult && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <Card className={`border-2 ${
              activeScoreResult.score >= 80
                ? 'border-emerald-300 dark:border-emerald-700'
                : activeScoreResult.score >= 50
                  ? 'border-amber-300 dark:border-amber-700'
                  : 'border-rose-300 dark:border-rose-700'
            }`}>
              <CardContent className="pt-6 pb-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className={`flex items-center justify-center h-16 w-16 rounded-full ${
                    activeScoreResult.score >= 80
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : activeScoreResult.score >= 50
                        ? 'bg-amber-100 dark:bg-amber-900/30'
                        : 'bg-rose-100 dark:bg-rose-900/30'
                  }`}>
                    {activeScoreResult.score >= 80 ? (
                      <Star className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Trophy className={`h-8 w-8 ${
                        activeScoreResult.score >= 50
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`} />
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold">
                  Score : {activeScoreResult.score}%
                </h3>
                <p className="text-muted-foreground">
                  {activeScoreResult.correct} mot{activeScoreResult.correct > 1 ? 's' : ''} correct{activeScoreResult.correct > 1 ? 's' : ''} sur {activeScoreResult.total}
                  {'mistakes' in activeScoreResult && activeScoreResult.mistakes > 0 && (
                    <span className="text-rose-500 ml-2">({activeScoreResult.mistakes} indice{activeScoreResult.mistakes > 1 ? 's' : ''} utilisé{activeScoreResult.mistakes > 1 ? 's' : ''})</span>
                  )}
                </p>
                <p className="text-sm font-medium">
                  {activeScoreResult.score >= 90
                    ? "Masha'Allah ! Mémorisation excellente ! 🌟"
                    : activeScoreResult.score >= 70
                      ? 'Très bien ! Continuez à pratiquer. ✨'
                      : activeScoreResult.score >= 50
                        ? 'Bon effort ! Réessayez pour améliorer votre score. 💪'
                        : 'Continuez à pratiquer, la répétition est la clé. 🤲'}
                </p>
                <Button
                  onClick={handleReset}
                  className="mt-2 gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400"
                >
                  <RotateCcw className="h-4 w-4" />
                  Réessayer
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memorization tips */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-amber-200/30 dark:border-amber-800/20">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300">Conseils de mémorisation</h3>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    <span>Commencez par le mode <strong>Classique</strong> pour vous familiariser</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    <span>Le mode <strong>Progressif</strong> vous guide mot par mot avec suivi des erreurs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    <span>Utilisez le mode <strong>Texte à trous</strong> pour tester votre mémoire active</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    <span>Le mode <strong>Ordonnancement</strong> renforce la structure du verset</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    <span>Utilisez le bouton 🔊 pour écouter la prononciation du verset</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    <span>La répétition espacée est la clé — pratiquez un peu chaque jour</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
