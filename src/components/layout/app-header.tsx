'use client'

import React from 'react'
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
import { BreadcrumbNav } from '@/components/shared/breadcrumb-nav'
import { PrayerTimesBadge } from '@/components/shared/prayer-times-badge'

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
    <header className="sticky top-0 z-40 border-b border-stone-200/50 dark:border-stone-700/30 bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60">
      {/* Subtle warm divider line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 dark:via-amber-500/15 to-transparent" />
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
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="text-sm font-semibold truncate transition-opacity duration-300"
            >
              {headerTitle}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Prayer Times Badge */}
          <PrayerTimesBadge />

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

      {/* Breadcrumb navigation below the main header bar */}
      <BreadcrumbNav />
    </header>
  )
}
