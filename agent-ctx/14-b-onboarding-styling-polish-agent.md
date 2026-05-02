# Task 14-b: Onboarding & Styling Polish Agent

## Task
Add onboarding overlay and polish styling for L'Alchimie du Miroir

## Work Completed

### Feature 1: Onboarding Overlay
- Created `/src/components/shared/onboarding-overlay.tsx` - 4-step welcome modal
- Step 1: Welcome with mirror emoji and app title
- Step 2: Feature highlights (Navigation, Notes, Chat IA, Mode sombre) with icons
- Step 3: How-to-use tips (read chapters, write notes, use timer)
- Step 4: "Commencer" button to dismiss
- AnimatePresence for step transitions
- Progress dots at bottom
- Only shows on first visit (persisted via Zustand)
- Integrated into page.tsx

### Feature 2: Styling Polish

#### Cover View
- Islamic-style double border pattern with corner ✦ ornaments
- Pulsing "scroll down" indicator at bottom
- Breathing/pulsing shadow on CTA button

#### TOC View
- "Résumé de progression" mini-card (completion count + streak)
- Staggered fade-in animation for part sections (100ms per part)
- Left-border color indicator: Part A = amber, Part B = emerald, Part C = violet
- Colored dots next to part headers

#### Chapter View
- Sticky chapter title bar when scrolling (with backdrop-blur)
- Mini-TOC dropdown in sticky bar + pills below chapter header
- Confetti emoji burst celebration when completing chapter
- Enhanced completion checkbox section (emerald border when complete)

#### Progress View
- Horizontal scrollable timeline/roadmap with chapter circles
- "Continue reading" CTA button for next incomplete chapter

#### Search View
- Recent search history chips (max 5, persisted in Zustand)
- "Effacer" clear button with destructive hover

#### Header
- Glass morphism effect (backdrop-blur-xl, semi-transparent bg)
- Animated title transitions with AnimatePresence

#### Sidebar
- Tooltip on chapter items showing subtitle
- Part color indicator dots (amber/emerald/violet)

### Store Updates
- Added `hasCompletedOnboarding: boolean` + `completeOnboarding()`
- Added `recentSearches: string[]` + `addRecentSearch()` + `clearRecentSearches()`
- Both fields added to `partialize`

## Status
- All lint checks pass
- Dev server compiles successfully
- All text in French
