'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppFooter } from '@/components/layout/app-footer'
import { CoverView } from '@/components/views/cover-view'
import { TocView } from '@/components/views/toc-view'
import { IntroView } from '@/components/views/intro-view'
import { ChapterView } from '@/components/views/chapter-view'
import { AiChatPanel } from '@/components/shared/ai-chat-panel'
import { ProgressView } from '@/components/views/progress-view'
import { SearchView } from '@/components/views/search-view'
import { GlossaryView } from '@/components/views/glossary-view'
import { JournalView } from '@/components/views/journal-view'
import { SettingsView } from '@/components/views/settings-view'
import { BookmarksView } from '@/components/views/bookmarks-view'
import { TasbihCounter } from '@/components/shared/tasbih-counter'
import { MemorizationView } from '@/components/views/memorization-view'
import { ShortcutsOverlay } from '@/components/shared/shortcuts-overlay'
import { ReadingProgressBar } from '@/components/shared/reading-progress-bar'
import { ViewTransition } from '@/components/shared/view-transition'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { OnboardingOverlay } from '@/components/shared/onboarding-overlay'

export default function Home() {
  const currentView = useAppStore((s) => s.currentView)
  const currentChapterId = useAppStore((s) => s.currentChapterId)
  const fontSize = useAppStore((s) => s.fontSize)
  const chatOpen = useAppStore((s) => s.chatOpen)
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)
  const fontFamily = useAppStore((s) => s.fontFamily)
  const readingMode = useAppStore((s) => s.readingMode)
  const mainRef = useRef<HTMLDivElement>(null)

  // Register keyboard shortcuts
  useKeyboardShortcuts()

  // Scroll to top on view change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
  }, [currentView, currentChapterId])

  // Font family style
  const fontClass = useMemo(() => {
    switch (fontFamily) {
      case 'serif':
        return 'font-serif'
      case 'reading':
        return 'font-reading'
      default:
        return ''
    }
  }, [fontFamily])

  // Reading mode flags
  const isFocusMode = readingMode === 'focus'
  const isSoothingMode = readingMode === 'soothing'

  const renderView = () => {
    switch (currentView) {
      case 'cover':
        return <CoverView />
      case 'toc':
        return <TocView />
      case 'intro':
        return <IntroView />
      case 'chapter':
        return <ChapterView />
      case 'progress':
        return <ProgressView />
      case 'search':
        return <SearchView />
      case 'glossary':
        return <GlossaryView />
      case 'journal':
        return <JournalView />
      case 'settings':
        return <SettingsView />
      case 'tasbih':
        return <TasbihCounter />
      case 'bookmarks':
        return <BookmarksView />
      case 'memorization':
        return <MemorizationView />
      default:
        return <CoverView />
    }
  }

  // Cover view: hide header and sidebar for immersive full-screen experience
  if (currentView === 'cover') {
    return (
      <div className={`min-h-screen flex flex-col ${fontClass}`} style={{ fontSize: `${fontSize}px` }}>
        <ViewTransition>
          <CoverView />
        </ViewTransition>
        <AppFooter />
        {chatOpen && <AiChatPanel />}
        <OnboardingOverlay />
        <ShortcutsOverlay />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${fontClass} ${isSoothingMode ? 'reading-soothing' : ''}`} style={{ fontSize: `${fontSize}px` }}>
      {/* Header: hidden in focus mode */}
      {!isFocusMode && <AppHeader />}
      <ReadingProgressBar />
      <div className="flex flex-1 relative">
        {/* Sidebar: hidden in focus mode */}
        {!isFocusMode && <AppSidebar />}
        <main
          ref={mainRef}
          className={`flex-1 min-h-0 overflow-y-auto ${!isFocusMode ? 'lg:ml-72' : ''}`}
        >
          <ViewTransition>
            {renderView()}
          </ViewTransition>
        </main>
        {chatOpen && <AiChatPanel />}
      </div>
      <AppFooter />
      <OnboardingOverlay />
      <ShortcutsOverlay />
    </div>
  )
}
