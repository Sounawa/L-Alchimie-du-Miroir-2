import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewType = 'cover' | 'toc' | 'intro' | 'chapter' | 'progress' | 'search' | 'glossary' | 'journal' | 'settings' | 'tasbih' | 'bookmarks' | 'memorization' | 'reading-plan' | 'comparison';

type FontFamily = 'system' | 'serif' | 'reading';
type ReadingMode = 'normal' | 'focus' | 'soothing';

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

  // Font & Reading
  fontFamily: FontFamily;
  readingMode: ReadingMode;

  // Tasbih
  tasbihCount: number;
  tasbihTarget: number;
  tasbihDhikr: string;

  // Study reminder
  reminderDismissedDate: string; // ISO date string

  // Memorization progress
  memorizationProgress: Record<string, { level: string; bestScore: number; attempts: number }>;

  // Reading plan
  selectedPlan: string | null;
  planStartDate: string | null; // ISO date string

  // Word of the day
  wordOfDayDismissed: string; // ISO date string of when it was last dismissed

  // Du'a of the day
  duaOfDayDismissed: string; // ISO date string of when it was last dismissed

  // Keyboard shortcuts overlay (transient - not persisted)
  showShortcuts: boolean;

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

  // Font & Reading actions
  setFontFamily: (font: FontFamily) => void;
  setReadingMode: (mode: ReadingMode) => void;

  // Tasbih actions
  incrementTasbih: () => void;
  resetTasbih: () => void;
  setTasbihTarget: (target: number) => void;
  setTasbihDhikr: (dhikr: string) => void;

  // Study reminder actions
  dismissReminder: () => void;
  isReminderDismissed: () => boolean;

  // Memorization actions
  updateMemorizationProgress: (chapterId: string, level: string, score: number) => void;

  // Reading plan actions
  selectPlan: (planId: string) => void;
  clearPlan: () => void;

  // Word of the day actions
  dismissWordOfDay: () => void;
  isWordOfDayDismissed: () => boolean;

  // Du'a of the day actions
  dismissDuaOfDay: () => void;
  isDuaOfDayDismissed: () => boolean;

  // Keyboard shortcuts overlay actions
  toggleShortcuts: () => void;

  // Hash routing actions
  syncFromHash: () => void;
  syncToHash: () => void;

  // Data export/import
  exportAllData: () => string;
  importData: (jsonString: string) => boolean;
  resetAllData: () => void;
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

      // ── Font & Reading ──────────────────────────────────────────
      fontFamily: 'system',
      readingMode: 'normal',

      // ── Tasbih ──────────────────────────────────────────────────
      tasbihCount: 0,
      tasbihTarget: 33,
      tasbihDhikr: 'subhanallah',

      // ── Study Reminder ──────────────────────────────────────────
      reminderDismissedDate: '',

      // ── Memorization Progress ──────────────────────────────────────
      memorizationProgress: {},

      // ── Reading Plan ────────────────────────────────────────────────
      selectedPlan: null,
      planStartDate: null,

      // ── Word of the Day ─────────────────────────────────────────────
      wordOfDayDismissed: '',

      // ── Du'a of the Day ─────────────────────────────────────────────
      duaOfDayDismissed: '',

      // ── Keyboard Shortcuts Overlay ────────────────────────────────
      showShortcuts: false,

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

      // ── Font & Reading Actions ─────────────────────────────────

      setFontFamily: (font: FontFamily) => {
        set({ fontFamily: font });
      },

      setReadingMode: (mode: ReadingMode) => {
        set({ readingMode: mode });
      },

      // ── Tasbih Actions ─────────────────────────────────────────

      incrementTasbih: () => {
        set((state) => ({ tasbihCount: state.tasbihCount + 1 }));
      },

      resetTasbih: () => {
        set({ tasbihCount: 0 });
      },

      setTasbihTarget: (target: number) => {
        set({ tasbihTarget: target, tasbihCount: 0 });
      },

      setTasbihDhikr: (dhikr: string) => {
        set({ tasbihDhikr: dhikr, tasbihCount: 0 });
      },

      // ── Study Reminder Actions ──────────────────────────────────

      dismissReminder: () => {
        set({ reminderDismissedDate: getTodayDateString() });
      },

      isReminderDismissed: () => {
        return get().reminderDismissedDate === getTodayDateString();
      },

      // ── Memorization Actions ────────────────────────────────────

      updateMemorizationProgress: (chapterId: string, level: string, score: number) => {
        set((state) => {
          const current = state.memorizationProgress[chapterId]
          return {
            memorizationProgress: {
              ...state.memorizationProgress,
              [chapterId]: {
                level,
                bestScore: current ? Math.max(current.bestScore, score) : score,
                attempts: current ? current.attempts + 1 : 1,
              },
            },
          }
        })
      },

      // ── Reading Plan Actions ────────────────────────────────────────

      selectPlan: (planId: string) => {
        set({
          selectedPlan: planId,
          planStartDate: getTodayDateString(),
        });
      },

      clearPlan: () => {
        set({ selectedPlan: null, planStartDate: null });
      },

      // ── Word of the Day Actions ─────────────────────────────────────

      dismissWordOfDay: () => {
        set({ wordOfDayDismissed: getTodayDateString() });
      },

      isWordOfDayDismissed: () => {
        return get().wordOfDayDismissed === getTodayDateString();
      },

      // ── Du'a of the Day Actions ─────────────────────────────────────

      dismissDuaOfDay: () => {
        set({ duaOfDayDismissed: getTodayDateString() });
      },

      isDuaOfDayDismissed: () => {
        return get().duaOfDayDismissed === getTodayDateString();
      },

      // ── Keyboard Shortcuts Overlay Actions ────────────────────────

      toggleShortcuts: () => {
        set((state) => ({ showShortcuts: !state.showShortcuts }));
      },

      // ── Hash Routing Actions ──────────────────────────────────────

      syncFromHash: () => {
        if (typeof window === 'undefined') return;
        // Strip leading '#' and optional '/' to handle both #/chapter/b1 and #chapter/b1
        const hash = window.location.hash.replace(/^#\/?/, '');
        if (!hash) return;

        // Parse hash format: "toc", "chapter/c1", "progress", "glossary", etc.
        const validViews: ViewType[] = ['cover', 'toc', 'intro', 'chapter', 'progress', 'search', 'glossary', 'journal', 'settings', 'tasbih', 'bookmarks', 'memorization', 'reading-plan', 'comparison'];

        if (hash.startsWith('chapter/')) {
          const chapterId = hash.replace('chapter/', '');
          set({ currentView: 'chapter', currentChapterId: chapterId });
        } else if (validViews.includes(hash as ViewType)) {
          set({ currentView: hash as ViewType, currentChapterId: null });
        }
      },

      syncToHash: () => {
        if (typeof window === 'undefined') return;
        const { currentView, currentChapterId } = get();
        let newHash = '';

        if (currentView === 'chapter' && currentChapterId) {
          newHash = `#/chapter/${currentChapterId}`;
        } else {
          newHash = `#/${currentView}`;
        }

        // Only update if different to avoid infinite loops
        if (window.location.hash !== newHash) {
          window.history.replaceState(null, '', newHash);
        }
      },

      // ── Data Export/Import Actions ──────────────────────────────

      exportAllData: () => {
        const state = get();
        const exportData = {
          _meta: {
            app: "L'Alchimie du Miroir",
            version: '2.0',
            exportedAt: new Date().toISOString(),
          },
          notes: state.notes.map((n) => ({
            ...n,
            chapterId: n.chapterId,
          })),
          completedChapters: state.completedChapters,
          journalEntries: state.journalEntries,
          bookmarks: state.bookmarks,
          settings: {
            fontSize: state.fontSize,
            fontFamily: state.fontFamily,
            readingMode: state.readingMode,
            tasbihTarget: state.tasbihTarget,
            tasbihDhikr: state.tasbihDhikr,
            tasbihCount: state.tasbihCount,
          },
        };
        return JSON.stringify(exportData, null, 2);
      },

      importData: (jsonString: string): boolean => {
        try {
          const data = JSON.parse(jsonString);
          if (!data._meta || data._meta.app !== "L'Alchimie du Miroir") {
            return false;
          }
          const updates: Partial<AppState> = {};
          if (Array.isArray(data.notes)) updates.notes = data.notes;
          if (Array.isArray(data.completedChapters)) updates.completedChapters = data.completedChapters;
          if (Array.isArray(data.journalEntries)) updates.journalEntries = data.journalEntries;
          if (Array.isArray(data.bookmarks)) updates.bookmarks = data.bookmarks;
          if (data.settings) {
            if (data.settings.fontSize) updates.fontSize = data.settings.fontSize;
            if (data.settings.fontFamily) updates.fontFamily = data.settings.fontFamily;
            if (data.settings.readingMode) updates.readingMode = data.settings.readingMode;
            if (data.settings.tasbihTarget) updates.tasbihTarget = data.settings.tasbihTarget;
            if (data.settings.tasbihDhikr) updates.tasbihDhikr = data.settings.tasbihDhikr;
            if (typeof data.settings.tasbihCount === 'number') updates.tasbihCount = data.settings.tasbihCount;
          }
          set(updates);
          return true;
        } catch {
          return false;
        }
      },

      resetAllData: () => {
        set({
          currentView: 'cover',
          currentChapterId: null,
          previousView: null,
          fontSize: 16,
          fontFamily: 'system',
          readingMode: 'normal',
          completedChapters: [],
          notes: [],
          bookmarks: [],
          chatMessages: [],
          dailyInspirationDismissed: '',
          lastActivityDate: '',
          currentStreak: 0,
          longestStreak: 0,
          journalEntries: [],
          hasCompletedOnboarding: true,
          recentSearches: [],
          tasbihCount: 0,
          tasbihTarget: 33,
          tasbihDhikr: 'subhanallah',
          sidebarOpen: false,
          chatOpen: false,
          searchQuery: '',
          reminderDismissedDate: '',
          memorizationProgress: {},
          selectedPlan: null,
          planStartDate: null,
          wordOfDayDismissed: '',
          duaOfDayDismissed: '',
          showShortcuts: false,
        });
      },
    }),
    {
      name: 'alchimie-du-miroir',
      // Only persist these fields — exclude transient UI state
      partialize: (state) => ({
        currentView: state.currentView,
        currentChapterId: state.currentChapterId,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        readingMode: state.readingMode,
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
        tasbihCount: state.tasbihCount,
        tasbihTarget: state.tasbihTarget,
        tasbihDhikr: state.tasbihDhikr,
        reminderDismissedDate: state.reminderDismissedDate,
        memorizationProgress: state.memorizationProgress,
        selectedPlan: state.selectedPlan,
        planStartDate: state.planStartDate,
        wordOfDayDismissed: state.wordOfDayDismissed,
        duaOfDayDismissed: state.duaOfDayDismissed,
      }),
    }
  )
);
