# Task 14-a — New Views Developer

## Task: Add Glossary view and Spiritual Journal view

## Work Completed

### Files Modified
1. **`/src/store/use-app-store.ts`** — Extended ViewType, added JournalEntry interface and actions
2. **`/src/components/views/glossary-view.tsx`** — New file: Glossary view with accordion cards, letter index, search, resources
3. **`/src/components/views/journal-view.tsx`** — New file: Spiritual journal with CRUD, mood selector, tags, quotes
4. **`/src/app/page.tsx`** — Added GlossaryView and JournalView to renderView switch
5. **`/src/components/layout/app-sidebar.tsx`** — Added Glossaire and Journal navigation items

### Key Implementation Details

**Zustand Store Updates:**
- `ViewType` now includes `'glossary' | 'journal'`
- New `JournalEntry` interface with id, title, content, mood, tags, createdAt, updatedAt
- New `journalEntries: JournalEntry[]` state (persisted)
- Three new actions: `addJournalEntry`, `updateJournalEntry`, `deleteJournalEntry`
- `addJournalEntry` calls `recordActivity()` for streak tracking

**Glossary View:**
- Uses shadcn/ui Accordion for expandable term cards
- Accent-insensitive search via NFD normalization
- Terms grouped by first letter with decorative headers
- Sticky letter index sidebar on desktop
- Resources section with 5 book recommendations
- Amber-themed, theme-aware styling

**Journal View:**
- Dialog-based form for add/edit
- 5 mood emojis: 😊 😌 🤔 😢 🙏
- Comma-separated tags
- 8 rotating spiritual quotes (daily)
- Mood filter with counts
- Text search (accent-insensitive)
- Hover-reveal edit/delete buttons
- Beautiful empty state with CTA

**Lint:** Clean, no errors
**Dev Server:** Compiles successfully
