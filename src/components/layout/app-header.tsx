'use client'

import React, { useMemo } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { getChapterById } from '@/data/chapters'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Menu,
  Moon,
  Sun,
  Search,
  MessageSquare,
  BookOpen,
  Minus,
  Plus,
  Download,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

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
}

export function AppHeader() {
  const {
    toggleSidebar,
    currentView,
    currentChapterId,
    toggleChat,
    fontSize,
    setFontSize,
    navigate,
    exportNotes,
  } = useAppStore()

  const { theme, setTheme } = useTheme()

  // Determine the title to display
  const chapter = currentChapterId ? getChapterById(currentChapterId) : null
  const headerTitle =
    currentView === 'chapter' && chapter
      ? `${chapter.number} — ${chapter.title}`
      : "L'Alchimie du Miroir"

  // Build breadcrumb path
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; view?: string; chapterId?: string }[] = [
      { label: 'Accueil', view: 'cover' },
    ]

    if (currentView === 'cover') return items

    if (currentView === 'chapter' && chapter) {
      items.push({ label: 'Table des matières', view: 'toc' })
      items.push({ label: `Chapitre ${chapter.number}`, chapterId: currentChapterId ?? undefined })
    } else {
      const label = viewLabels[currentView] || currentView
      items.push({ label })
    }

    return items
  }, [currentView, currentChapterId, chapter])

  // Font size controls
  const handleFontSizeDecrease = () => {
    const newSize = Math.max(14, fontSize - 1)
    setFontSize(newSize)
  }

  const handleFontSizeIncrease = () => {
    const newSize = Math.min(24, fontSize + 1)
    setFontSize(newSize)
  }

  // Export notes
  const handleExportNotes = () => {
    const text = exportNotes()
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Notes copiées dans le presse-papiers !')
      },
      () => {
        toast.error('Impossible de copier les notes.')
      }
    )
  }

  // Dark mode toggle
  const isDark = theme === 'dark'
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/50 dark:border-stone-700/30 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="flex h-14 items-center gap-2 px-3 md:px-4">
        {/* Hamburger menu */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={toggleSidebar}
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Title with fade transition */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 hidden sm:block" />
          <AnimatePresence mode="wait">
            <motion.h2
              key={headerTitle}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-sm font-semibold truncate"
            >
              {headerTitle}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('search')}
            aria-label="Rechercher"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Chat toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleChat}
            aria-label="Assistant IA"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Settings dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Paramètres">
                <span className="flex h-4 w-4 items-center justify-center text-xs font-bold">⋮</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Taille du texte</DropdownMenuLabel>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleFontSizeDecrease}
                  disabled={fontSize <= 14}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Badge variant="secondary" className="flex-1 justify-center text-xs">
                  {fontSize}px
                </Badge>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleFontSizeIncrease}
                  disabled={fontSize >= 24}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleExportNotes}>
                <Download className="h-4 w-4 mr-2" />
                Exporter les notes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Breadcrumb navigation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={breadcrumbItems.map((i) => i.label).join('/')}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="px-3 md:px-4 pb-1.5 -mt-0.5"
        >
          <Breadcrumb>
            <BreadcrumbList className="text-[11px]">
              {breadcrumbItems.map((item, idx) => {
                const isLast = idx === breadcrumbItems.length - 1
                return (
                  <React.Fragment key={`${item.label}-${idx}`}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="text-[11px] text-foreground/80 font-medium">
                          {item.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          className="text-[11px] text-muted-foreground/70 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                          onClick={() => {
                            if (item.view) navigate(item.view as Parameters<typeof navigate>[0], item.chapterId ?? null)
                          }}
                        >
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>
      </AnimatePresence>
    </header>
  )
}
