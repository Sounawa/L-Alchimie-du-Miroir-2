'use client';

import { useAppStore } from '@/store/use-app-store';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { CoverView } from '@/components/views/cover-view';
import { TocView } from '@/components/views/toc-view';
import { IntroView } from '@/components/views/intro-view';
import { ChapterView } from '@/components/views/chapter-view';
import { AiChatPanel } from '@/components/shared/ai-chat-panel';
import { ProgressView } from '@/components/views/progress-view';
import { SearchView } from '@/components/views/search-view';

export default function Home() {
  const currentView = useAppStore((s) => s.currentView);
  const fontSize = useAppStore((s) => s.fontSize);
  const chatOpen = useAppStore((s) => s.chatOpen);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  const renderView = () => {
    switch (currentView) {
      case 'cover':
        return <CoverView />;
      case 'toc':
        return <TocView />;
      case 'intro':
        return <IntroView />;
      case 'chapter':
        return <ChapterView />;
      case 'progress':
        return <ProgressView />;
      case 'search':
        return <SearchView />;
      default:
        return <CoverView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontSize: `${fontSize}px` }}>
      <AppHeader />
      <div className="flex flex-1 relative">
        <AppSidebar />
        <main
          className={`flex-1 min-h-0 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-72' : ''
          }`}
        >
          {renderView()}
        </main>
        {chatOpen && <AiChatPanel />}
      </div>
    </div>
  );
}
