'use client'

import { useState, useCallback, useRef } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { Textarea } from '@/components/ui/textarea'
import type { Exercise } from '@/data/chapters'

interface ExerciseSectionProps {
  chapterId: string;
  exercises: Exercise[];
  label?: string;
}

export function ExerciseSection({ chapterId, exercises, label }: ExerciseSectionProps) {
  if (exercises.length === 0) return null

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      <div className="space-y-6">
        {exercises.map((exercise, i) => (
          <ExerciseItem
            key={i}
            chapterId={chapterId}
            index={i}
            exercise={exercise}
          />
        ))}
      </div>
    </div>
  )
}

function ExerciseItem({
  chapterId,
  index,
  exercise,
}: {
  chapterId: string
  index: number
  exercise: Exercise
}) {
  const saveNote = useAppStore((s) => s.saveNote)
  const getNote = useAppStore((s) => s.getNote)
  const fieldId = `exercise-${index}`
  const [content, setContent] = useState(() => getNote(chapterId, fieldId))
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (value: string) => {
      setContent(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        saveNote(chapterId, fieldId, value)
      }, 300)
    },
    [chapterId, fieldId, saveNote]
  )

  return (
    <div className="space-y-2">
      <p className="font-medium">
        {index + 1}. {exercise.question}
      </p>
      <Textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={exercise.placeholder}
        className="min-h-[100px] resize-y"
      />
    </div>
  )
}
