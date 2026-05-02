'use client'

import { useAppStore } from '@/store/use-app-store'
import { BookOpen, List, BarChart3, Heart } from 'lucide-react'

export function AppFooter() {
  const navigate = useAppStore((s) => s.navigate)
  const currentView = useAppStore((s) => s.currentView)

  // Don't show footer on cover view
  if (currentView === 'cover') return null

  const footerLinks = [
    { icon: List, label: 'Table des matières', view: 'toc' as const },
    { icon: BarChart3, label: 'Ma progression', view: 'progress' as const },
    { icon: BookOpen, label: 'Recherche', view: 'search' as const },
  ]

  return (
    <footer className="border-t border-amber-200/30 dark:border-amber-800/20 bg-gradient-to-b from-amber-50/40 via-stone-50/30 to-amber-50/60 dark:from-amber-950/20 dark:via-stone-900/30 dark:to-amber-950/10">
      {/* Decorative ornament line */}
      <div className="flex items-center justify-center gap-3 pt-4 pb-2">
        <span className="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-amber-300/40 dark:to-amber-600/30" />
        <span className="text-amber-400/40 dark:text-amber-500/30 text-xs tracking-[0.5em] select-none">✦</span>
        <span className="h-px flex-1 max-w-20 bg-gradient-to-l from-transparent to-amber-300/40 dark:to-amber-600/30" />
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-4">
        {/* Navigation links */}
        <div className="flex items-center justify-center gap-6 mb-3">
          {footerLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => navigate(link.view)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <link.icon className="h-3.5 w-3.5" />
              <span>{link.label}</span>
            </button>
          ))}
        </div>

        {/* App info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            <span>🪞</span>
            <span>L&apos;Alchimie du Miroir</span>
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
