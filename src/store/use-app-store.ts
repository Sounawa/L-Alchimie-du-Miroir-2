import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewType = 'cover' | 'toc' | 'intro' | 'chapter' | 'progress' | 'search' | 'glossary' | 'journal';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string; // emoji
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface Bookmark {
  chapterId: string;
  label: string;
  createdAt: number;
}

interface NoteData {
  chapterId: string;
  fieldId: string; // e.g., "munajat", "exercise-0", "exercise-1"
  content: string;
  updatedAt: number;
}

interface CompletedChapter {
  chapterId: string;
  completedAt: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AppState {
  // Navigation
  currentView: ViewType;
  currentChapterId: string | null;
  previousView: ViewType | null;

  // Theme
  fontSize: number; // 14-24, default 16

  // Progress
  completedChapters: CompletedChapter[];

  // Notes (persisted to localStorage)
  notes: NoteData[];

  // Bookmarks
  bookmarks: Bookmark[];

  // Sidebar
  sidebarOpen: boolean;

  // AI Chat
  chatOpen: boolean;
  chatMessages: ChatMessage[];

  // Search
  searchQuery: string;

  // Journal
  journalEntries: JournalEntry[];

  // Daily Inspiration
  dailyInspirationDismissed: string; // ISO date string of when it was last dismissed

  // Streak tracking
  lastActivityDate: string; // ISO date string (YYYY-MM-DD)
  currentStreak: number;
  longestStreak: number;

  // Onboarding
  hasCompletedOnboarding: boolean;

  // Search history
  recentSearches: string[];

  // Actions
  navigate: (view: ViewType, chapterId?: string | null) => void;
  goBack: () => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setFontSize: (size: number) => void;
  toggleChapterComplete: (chapterId: string) => void;
  isChapterComplete: (chapterId: string) => boolean;
  saveNote: (chapterId: string, fieldId: string, content: string) => void;
  getNote: (chapterId: string, fieldId: string) => string;
  addBookmark: (chapterId: string, label: string) => void;
  removeBookmark: (chapterId: string) => void;
  isBookmarked: (chapterId: string) => boolean;
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  clearChat: () => void;
  setSearchQuery: (query: string) => void;
  getProgressPercentage: () => number; // 0-100 based on completed chapters
  exportNotes: () => string; // Export all notes as formatted text

  // Journal actions
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJournalEntry: (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => void;
  deleteJournalEntry: (id: string) => void;

  // Daily Inspiration actions
  dismissDailyInspiration: () => void;
  isDailyInspirationDismissed: () => boolean;

  // Streak actions
  recordActivity: () => void;

  // Onboarding actions
  completeOnboarding: () => void;

  // Search history actions
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const TOTAL_CHAPTERS = 17; // A1-A7 + B1-B10

/** Get today's date as YYYY-MM-DD string */
function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/** Get yesterday's date as YYYY-MM-DD string */
function getYesterdayDateString(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Navigation ──────────────────────────────────────────────
      currentView: 'cover',
      currentChapterId: null,
      previousView: null,

      // ── Theme ───────────────────────────────────────────────────
      fontSize: 16,

      // ── Progress ────────────────────────────────────────────────
      completedChapters: [],

      // ── Notes ───────────────────────────────────────────────────
      notes: [],

      // ── Bookmarks ───────────────────────────────────────────────
      bookmarks: [],

      // ── Sidebar ─────────────────────────────────────────────────
      sidebarOpen: false,

      // ── AI Chat ─────────────────────────────────────────────────
      chatOpen: false,
      chatMessages: [],

      // ── Search ──────────────────────────────────────────────────
      searchQuery: '',

      // ── Journal ──────────────────────────────────────────────────
      journalEntries: [],

      // ── Daily Inspiration ───────────────────────────────────────
      dailyInspirationDismissed: '',

      // ── Streak Tracking ─────────────────────────────────────────
      lastActivityDate: '',
      currentStreak: 0,
      longestStreak: 0,

      // ── Onboarding ────────────────────────────────────────────────
      hasCompletedOnboarding: false,

      // ── Search History ────────────────────────────────────────────
      recentSearches: [],

      // ── Actions ─────────────────────────────────────────────────

      navigate: (view: ViewType, chapterId?: string | null) => {
        const { currentView } = get();
        set({
          previousView: currentView,
          currentView: view,
          currentChapterId: chapterId ?? null,
        });
      },

      goBack: () => {
        const { previousView, currentView, chatOpen, sidebarOpen } = get();
        // Priority: close chat first, then sidebar on mobile, then navigate back
        if (chatOpen) {
          set({ chatOpen: false });
          return;
        }
        if (sidebarOpen) {
          set({ sidebarOpen: false });
          return;
        }
        if (previousView && previousView !== currentView) {
          set({ currentView: previousView, previousView: null });
        } else {
          // Default fallback navigation
          if (currentView === 'chapter') {
            set({ currentView: 'toc', previousView: null });
          } else if (currentView !== 'cover') {
            set({ currentView: 'toc', previousView: null });
          }
        }
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      toggleChat: () => {
        set((state) => ({ chatOpen: !state.chatOpen }));
      },

      setFontSize: (size: number) => {
        const clamped = Math.min(24, Math.max(14, size));
        set({ fontSize: clamped });
      },

      toggleChapterComplete: (chapterId: string) => {
        set((state) => {
          const exists = state.completedChapters.find(
            (c) => c.chapterId === chapterId
          );
          if (exists) {
            return {
              completedChapters: state.completedChapters.filter(
                (c) => c.chapterId !== chapterId
              ),
            };
          }
          return {
            completedChapters: [
              ...state.completedChapters,
              { chapterId, completedAt: Date.now() },
            ],
          };
        });
        // Record activity when completing a chapter
        get().recordActivity();
      },

      isChapterComplete: (chapterId: string) => {
        return get().completedChapters.some(
          (c) => c.chapterId === chapterId
        );
      },

      saveNote: (chapterId: string, fieldId: string, content: string) => {
        set((state) => {
          const existingIndex = state.notes.findIndex(
            (n) => n.chapterId === chapterId && n.fieldId === fieldId
          );
          if (existingIndex >= 0) {
            const updated = [...state.notes];
            updated[existingIndex] = {
              ...updated[existingIndex],
              content,
              updatedAt: Date.now(),
            };
            return { notes: updated };
          }
          return {
            notes: [
              ...state.notes,
              { chapterId, fieldId, content, updatedAt: Date.now() },
            ],
          };
        });
        // Record activity when saving a note
        get().recordActivity();
      },

      getNote: (chapterId: string, fieldId: string) => {
        const note = get().notes.find(
          (n) => n.chapterId === chapterId && n.fieldId === fieldId
        );
        return note?.content ?? '';
      },

      addBookmark: (chapterId: string, label: string) => {
        set((state) => {
          if (state.bookmarks.some((b) => b.chapterId === chapterId)) {
            return state; // no duplicates
          }
          return {
            bookmarks: [
              ...state.bookmarks,
              { chapterId, label, createdAt: Date.now() },
            ],
          };
        });
      },

      removeBookmark: (chapterId: string) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter(
            (b) => b.chapterId !== chapterId
          ),
        }));
      },

