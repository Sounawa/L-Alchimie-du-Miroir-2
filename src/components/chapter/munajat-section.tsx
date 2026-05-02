'use client'

import { useState, useCallback, useRef } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { Textarea } from '@/components/ui/textarea'

interface MunajatSectionProps {
  chapterId: string;
  prompts: string[];
}

export function MunajatSection({ chapterId, prompts }: MunajatSectionProps) {
  const saveNote = useAppStore((s) => s.saveNote)
  const getNote = useAppStore((s) => s.getNote)
  const [content, setContent] = useState(() => getNote(chapterId, 'munajat'))
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (value: string) => {
      setContent(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        saveNote(chapterId, 'munajat', value)
      }, 300)
    },
    [chapterId, saveNote]
  )

  const handleChipClick = useCallback(
    (prompt: string) => {
      const newContent = content ? `${content}\n${prompt}` : prompt
      handleChange(newContent)
    },
    [content, handleChange]
  )

  return (
    <div className="space-y-4">
      {prompts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleChipClick(prompt)}
              className="rounded-full border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 text-sm text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <Textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Écrivez votre prière personnelle ici..."
        className="min-h-[160px] resize-y"
      />
    </div>
  )
}
