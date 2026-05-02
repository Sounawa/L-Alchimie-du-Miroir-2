import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewType = 'cover' | 'toc' | 'intro' | 'chapter' | 'progress' | 'search';

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

  // Actions
  navigate: (view: ViewType, chapterId?: string | null) => void;
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
}

const TOTAL_CHAPTERS = 17; // A1-A7 + B1-B10

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Navigation ──────────────────────────────────────────────
      currentView: 'cover',
      currentChapterId: null,

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

      // ── Actions ─────────────────────────────────────────────────

      navigate: (view: ViewType, chapterId?: string | null) => {
        set({
          currentView: view,
          currentChapterId: chapterId ?? null,
        });
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

      getProgressPercentage: () => {
        const completed = get().completedChapters.length;
        return Math.round((completed / TOTAL_CHAPTERS) * 100);
      },

      exportNotes: () => {
        const { notes, completedChapters } = get();

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
      }),
    }
  )
);
