'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters } from '@/data/chapters'
import { Button } from '@/components/ui/button'
import { BookOpen, X, Sparkles } from 'lucide-react'

export function StudyReminder() {
  const completedChapters = useAppStore((s) => s.completedChapters)
  const currentStreak = useAppStore((s) => s.currentStreak)
  const isReminderDismissed = useAppStore((s) => s.isReminderDismissed)
  const dismissReminder = useAppStore((s) => s.dismissReminder)
  const navigate = useAppStore((s) => s.navigate)

  // Check if user completed any chapter today
  const hasCompletedToday = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStart = today.getTime()
    return completedChapters.some((cc) => cc.completedAt >= todayStart)
  }, [completedChapters])

  // Find next incomplete chapter
  const nextIncompleteChapter = useMemo(() => {
    return allChapters.find((c) => !completedChapters.some((cc) => cc.chapterId === c.id))
  }, [completedChapters])

  // Don't show if: already completed today, reminder dismissed, no streak and no chapters yet
  const shouldShow = !hasCompletedToday && !isReminderDismissed() && (currentStreak > 0 || completedChapters.length > 0)

  const message = currentStreak > 0
    ? `Votre série de ${currentStreak} jour${currentStreak > 1 ? 's' : ''} attend votre retour ! 📖`
    : 'Prenez un moment pour méditer aujourd\'hui ✨'

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="rounded-xl border border-amber-200/60 dark:border-amber-700/40 bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-amber-950/30 p-3.5 mb-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-amber-200/50 dark:bg-amber-800/30">
                <Sparkles className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200/90">
                  {message}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {nextIncompleteChapter && (
                  <Button
                    size="sm"
                    onClick={() => navigate('chapter', nextIncompleteChapter.id)}
                    className="h-8 bg-gradient-to-r from-amber-600 to-amber-500 text-amber-50 shadow-md shadow-amber-600/20 hover:from-amber-500 hover:to-amber-400 gap-1.5 text-xs"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Commencer
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissReminder}
                  className="h-8 w-8 p-0 text-amber-600/60 hover:text-amber-700 dark:text-amber-400/70 dark:hover:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/20"
                  title="Masquer pour aujourd'hui"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
