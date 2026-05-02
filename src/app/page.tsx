'use client'

import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { CoverView } from '@/components/views/cover-view'
import { TocView } from '@/components/views/toc-view'
import { IntroView } from '@/components/views/intro-view'
import { ChapterView } from '@/components/views/chapter-view'
import { AiChatPanel } from '@/components/shared/ai-chat-panel'
import { ProgressView } from '@/components/views/progress-view'
import { SearchView } from '@/components/views/search-view'
import { ReadingProgressBar } from '@/components/shared/reading-progress-bar'
import { ViewTransition } from '@/components/shared/view-transition'

export default function Home() {
  const currentView = useAppStore((s) => s.currentView)
  const currentChapterId = useAppStore((s) => s.currentChapterId)
  const fontSize = useAppStore((s) => s.fontSize)
  const chatOpen = useAppStore((s) => s.chatOpen)
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)
  const mainRef = useRef<HTMLDivElement>(null)

  // Scroll to top on view change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
  }, [currentView, currentChapterId])

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
      default:
        return <CoverView />
    }
  }

  // Cover view: hide header and sidebar for immersive full-screen experience
  if (currentView === 'cover') {
    return (
      <div className="min-h-screen flex flex-col" style={{ fontSize: `${fontSize}px` }}>
        <ViewTransition>
          <CoverView />
        </ViewTransition>
        {chatOpen && <AiChatPanel />}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontSize: `${fontSize}px` }}>
      <AppHeader />
      <ReadingProgressBar />
      <div className="flex flex-1 relative">
        <AppSidebar />
        <main
          ref={mainRef}
          className="flex-1 min-h-0 overflow-y-auto lg:ml-72"
        >
          <ViewTransition>
            {renderView()}
          </ViewTransition>
        </main>
        {chatOpen && <AiChatPanel />}
      </div>
    </div>
  )
}
