'use client'

import dynamic from 'next/dynamic'

// Dynamic import with ssr: false eliminates ALL hydration mismatch issues
// because the component is never server-rendered — it only renders on the client.
// This is the correct approach for a client-side SPA that uses:
// - Zustand with localStorage persistence
// - Framer Motion animations (initial/hidden states)
// - Date-based computations (daily quotes, hijri dates)
// - Random sparkle generation
// - Browser APIs (URL hash, localStorage, etc.)
const HomeContent = dynamic(() => import('@/components/home-content'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="text-6xl animate-pulse">🪞</div>
        <p className="text-sm text-muted-foreground animate-pulse">
          L&apos;Alchimie du Miroir...
        </p>
      </div>
    </div>
  ),
})

export default function Home() {
  return <HomeContent />
}
