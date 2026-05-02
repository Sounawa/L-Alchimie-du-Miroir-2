'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters, getChapterById } from '@/data/chapters'
import { Button } from '@/components/ui/button'
import { Share2, BookOpen, Sparkles, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

// Build a pool of reflection items from all chapter data
interface ReflectionItem {
  type: 'quote' | 'mirror' | 'munajat'
  text: string
  chapterId: string
  arabic?: string
}

function buildReflectionPool(): ReflectionItem[] {
  const items: ReflectionItem[] = []

  for (const chapter of allChapters) {
    // Arabic verse + translation as a quote
    if (chapter.arabicVerse && chapter.translation) {
      items.push({
        type: 'quote',
        text: chapter.translation,
        arabic: chapter.arabicVerse,
        chapterId: chapter.id,
      })
    }

    // Mirror questions
    for (const q of chapter.mirrorQuestions) {
      items.push({
        type: 'mirror',
        text: q.question,
        chapterId: chapter.id,
      })
    }

    // Munajat prompts
    for (const p of chapter.munajatPrompts) {
      items.push({
        type: 'munajat',
        text: p,
        chapterId: chapter.id,
      })
    }

    // Callouts (gold type)
    if (chapter.callouts) {
      for (const c of chapter.callouts) {
        if (c.type === 'gold') {
          items.push({
            type: 'quote',
            text: c.content,
            chapterId: chapter.id,
          })
        }
      }
    }

    // Quotes
    if (chapter.quotes) {
      for (const q of chapter.quotes) {
        items.push({
          type: 'quote',
          text: q.text,
          chapterId: chapter.id,
        })
      }
    }
  }

  return items
}

const reflectionPool = buildReflectionPool()

// Deterministic day-of-year index
function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const typeLabels: Record<string, string> = {
  quote: 'Citation',
  mirror: 'Question miroir',
  munajat: 'Munajat',
}

const typeColors: Record<string, string> = {
  quote: 'text-amber-700 dark:text-amber-300',
  mirror: 'text-violet-700 dark:text-violet-300',
  munajat: 'text-emerald-700 dark:text-emerald-300',
}

const typeBgColors: Record<string, string> = {
  quote: 'bg-amber-100/60 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  mirror: 'bg-violet-100/60 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  munajat: 'bg-emerald-100/60 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
}

export function ReflectionCard() {
  const navigate = useAppStore((s) => s.navigate)
  const dailyReflectionIndex = useAppStore((s) => s.dailyReflectionIndex)

  // Use day-of-year for deterministic daily rotation, offset by store index for variety
  const currentIndex = useMemo(() => {
    const dayIndex = (getDayOfYear() + dailyReflectionIndex) % reflectionPool.length
    return dayIndex
  }, [dailyReflectionIndex])

  const item = useMemo(() => {
    return reflectionPool[currentIndex] || reflectionPool[0]
  }, [currentIndex])

  const chapter = useMemo(() => {
    return getChapterById(item.chapterId)
  }, [item.chapterId])

  const handleShare = () => {
    const shareText = item.arabic
      ? `${item.arabic}\n\n${item.text}\n\n— ${chapter?.number || ''} ${chapter?.title || ''}, L'Alchimie du Miroir`
      : `${item.text}\n\n— ${chapter?.number || ''} ${chapter?.title || ''}, L'Alchimie du Miroir`

    navigator.clipboard.writeText(shareText).then(
      () => toast.success('Texte copié dans le presse-papiers !'),
      () => toast.error('Impossible de copier le texte.')
    )
  }

  const handleReflect = () => {
    navigate('chapter', item.chapterId)
  }

  const handleNewCard = () => {
    // Increment the dailyReflectionIndex to cycle through different reflections
    const store = useAppStore.getState()
    useAppStore.setState({
      dailyReflectionIndex: (store.dailyReflectionIndex + 1) % reflectionPool.length,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Amber/Gold gradient card with decorative elements */}
      <div className="relative rounded-2xl border border-amber-300/40 dark:border-amber-700/30 bg-gradient-to-br from-amber-50 via-amber-100/60 to-amber-50 dark:from-amber-950/30 dark:via-stone-900/60 dark:to-amber-950/20 p-5 md:p-6 shadow-lg shadow-amber-200/30 dark:shadow-amber-900/20">

        {/* Decorative corner ornaments */}
        <span className="absolute top-2 left-3 text-amber-400/20 dark:text-amber-600/15 text-xs select-none">✦</span>
        <span className="absolute top-2 right-3 text-amber-400/20 dark:text-amber-600/15 text-xs select-none">✦</span>
        <span className="absolute bottom-2 left-3 text-amber-400/20 dark:text-amber-600/15 text-xs select-none">✦</span>
        <span className="absolute bottom-2 right-3 text-amber-400/20 dark:text-amber-600/15 text-xs select-none">✦</span>

        {/* Subtle gradient overlay pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] islamic-pattern pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Carte de réflexion
            </h3>
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeBgColors[item.type]}`}>
            {typeLabels[item.type]}
          </span>
        </div>

        {/* Decorative line */}
        <div className="relative z-10 flex items-center gap-2 mb-4">
          <span className="h-px flex-1 bg-gradient-to-r from-amber-400/40 to-transparent dark:from-amber-600/30" />
          <span className="text-amber-400/40 dark:text-amber-600/30 text-[8px]">❋</span>
          <span className="h-px flex-1 bg-gradient-to-l from-amber-400/40 to-transparent dark:from-amber-600/30" />
        </div>

        {/* Arabic text (for quote type) */}
        {item.arabic && (
          <div className="relative z-10 mb-3 text-center">
            <p
              className="arabic-verse text-xl md:text-2xl text-amber-800/70 dark:text-amber-200/60 leading-relaxed"
              lang="ar"
              dir="rtl"
            >
              {item.arabic}
            </p>
          </div>
        )}

        {/* Main text */}
        <div className="relative z-10 mb-4">
          <p className={`text-sm md:text-base leading-relaxed italic ${item.type === 'mirror' ? 'not-italic font-medium' : ''} ${typeColors[item.type]}`}>
            {item.type === 'mirror' ? '🪞 ' : item.type === 'munajat' ? '🤲 ' : '❝ '}
            {item.text}
            {item.type === 'quote' ? ' ❞' : ''}
          </p>
        </div>

        {/* Chapter reference */}
        {chapter && (
          <div className="relative z-10 mb-4 flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-amber-500/60 dark:text-amber-400/50" />
            <span className="text-[11px] text-amber-600/60 dark:text-amber-400/50">
              {chapter.number} — {chapter.title}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="relative z-10 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 gap-1.5 text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/30"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="text-xs">Partager</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReflect}
            className="h-8 gap-1.5 text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/30"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="text-xs">Réfléchir</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewCard}
            className="h-8 gap-1.5 text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 ml-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="text-xs">Nouvelle</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
