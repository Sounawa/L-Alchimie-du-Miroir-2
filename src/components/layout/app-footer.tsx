'use client'

import { useAppStore } from '@/store/use-app-store'
import { Separator } from '@/components/ui/separator'
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
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Navigation links */}
        <div className="flex items-center justify-center gap-6 mb-3">
          {footerLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => navigate(link.view)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <link.icon className="h-3.5 w-3.5" />
              <span>{link.label}</span>
            </button>
          ))}
        </div>

        <Separator className="mb-3" />

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
            <Heart className="h-3 w-3 text-red-400/60 fill-red-400/60" />
            <span>pour la méditation du Coran</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
