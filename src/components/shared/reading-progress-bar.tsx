'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/use-app-store'

export function ReadingProgressBar() {
  const currentView = useAppStore((s) => s.currentView)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (currentView !== 'chapter') return

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (scrollHeight > 0) {
        setProgress((scrollTop / scrollHeight) * 100)
      }
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentView])

  if (currentView !== 'chapter' || progress <= 0) return null

  return (
    <div className="fixed top-14 left-0 right-0 z-30 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-150 ease-out"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  )
}
