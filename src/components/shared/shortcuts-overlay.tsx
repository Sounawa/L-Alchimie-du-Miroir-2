'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'

interface ShortcutGroup {
  category: string
  shortcuts: { keys: string[]; label: string }[]
}

const shortcutGroups: ShortcutGroup[] = [
  {
    category: 'Navigation',
    shortcuts: [
      { keys: ['Ctrl', 'K'], label: 'Rechercher' },
      { keys: ['Esc'], label: 'Retour / Fermer' },
      { keys: ['←'], label: 'Chapitre précédent' },
      { keys: ['→'], label: 'Chapitre suivant' },
      { keys: ['T'], label: 'Tasbih' },
      { keys: ['G'], label: 'Glossaire' },
      { keys: ['J'], label: 'Journal' },
    ],
  },
  {
    category: 'Actions',
    shortcuts: [
      { keys: ['B'], label: 'Ajouter / Retirer des favoris' },
      { keys: ['D'], label: 'Mode sombre / clair' },
    ],
  },
  {
    category: 'Vues',
    shortcuts: [
      { keys: ['?'], label: 'Aide raccourcis clavier' },
      { keys: ['Shift', '/'], label: 'Aide raccourcis clavier' },
    ],
  },
]

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 text-xs font-mono font-medium text-stone-700 dark:text-stone-300 shadow-sm">
      {children}
    </kbd>
  )
}

export function ShortcutsOverlay() {
  const showShortcuts = useAppStore((s) => s.showShortcuts)
  const toggleShortcuts = useAppStore((s) => s.toggleShortcuts)

  const handleClose = useCallback(() => {
    if (showShortcuts) toggleShortcuts()
  }, [showShortcuts, toggleShortcuts])

  // Close on Escape
  useEffect(() => {
    if (!showShortcuts) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showShortcuts, handleClose])

  return (
    <AnimatePresence>
      {showShortcuts && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-lg rounded-2xl border border-amber-200/60 dark:border-amber-700/40 bg-background shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-stone-200/60 dark:border-stone-700/30 bg-gradient-to-r from-amber-50/80 via-stone-50 to-amber-50/60 dark:from-amber-950/20 dark:via-background dark:to-amber-950/10 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">⌨️</span>
                    <h2 className="text-lg font-semibold text-foreground">Raccourcis clavier</h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content - 2 column layout */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {shortcutGroups.map((group) => (
                    <div key={group.category}>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
                        {group.category}
                      </h3>
                      <div className="space-y-2.5">
                        {group.shortcuts.map((shortcut) => (
                          <div
                            key={shortcut.label}
                            className="flex items-center justify-between gap-3"
                          >
                            <span className="text-sm text-muted-foreground truncate">
                              {shortcut.label}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              {shortcut.keys.map((key, i) => (
                                <span key={i} className="flex items-center gap-1">
                                  {i > 0 && (
                                    <span className="text-[10px] text-muted-foreground/50">+</span>
                                  )}
                                  <Kbd>{key}</Kbd>
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-stone-200/60 dark:border-stone-700/30 bg-stone-50/50 dark:bg-stone-900/30 px-6 py-3">
                <p className="text-[11px] text-muted-foreground text-center">
                  Appuyez sur <Kbd>Esc</Kbd> pour fermer
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
