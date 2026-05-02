'use client'

import React, { useMemo } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { getChapterById } from '@/data/chapters'
import { motion, AnimatePresence } from 'framer-motion'
import { Home } from 'lucide-react'

// View label map in French
const viewLabels: Record<string, string> = {
  cover: 'Accueil',
  toc: 'Table des matières',
  intro: 'Introduction',
  progress: 'Ma progression',
  search: 'Recherche',
  glossary: 'Glossaire',
  journal: 'Journal',
  settings: 'Paramètres',
  tasbih: 'Tasbih',
  bookmarks: 'Favoris',
  memorization: 'Mémorisation',
}

interface BreadcrumbItem {
  label: string
  view?: string
  chapterId?: string
}

export function BreadcrumbNav() {
  const currentView = useAppStore((s) => s.currentView)
  const currentChapterId = useAppStore((s) => s.currentChapterId)
  const navigate = useAppStore((s) => s.navigate)

  // Hide on cover page
  const isVisible = currentView !== 'cover'

  // Build breadcrumb path
  const items: BreadcrumbItem[] = useMemo(() => {
    const path: BreadcrumbItem[] = [
      { label: 'Accueil', view: 'cover' },
    ]

    if (!isVisible) return path

    const chapter = currentChapterId ? getChapterById(currentChapterId) : null

    if (currentView === 'chapter' && chapter) {
      path.push({ label: 'Table des matières', view: 'toc' })
      path.push({ label: `Chapitre ${chapter.number}`, chapterId: currentChapterId ?? undefined })
    } else {
      const label = viewLabels[currentView] || currentView
      path.push({ label })
    }

    return path
  }, [currentView, currentChapterId, isVisible])

  const handleClick = (item: BreadcrumbItem) => {
    if (item.view) {
      navigate(item.view as Parameters<typeof navigate>[0], item.chapterId ?? null)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.nav
          key={items.map((i) => i.label).join('/')}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          aria-label="Fil d'Ariane"
          className="px-3 md:px-4 pb-1.5 -mt-0.5"
        >
          <ol className="flex items-center flex-wrap text-xs">
            {items.map((item, idx) => {
              const isLast = idx === items.length - 1
              return (
                <React.Fragment key={`${item.label}-${idx}`}>
                  <li className="flex items-center">
                    {idx === 0 ? (
                      <button
                        onClick={() => handleClick(item)}
                        className="flex items-center gap-1 text-muted-foreground/60 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        aria-label="Accueil"
                      >
                        <Home className="h-3 w-3" />
                        <span>{item.label}</span>
                      </button>
                    ) : isLast ? (
                      <span className="text-foreground/80 font-medium text-amber-700 dark:text-amber-300">
                        {item.label}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClick(item)}
                        className="text-muted-foreground/60 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                  {!isLast && (
                    <li aria-hidden="true" className="mx-1.5 text-muted-foreground/40 select-none">
                      ›
                    </li>
                  )}
                </React.Fragment>
              )
            })}
          </ol>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
