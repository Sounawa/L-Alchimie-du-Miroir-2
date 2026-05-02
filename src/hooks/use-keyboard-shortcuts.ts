'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { allChapters } from '@/data/chapters'
import { useTheme } from 'next-themes'

/**
 * Hook that registers global keyboard shortcuts.
 *
 * Shortcuts:
 * - Ctrl+K / Cmd+K → Open search view
 * - Escape → Close chat panel, close sidebar on mobile, go back to previous view
 * - ← / → → Navigate to previous/next chapter (when in chapter view)
 * - B → Toggle bookmark on current chapter
 * - D → Toggle dark mode
 * - T → Navigate to Tasbih counter
 * - G → Navigate to Glossary
 * - J → Navigate to Journal
 * - ? or Shift+/ → Show keyboard shortcuts help overlay
 */
export function useKeyboardShortcuts() {
  const navigate = useAppStore((s) => s.navigate)
  const goBack = useAppStore((s) => s.goBack)
  const currentView = useAppStore((s) => s.currentView)
  const currentChapterId = useAppStore((s) => s.currentChapterId)
  const addBookmark = useAppStore((s) => s.addBookmark)
  const removeBookmark = useAppStore((s) => s.removeBookmark)
  const isBookmarked = useAppStore((s) => s.isBookmarked)
  const toggleShortcuts = useAppStore((s) => s.toggleShortcuts)
  const showShortcuts = useAppStore((s) => s.showShortcuts)

  const { setTheme, theme } = useTheme()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInputFocused =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      // Ctrl+K / Cmd+K → Open search (works even in inputs)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        navigate('search')
        return
      }

      // Don't handle shortcuts when typing in inputs (except Ctrl+K above)
      if (isInputFocused) return

      // Escape → Close shortcuts overlay first, then close chat / sidebar / go back
      if (e.key === 'Escape') {
        e.preventDefault()
        if (showShortcuts) {
          toggleShortcuts()
          return
        }
        goBack()
        return
      }

      // ? or Shift+/ → Show keyboard shortcuts help overlay
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        toggleShortcuts()
        return
      }

      // T → Navigate to Tasbih
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault()
        navigate('tasbih')
        return
      }

      // G → Navigate to Glossary
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault()
        navigate('glossary')
        return
      }

      // J → Navigate to Journal
      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault()
        navigate('journal')
        return
      }

      // Arrow keys for chapter navigation (only in chapter view)
      if (currentView === 'chapter' && currentChapterId) {
        const idx = allChapters.findIndex((c) => c.id === currentChapterId)

        if (e.key === 'ArrowLeft' && idx > 0) {
          e.preventDefault()
          navigate('chapter', allChapters[idx - 1].id)
          return
        }

        if (e.key === 'ArrowRight' && idx < allChapters.length - 1) {
          e.preventDefault()
          navigate('chapter', allChapters[idx + 1].id)
          return
        }
      }

      // B → Toggle bookmark on current chapter
      if (e.key === 'b' || e.key === 'B') {
        if (currentView === 'chapter' && currentChapterId) {
          e.preventDefault()
          const chapter = allChapters.find((c) => c.id === currentChapterId)
          if (chapter) {
            if (isBookmarked(currentChapterId)) {
              removeBookmark(currentChapterId)
            } else {
              addBookmark(currentChapterId, `${chapter.number} — ${chapter.title}`)
            }
          }
        }
        return
      }

      // D → Toggle dark mode
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        setTheme(theme === 'dark' ? 'light' : 'dark')
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    navigate,
    goBack,
    currentView,
    currentChapterId,
    addBookmark,
    removeBookmark,
    isBookmarked,
    setTheme,
    theme,
    toggleShortcuts,
    showShortcuts,
  ])
}
