'use client'

import { useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StickyNote, Pencil, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

// Field label mapping
const FIELD_LABELS: Record<string, string> = {
  munajat: 'Munajat',
  'exercise-0': 'Exercice 1',
  'exercise-1': 'Exercice 2',
  'exercise-2': 'Exercice 3',
  'exercise-3': 'Exercice 4',
  'exercise-4': 'Exercice 5',
  'exercise-5': 'Exercice 6',
  'exercise-6': 'Exercice 7',
  'exercise-7': 'Exercice 8',
  'exercise-8': 'Exercice 9',
  'exercise-9': 'Exercice 10',
}

function getFieldLabel(fieldId: string): string {
  if (FIELD_LABELS[fieldId]) return FIELD_LABELS[fieldId]
  // Handle extra section notes like "extra-b3"
  if (fieldId.startsWith('extra-')) {
    return `Section ${fieldId.replace('extra-', '')}`
  }
  // Handle timer notes
  if (fieldId === 'timer') return 'Méditation silencieuse'
  // Fallback: capitalize first letter
  return fieldId.charAt(0).toUpperCase() + fieldId.slice(1).replace(/-/g, ' ')
}

function truncateText(text: string, maxLines: number = 2): string {
  const lines = text.split('\n')
  if (lines.length <= maxLines) {
    // Also check character length for single long lines
    if (text.length > 120) {
      return text.slice(0, 120) + '...'
    }
    return text
  }
  return lines.slice(0, maxLines).join('\n') + '...'
}

interface ChapterNotesSummaryProps {
  chapterId: string
}

export function ChapterNotesSummary({ chapterId }: ChapterNotesSummaryProps) {
  const notes = useAppStore((s) => s.notes)
  const [isExpanded, setIsExpanded] = useState(false)

  // Get notes for this chapter
  const chapterNotes = useMemo(() => {
    return notes
      .filter((n) => n.chapterId === chapterId && n.content.trim())
      .sort((a, b) => a.fieldId.localeCompare(b.fieldId))
  }, [notes, chapterId])

  // Group notes by fieldId
  const groupedNotes = useMemo(() => {
    const groups = new Map<string, typeof chapterNotes>()
    for (const note of chapterNotes) {
      const existing = groups.get(note.fieldId) || []
      existing.push(note)
      groups.set(note.fieldId, existing)
    }
    return groups
  }, [chapterNotes])

  const scrollToField = useCallback((fieldId: string) => {
    // Try to find the section element by field id pattern
    const sectionMap: Record<string, string> = {
      munajat: 'section-munajat',
      timer: 'section-timer',
    }
    // For exercises, map exercise-0 to section-exercises, etc.
    if (fieldId.startsWith('exercise-')) {
      const el = document.getElementById('section-exercises')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    if (fieldId.startsWith('extra-')) {
      const el = document.getElementById('section-extra')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    const sectionId = sectionMap[fieldId]
    if (sectionId) {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    // Fallback: try finding by textarea with data-field-id attribute
    const textarea = document.querySelector(`textarea[data-field-id="${fieldId}"]`)
    if (textarea) {
      textarea.scrollIntoView({ behavior: 'smooth', block: 'center' })
      textarea.focus()
    }
  }, [])

  if (chapterNotes.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground/60 py-2">
        <StickyNote className="h-4 w-4" />
        <span className="text-sm italic">Aucune note pour ce chapitre</span>
      </div>
    )
  }

  return (
    <Card className="border-amber-200/40 dark:border-amber-800/20 overflow-hidden relative">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-50/30 via-transparent to-amber-50/20 dark:from-amber-950/10 dark:via-transparent dark:to-amber-950/10 pointer-events-none" />
      <CardContent className="pt-4 pb-3 relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left group"
        >
          <div className="flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
              Mes notes ({chapterNotes.length})
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                {Array.from(groupedNotes.entries()).map(([fieldId, fieldNotes]) => (
                  <div
                    key={fieldId}
                    className="rounded-lg border border-stone-200/60 dark:border-stone-700/30 bg-stone-50/50 dark:bg-stone-800/20 p-3"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        {getFieldLabel(fieldId)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => scrollToField(fieldId)}
                        className="h-6 px-2 text-[10px] gap-1 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-900/20"
                      >
                        <Pencil className="h-2.5 w-2.5" />
                        Modifier
                      </Button>
                    </div>
                    {fieldNotes.map((note) => (
                      <p
                        key={`${note.chapterId}-${note.fieldId}-${note.updatedAt}`}
                        className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed"
                      >
                        {truncateText(note.content)}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
