'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters } from '@/data/chapters'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
} from 'lucide-react'

type Difficulty = 'facile' | 'moyen' | 'difficile'

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; description: string; color: string }> = {
  facile: {
    label: 'Facile',
    description: '1 mot sur 3 visible',
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40',
  },
  moyen: {
    label: 'Moyen',
    description: 'Premier mot de chaque phrase',
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40',
  },
  difficile: {
    label: 'Difficile',
    description: 'Totale obscurité',
    color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40',
  },
}

function getWordsToShow(words: string[], difficulty: Difficulty): boolean[] {
  return words.map((_, idx) => {
    switch (difficulty) {
      case 'facile':
        return idx % 3 === 0
      case 'moyen':
        // Show first word of each "phrase" (every 3-4 words group)
        return idx === 0 || words[idx - 1]?.endsWith('،') || words[idx - 1]?.endsWith(',')
      case 'difficile':
        return false
    }
  })
}

export function MemorizationView() {
  const navigate = useAppStore((s) => s.navigate)
  const memorizationProgress = useAppStore((s) => s.memorizationProgress)
  const updateMemorizationProgress = useAppStore((s) => s.updateMemorizationProgress)

  const [selectedChapterId, setSelectedChapterId] = useState<string>('')
  const [difficulty, setDifficulty] = useState<Difficulty>('facile')
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
  const [showFullVerse, setShowFullVerse] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const [userInputs, setUserInputs] = useState<Record<number, string>>({})

  const chapter = useMemo(
    () => allChapters.find((c) => c.id === selectedChapterId),
    [selectedChapterId]
  )

  const words = useMemo(() => {
    if (!chapter?.arabicVerse) return []
    return chapter.arabicVerse.split(/\s+/)
  }, [chapter])

  const visibleMap = useMemo(
    () => getWordsToShow(words, difficulty),
    [words, difficulty]
  )

  const handleChapterChange = useCallback((id: string) => {
    setSelectedChapterId(id)
    setRevealedIndices(new Set())
    setShowFullVerse(false)
    setHasChecked(false)
    setUserInputs({})
  }, [])

  const handleDifficultyChange = useCallback((d: Difficulty) => {
    setDifficulty(d)
    setRevealedIndices(new Set())
    setShowFullVerse(false)
    setHasChecked(false)
    setUserInputs({})
  }, [])

  const handleHint = useCallback(() => {
    // Reveal the next hidden word
    for (let i = 0; i < words.length; i++) {
      if (!visibleMap[i] && !revealedIndices.has(i)) {
        setRevealedIndices((prev) => new Set([...prev, i]))
        return
      }
    }
  }, [visibleMap, revealedIndices, words.length])

  const handleCheck = useCallback(() => {
    setShowFullVerse(true)
    setHasChecked(true)

    // Calculate score
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
  }, [visibleMap, revealedIndices, words, userInputs, chapter, difficulty, updateMemorizationProgress])

  const handleReset = useCallback(() => {
    setRevealedIndices(new Set())
    setShowFullVerse(false)
    setHasChecked(false)
    setUserInputs({})
  }, [])

  const handleWordReveal = useCallback((idx: number) => {
    if (visibleMap[idx] || revealedIndices.has(idx) || showFullVerse) return
    setRevealedIndices((prev) => new Set([...prev, idx]))
  }, [visibleMap, revealedIndices, showFullVerse])

  // Score calculation for display
  const scoreResult = useMemo(() => {
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

      {/* Chapter selector + Difficulty toggle */}
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
              <Badge className={`text-[10px] border ${DIFFICULTY_CONFIG[difficulty].color}`}>
                {DIFFICULTY_CONFIG[difficulty].label}
              </Badge>
            </div>

            <CardContent className="pt-6 pb-6 px-6">
              {/* Arabic verse with progressive reveal */}
              <div className="relative">
                {/* Top ornamental line */}
                <div className="text-center mb-6 text-amber-500 dark:text-amber-400 tracking-[0.5em] text-sm select-none">
                  ✦ ✦ ✦
                </div>

                {/* Words grid */}
                <div
                  dir="rtl"
                  lang="ar"
                  className="arabic-verse text-3xl md:text-4xl text-center leading-loose flex flex-wrap justify-center gap-x-2 gap-y-3 min-h-[120px]"
                >
                  {words.map((word, idx) => {
                    const isVisible = visibleMap[idx] || revealedIndices.has(idx) || showFullVerse
                    const isHidden = !isVisible

                    // Check result coloring
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
                          <span className="inline-block min-w-[3ch] rounded bg-amber-200/60 dark:bg-amber-800/40 px-2 py-0.5 text-transparent select-none">
                            {word}
                          </span>
                        )}
                      </motion.span>
                    )
                  })}
                </div>

                {/* Bottom ornamental line */}
                <div className="text-center mt-6 text-amber-500 dark:text-amber-400 tracking-[0.5em] text-sm select-none">
                  ✦ ✦ ✦
                </div>
              </div>

              {/* Translation reference (always visible, small) */}
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
                disabled={showFullVerse}
                className="gap-1.5"
              >
                <Lightbulb className="h-4 w-4" />
                Indice
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheck}
                disabled={showFullVerse}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullVerse(!showFullVerse)}
                className="gap-1.5"
              >
                {showFullVerse ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showFullVerse ? 'Cacher' : 'Voir tout'}
              </Button>
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
        {scoreResult && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <Card className={`border-2 ${
              scoreResult.score >= 80
                ? 'border-emerald-300 dark:border-emerald-700'
                : scoreResult.score >= 50
                  ? 'border-amber-300 dark:border-amber-700'
                  : 'border-rose-300 dark:border-rose-700'
            }`}>
              <CardContent className="pt-6 pb-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className={`flex items-center justify-center h-16 w-16 rounded-full ${
                    scoreResult.score >= 80
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : scoreResult.score >= 50
                        ? 'bg-amber-100 dark:bg-amber-900/30'
                        : 'bg-rose-100 dark:bg-rose-900/30'
                  }`}>
                    <Trophy className={`h-8 w-8 ${
                      scoreResult.score >= 80
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : scoreResult.score >= 50
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-rose-600 dark:text-rose-400'
                    }`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold">
                  Score : {scoreResult.score}%
                </h3>
                <p className="text-muted-foreground">
                  {scoreResult.correct} mot{scoreResult.correct > 1 ? 's' : ''} correct{scoreResult.correct > 1 ? 's' : ''} sur {scoreResult.total}
                </p>
                <p className="text-sm font-medium">
                  {scoreResult.score >= 90
                    ? 'Masha\'Allah ! Mémorisation excellente ! 🌟'
                    : scoreResult.score >= 70
                      ? 'Très bien ! Continuez à pratiquer. ✨'
                      : scoreResult.score >= 50
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
                    <span>Commencez par le niveau <strong>Facile</strong> pour vous familiariser avec le verset</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    <span>Utilisez le bouton <strong>Indice</strong> pour révéler un mot à la fois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    <span>Cliquez sur un mot caché pour le révéler individuellement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                    <span>Récitez le verset à voix haute avant de vérifier</span>
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