      isBookmarked: (chapterId: string) => {
        return get().bookmarks.some((b) => b.chapterId === chapterId);
      },

      addChatMessage: (role: 'user' | 'assistant', content: string) => {
        set((state) => ({
          chatMessages: [...state.chatMessages, { role, content }],
        }));
      },

      clearChat: () => {
        set({ chatMessages: [] });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      // ── Journal Actions ────────────────────────────────────────

      addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = Date.now();
        const id = `journal-${now}-${Math.random().toString(36).slice(2, 9)}`;
        set((state) => ({
          journalEntries: [
            { ...entry, id, createdAt: now, updatedAt: now },
            ...state.journalEntries,
          ],
        }));
        get().recordActivity();
      },

      updateJournalEntry: (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => {
        set((state) => ({
          journalEntries: state.journalEntries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updates, updatedAt: Date.now() }
              : entry
          ),
        }));
      },

      deleteJournalEntry: (id: string) => {
        set((state) => ({
          journalEntries: state.journalEntries.filter((entry) => entry.id !== id),
        }));
      },

      getProgressPercentage: () => {
        const completed = get().completedChapters.length;
        return Math.round((completed / TOTAL_CHAPTERS) * 100);
      },

      exportNotes: () => {
        const { notes, completedChapters, currentStreak, longestStreak } = get();

        if (notes.length === 0 && completedChapters.length === 0) {
          return "Aucune note ou progression à exporter.";
        }

        const lines: string[] = [];

        lines.push("═══════════════════════════════════════════");
        lines.push("  L'Alchimie du Miroir — Notes & Progrès");
        lines.push("═══════════════════════════════════════════");
        lines.push("");

        // Progress section
        const pct = get().getProgressPercentage();
        lines.push(`Progression : ${pct}% (${completedChapters.length}/${TOTAL_CHAPTERS} chapitres)`);
        lines.push(`Série actuelle : ${currentStreak} jour${currentStreak > 1 ? 's' : ''}`);
        lines.push(`Meilleure série : ${longestStreak} jour${longestStreak > 1 ? 's' : ''}`);
        lines.push("");

        if (completedChapters.length > 0) {
          lines.push("Chapitres complétés :");
          for (const c of completedChapters) {
            const date = new Date(c.completedAt).toLocaleDateString('fr-FR');
            lines.push(`  ✓ ${c.chapterId} — ${date}`);
          }
          lines.push("");
        }

        // Notes section, organized by chapter
        if (notes.length > 0) {
          lines.push("───────────────────────────────────────────");
          lines.push("  Notes personnelles");
          lines.push("───────────────────────────────────────────");
          lines.push("");

          // Group notes by chapterId
          const byChapter = new Map<string, NoteData[]>();
          for (const note of notes) {
            const list = byChapter.get(note.chapterId) ?? [];
            list.push(note);
            byChapter.set(note.chapterId, list);
          }

          for (const [chapterId, chapterNotes] of byChapter) {
            lines.push(`◆ ${chapterId}`);
            for (const note of chapterNotes) {
              const date = new Date(note.updatedAt).toLocaleDateString('fr-FR');
              lines.push(`  [${note.fieldId}] (${date})`);
              lines.push(`  ${note.content}`);
              lines.push("");
            }
          }
        }

        lines.push("═══════════════════════════════════════════");
        lines.push(`Exporté le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`);
        lines.push("═══════════════════════════════════════════");

        return lines.join('\n');
      },

      // ── Daily Inspiration Actions ──────────────────────────────

      dismissDailyInspiration: () => {
        set({ dailyInspirationDismissed: getTodayDateString() });
      },

      isDailyInspirationDismissed: () => {
        return get().dailyInspirationDismissed === getTodayDateString();
      },

      // ── Streak Actions ─────────────────────────────────────────

      recordActivity: () => {
        const { lastActivityDate, currentStreak, longestStreak } = get();
        const today = getTodayDateString();
        const yesterday = getYesterdayDateString();

        // Already recorded today
        if (lastActivityDate === today) return;

        // Continue streak (was active yesterday)
        if (lastActivityDate === yesterday) {
          const newStreak = currentStreak + 1;
          set({
            lastActivityDate: today,
            currentStreak: newStreak,
            longestStreak: Math.max(longestStreak, newStreak),
          });
        } else {
          // Streak broken or first activity — start new streak
          set({
            lastActivityDate: today,
            currentStreak: 1,
            longestStreak: Math.max(longestStreak, 1),
          });
        }
      },

      // ── Onboarding Actions ────────────────────────────────────────

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      // ── Search History Actions ─────────────────────────────────────

      addRecentSearch: (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => {
          // Remove duplicate if exists, then prepend
          const filtered = state.recentSearches.filter(
            (s) => s.toLowerCase() !== trimmed.toLowerCase()
          );
          return {
            recentSearches: [trimmed, ...filtered].slice(0, 5),
          };
        });
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },
    }),
    {
      name: 'alchimie-du-miroir',
      // Only persist these fields — exclude transient UI state
      partialize: (state) => ({
        currentView: state.currentView,
        currentChapterId: state.currentChapterId,
        fontSize: state.fontSize,
        completedChapters: state.completedChapters,
        notes: state.notes,
        bookmarks: state.bookmarks,
        chatMessages: state.chatMessages,
        dailyInspirationDismissed: state.dailyInspirationDismissed,
        lastActivityDate: state.lastActivityDate,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        journalEntries: state.journalEntries,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        recentSearches: state.recentSearches,
      }),
    }
  )
);
