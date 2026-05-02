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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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
  PenLine,
  Settings,
  Hash,
  GraduationCap,
  Calendar,
  ArrowLeftRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { HijriDateDisplay } from '@/components/shared/hijri-date-display'

// Part color indicators
const partDotColor: Record<string, string> = {
  A: 'bg-amber-500 dark:bg-amber-400',
  B: 'bg-emerald-500 dark:bg-emerald-400',
  C: 'bg-violet-500 dark:bg-violet-400',
}

// Part left-border colors for active state
const partBorderColor: Record<string, string> = {
  A: 'border-l-amber-500 dark:border-l-amber-400',
  B: 'border-l-emerald-500 dark:border-l-emerald-400',
  C: 'border-l-violet-500 dark:border-l-violet-400',
}

// Get part letter from chapter ID (e.g., 'a1' -> 'A', 'b3' -> 'B')
function getPartLetter(chapterId: string): string {
  const letter = chapterId.charAt(0).toUpperCase()
  return letter === 'A' || letter === 'B' || letter === 'C' ? letter : 'A'
}

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

  // Count uncompleted chapters per part
  const uncompletedByPart: Record<string, number> = {}
  for (const part of parts) {
    let count = 0
    for (const ch of part.chapters) {
      if (!isChapterComplete(ch.id)) count++
    }
    uncompletedByPart[part.letter] = count
  }

  const handleNavigate = (view: 'cover' | 'toc' | 'progress' | 'chapter' | 'glossary' | 'journal' | 'settings' | 'tasbih' | 'bookmarks' | 'memorization' | 'reading-plan' | 'comparison', chapterId?: string) => {
    navigate(view, chapterId ?? null)
    // Only close sidebar on mobile
    if (isMobile) onClose()
  }

  const navItems = [
    { icon: Home, label: 'Accueil', view: 'cover' as const },
    { icon: List, label: 'Table des matières', view: 'toc' as const },
    { icon: BarChart3, label: 'Ma progression', view: 'progress' as const },
    { icon: BookOpen, label: 'Glossaire', view: 'glossary' as const },
    { icon: PenLine, label: 'Journal', view: 'journal' as const },
    { icon: Bookmark, label: 'Favoris', view: 'bookmarks' as const },
    { icon: GraduationCap, label: 'Mémorisation', view: 'memorization' as const },
    { icon: Calendar, label: 'Plan de Lecture', view: 'reading-plan' as const },
    { icon: ArrowLeftRight, label: 'Comparaison', view: 'comparison' as const },
    { icon: Hash, label: 'Tasbih', view: 'tasbih' as const },
    { icon: Settings, label: 'Paramètres', view: 'settings' as const },
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

      {/* Hijri Date Display — refined card */}
      <div className="px-4 py-2">
        <div className="rounded-lg border border-amber-200/40 dark:border-amber-800/20 bg-amber-50/40 dark:bg-amber-950/10 px-3 py-2 shadow-sm card-shadow-subtle">
          <HijriDateDisplay />
        </div>
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
                transition-all duration-200 mb-0.5
                ${isActive
                  ? 'bg-amber-100/80 text-amber-900 dark:bg-amber-900/25 dark:text-amber-200 border-l-[3px] border-l-amber-500 dark:border-l-amber-400'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground border-l-[3px] border-l-transparent'
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

      {/* Chapter list by parts with fade gradient at bottom */}
      <div className="flex-1 relative">
        <ScrollArea className="h-full px-3">
          <div className="py-2">
            <TooltipProvider delayDuration={300}>
              {parts.map((part) => (
                <div key={part.id} className="mb-3">
                  {/* Part header with color dot and uncompleted badge */}
                  <div className="px-3 py-1.5 flex items-center gap-1.5">
                    <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${partDotColor[part.letter] || 'bg-amber-500'}`} />
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Partie {part.letter} — {part.title}
                    </p>
                    {(uncompletedByPart[part.letter] || 0) > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-auto text-[9px] px-1 py-0 h-4 bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 border-0"
                      >
                        {uncompletedByPart[part.letter]}
                      </Badge>
                    )}
                  </div>

                {/* Chapter items */}
                {part.chapters.map((chapter) => {
                  const isComplete = isChapterComplete(chapter.id)
                  const isBooked = isBookmarked(chapter.id)
                  const isActive = currentView === 'chapter' && currentChapterId === chapter.id
                  const partLetter = getPartLetter(chapter.id)

                  return (
                    <Tooltip key={chapter.id}>
                      <TooltipTrigger asChild>
                        <motion.button
                          onClick={() => handleNavigate('chapter', chapter.id)}
                          className={`
                            group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm
                            transition-all duration-200 mb-0.5
                            ${isActive
                              ? `bg-amber-100/80 text-amber-900 dark:bg-amber-900/25 dark:text-amber-200 border-l-[3px] ${partBorderColor[partLetter] || 'border-l-amber-500'}`
                              : 'text-foreground/80 hover:bg-muted/60 border-l-[3px] border-l-transparent'
                            }
                          `}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Status icon + reading indicator */}
                          <span className="shrink-0 w-4 h-4 flex items-center justify-center relative">
                            {isComplete ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <span className="block h-3.5 w-3.5 rounded-sm border border-muted-foreground/30" />
                            )}
                            {/* Currently reading pulsing amber dot */}
                            {isActive && (
                              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400 amber-dot-pulse" />
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
                      </TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">
                        {chapter.subtitle || chapter.title}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            ))}
          </TooltipProvider>
          </div>
        </ScrollArea>
        {/* Gradient fade at bottom of scroll area */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

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
