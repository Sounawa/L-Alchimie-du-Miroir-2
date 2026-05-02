'use client'

import React from 'react'
import { useAppStore } from '@/store/use-app-store'
import { siteContent, allChapters } from '@/data/chapters'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  BookOpen,
  Home,
  List,
  BarChart3,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  X,
  Flame,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'

function SidebarContent({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) {
  const {
    navigate,
    currentView,
    currentChapterId,
    isChapterComplete,
    isBookmarked,
    getProgressPercentage,
    toggleChat,
    currentStreak,
  } = useAppStore()

  const progressPercent = getProgressPercentage()
  const parts = siteContent.parts

  const handleNavigate = (view: 'cover' | 'toc' | 'progress' | 'chapter', chapterId?: string) => {
    navigate(view, chapterId ?? null)
    // Only close sidebar on mobile
    if (isMobile) onClose()
  }

  const navItems = [
    { icon: Home, label: 'Accueil', view: 'cover' as const },
    { icon: List, label: 'Table des matières', view: 'toc' as const },
    { icon: BarChart3, label: 'Ma progression', view: 'progress' as const },
  ]

  return (
    <div className="flex h-full flex-col">
      {/* Logo + Title */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <span className="text-xl">🪞</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-foreground leading-tight truncate">
              L&apos;Alchimie du Miroir
            </h1>
            <p className="text-xs text-muted-foreground leading-tight mt-0.5">
              Niveau 2 : L&apos;Approfondissement
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Progress bar + Streak */}
      <div className="px-5 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Progression</span>
          <div className="flex items-center gap-2">
            {currentStreak > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-5 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-0 gap-0.5"
              >
                <Flame className="h-3 w-3" />
                {currentStreak}
              </Badge>
            )}
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-0">
              {progressPercent}%
            </Badge>
          </div>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      <Separator />

      {/* Navigation items */}
      <div className="px-3 py-2">
        {navItems.map((item) => {
          const isActive = currentView === item.view && item.view !== 'chapter'
          return (
            <motion.button
              key={item.view}
              onClick={() => handleNavigate(item.view)}
              className={`
                flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                transition-colors duration-150 mb-0.5
                ${isActive
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 ml-auto text-amber-600 dark:text-amber-400" />
              )}
            </motion.button>
          )
        })}
      </div>

      <Separator />

      {/* Chapter list by parts */}
      <ScrollArea className="flex-1 px-3">
        <div className="py-2">
          {parts.map((part) => (
            <div key={part.id} className="mb-3">
              {/* Part header */}
              <div className="px-3 py-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Partie {part.letter} — {part.title}
                </p>
              </div>

              {/* Chapter items */}
              {part.chapters.map((chapter) => {
                const isComplete = isChapterComplete(chapter.id)
                const isBooked = isBookmarked(chapter.id)
                const isActive = currentView === 'chapter' && currentChapterId === chapter.id

                return (
                  <motion.button
                    key={chapter.id}
                    onClick={() => handleNavigate('chapter', chapter.id)}
                    className={`
                      group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm
                      transition-colors duration-150 mb-0.5
                      ${isActive
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200'
                        : 'text-foreground/80 hover:bg-muted'
                      }
                    `}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Status icon */}
                    <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <span className="block h-3.5 w-3.5 rounded-sm border border-muted-foreground/30" />
                      )}
                    </span>

                    {/* Chapter number + title */}
                    <span className="flex-1 text-left truncate">
                      <span className="font-medium text-xs text-muted-foreground mr-1">
                        {chapter.number}
                      </span>
                      <span className={isComplete ? 'line-through opacity-60' : ''}>
                        {chapter.title}
                      </span>
                    </span>

                    {/* Bookmark indicator */}
                    <AnimatePresence>
                      {isBooked && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <Bookmark className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Active indicator */}
                    {isActive && (
                      <ChevronRight className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                  </motion.button>
                )
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* Chat toggle */}
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={() => {
            toggleChat()
            if (isMobile) onClose()
          }}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm">Assistant IA</span>
        </Button>
      </div>
    </div>
  )
}

export function AppSidebar() {
  const isMobile = useIsMobile()
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  const handleClose = () => {
    if (sidebarOpen) toggleSidebar()
  }

  // Mobile: render as Sheet (drawer from left)
  if (isMobile) {
    return (
      <Sheet open={sidebarOpen} onOpenChange={(isOpen) => { if (!isOpen) handleClose() }}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent onClose={handleClose} isMobile={isMobile} />
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: render as fixed sidebar (always visible)
  return (
    <aside
      className="
        fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-72
        border-r bg-gradient-to-b from-amber-50/50 via-background to-background
        dark:from-amber-950/10 dark:via-background dark:to-background
      "
    >
      <SidebarContent onClose={handleClose} isMobile={isMobile} />
    </aside>
  )
}
