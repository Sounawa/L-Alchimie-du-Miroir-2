'use client'

import { useAppStore } from '@/store/use-app-store'
import { BookOpen, List, BarChart3, Heart, Flame, CheckCircle2 } from 'lucide-react'

export function AppFooter() {
  const navigate = useAppStore((s) => s.navigate)
  const currentView = useAppStore((s) => s.currentView)
  const getProgressPercentage = useAppStore((s) => s.getProgressPercentage)
  const completedChapters = useAppStore((s) => s.completedChapters)
  const currentStreak = useAppStore((s) => s.currentStreak)

  // Don't show footer on cover view
  if (currentView === 'cover') return null

  const progressPercent = getProgressPercentage()

  const footerLinks = [
    { icon: List, label: 'Table des matières', view: 'toc' as const },
    { icon: BarChart3, label: 'Ma progression', view: 'progress' as const },
    { icon: BookOpen, label: 'Recherche', view: 'search' as const },
  ]

  return (
    <footer className="border-t border-amber-200/30 dark:border-amber-800/20 bg-gradient-to-b from-amber-50/40 via-stone-50/30 to-amber-50/60 dark:from-amber-950/20 dark:via-stone-900/30 dark:to-amber-950/10 animate-fade-in-up">
      {/* SVG Wave divider at top */}
      <div className="w-full overflow-hidden leading-[0]">
        <svg
          className="w-full h-6"
          viewBox="0 0 1200 30"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 15 Q150 0 300 15 T600 15 T900 15 T1200 15 L1200 30 L0 30 Z"
            className="fill-amber-200/15 dark:fill-amber-800/8"
          />
          <path
            d="M0 20 Q150 8 300 20 T600 20 T900 20 T1200 20 L1200 30 L0 30 Z"
            className="fill-amber-200/10 dark:fill-amber-800/5"
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-5">
        {/* Résumé rapide section */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/70 dark:text-emerald-400/60" />
            <span>{completedChapters.length}/17 chapitres</span>
          </div>
          <div className="h-3 w-px bg-stone-200/60 dark:bg-stone-700/30" />
          {currentStreak > 0 && (
            <>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Flame className="h-3.5 w-3.5 text-orange-500/70 dark:text-orange-400/60" />
                <span>{currentStreak}j de suite</span>
              </div>
              <div className="h-3 w-px bg-stone-200/60 dark:bg-stone-700/30" />
            </>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-amber-600/70 dark:text-amber-400/60 font-medium">{progressPercent}%</span>
            <span>complété</span>
          </div>
        </div>

        {/* Decorative ornament line */}
        <div className="flex items-center justify-center gap-3 pb-3">
          <span className="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-amber-300/40 dark:to-amber-600/30" />
          <span className="text-amber-400/40 dark:text-amber-500/30 text-xs tracking-[0.5em] select-none">✦</span>
          <span className="h-px flex-1 max-w-20 bg-gradient-to-l from-transparent to-amber-300/40 dark:to-amber-600/30" />
        </div>

        {/* Navigation links */}
        <div className="flex items-center justify-center gap-6 mb-4">
          {footerLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => navigate(link.view)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
            >
              <link.icon className="h-3.5 w-3.5" />
              <span>{link.label}</span>
            </button>
          ))}
        </div>

        {/* App info with emboss effect */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground/60 text-emboss">
          <div className="flex items-center gap-1.5">
            <span>🪞</span>
            <span className="font-medium text-muted-foreground/80">L&apos;Alchimie du Miroir</span>
            <span className="text-muted-foreground/30">•</span>
            <span>Niveau 2</span>
            <span className="text-muted-foreground/30">•</span>
            <span>v2.0</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Fait avec</span>
            <Heart className="h-3 w-3 text-red-400/70 dark:text-red-500/60 fill-red-400/70 dark:fill-red-500/60" />
            <span>pour la méditation</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
