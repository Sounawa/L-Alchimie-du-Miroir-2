'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  PenLine,
  Search,
  Plus,
  Trash2,
  Pencil,
  X,
  Sparkles,
  Calendar,
} from 'lucide-react'

type JournalEntry = {
  id: string
  title: string
  content: string
  mood: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

const moods = [
  { emoji: '😊', label: 'Joyeux' },
  { emoji: '😌', label: 'Serein' },
  { emoji: '🤔', label: 'Réflexif' },
  { emoji: '😢', label: 'Triste' },
  { emoji: '🙏', label: 'Reconnaissant' },
]

const spiritualQuotes = [
  { text: '« Celui qui se connaît lui-même, connaît son Seigneur. »', source: 'Sagesse soufie' },
  { text: '« Le souvenir de Dieu est la plus grande des œuvres. »', source: 'Coran 29:45' },
  { text: '« La connaissance de soi est la clé de toute sagesse. »', source: 'Al-Ghazali' },
  { text: '« Chaque souffle est une occasion de revenir à Dieu. »', source: 'Ibn Ata Allah' },
  { text: '« Le cœur qui se souvient ne se perd jamais. »', source: 'Proverbe spirituel' },
  { text: '« La meilleure des œuvres est celle que ton cœur accepte avec sincérité. »', source: 'Sagesse soufie' },
  { text: '« Qui cherche sincèrement, trouve inévitablement. »', source: 'Ibn Arabi' },
  { text: '« La porte de la miséricorde est ouverte à quiconque frappe avec le cœur. »', source: 'Hadith Qudsi' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
}

function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function JournalView() {
  const navigate = useAppStore((s) => s.navigate)
  const journalEntries = useAppStore((s) => s.journalEntries)
  const addJournalEntry = useAppStore((s) => s.addJournalEntry)
  const updateJournalEntry = useAppStore((s) => s.updateJournalEntry)
  const deleteJournalEntry = useAppStore((s) => s.deleteJournalEntry)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterMood, setFilterMood] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formMood, setFormMood] = useState('😌')
  const [formTags, setFormTags] = useState('')

  // Get today's quote based on day of year
  const todayQuote = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    )
    return spiritualQuotes[dayOfYear % spiritualQuotes.length]
  }, [])

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let entries = [...journalEntries]

    // Filter by mood
    if (filterMood) {
      entries = entries.filter((e) => e.mood === filterMood)
    }

    // Filter by search text
    if (searchQuery.trim()) {
      const q = normalizeForSearch(searchQuery.trim())
      entries = entries.filter(
        (e) =>
          normalizeForSearch(e.title).includes(q) ||
          normalizeForSearch(e.content).includes(q) ||
          e.tags.some((t) => normalizeForSearch(t).includes(q))
      )
    }

    // Sort by newest first
    entries.sort((a, b) => b.createdAt - a.createdAt)

    return entries
  }, [journalEntries, filterMood, searchQuery])

  // Mood counts for filter buttons
  const moodCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const entry of journalEntries) {
      counts.set(entry.mood, (counts.get(entry.mood) || 0) + 1)
    }
    return counts
  }, [journalEntries])

  const openNewEntryDialog = useCallback(() => {
    setEditingEntry(null)
    setFormTitle('')
    setFormContent('')
    setFormMood('😌')
    setFormTags('')
    setDialogOpen(true)
  }, [])

  const openEditDialog = useCallback((entry: JournalEntry) => {
    setEditingEntry(entry)
    setFormTitle(entry.title)
    setFormContent(entry.content)
    setFormMood(entry.mood)
    setFormTags(entry.tags.join(', '))
    setDialogOpen(true)
  }, [])

  const handleSave = useCallback(() => {
    if (!formTitle.trim() && !formContent.trim()) return

    const tags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (editingEntry) {
      updateJournalEntry(editingEntry.id, {
        title: formTitle.trim() || 'Sans titre',
        content: formContent.trim(),
        mood: formMood,
        tags,
      })
    } else {
      addJournalEntry({
        title: formTitle.trim() || 'Sans titre',
        content: formContent.trim(),
        mood: formMood,
        tags,
      })
    }

    setDialogOpen(false)
  }, [editingEntry, formTitle, formContent, formMood, formTags, addJournalEntry, updateJournalEntry])

  const handleDelete = useCallback(
    (id: string) => {
      deleteJournalEntry(id)
    },
    [deleteJournalEntry]
  )

  let sectionIndex = 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back button */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('toc')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="mt-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <PenLine className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Journal spirituel</h1>
              <p className="text-sm text-muted-foreground">
                Vos réflexions et méditations personnelles
              </p>
            </div>
          </div>
          <Button
            onClick={openNewEntryDialog}
            className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-800"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Ajouter une entrée
          </Button>
        </div>
      </motion.div>

      {/* Inspirational quote */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-amber-200/40 dark:border-amber-800/20 bg-gradient-to-r from-amber-50/60 via-amber-50/30 to-amber-100/40 dark:from-amber-950/20 dark:via-amber-950/10 dark:to-amber-900/20 mb-6">
          <CardContent className="py-4 px-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm italic text-amber-900 dark:text-amber-200/80 leading-relaxed">
                  {todayQuote.text}
                </p>
                <p className="text-[11px] text-amber-700/60 dark:text-amber-400/50 mt-1">
                  — {todayQuote.source}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and filter */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher dans vos entrées..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 border-amber-200/50 dark:border-amber-800/30 focus-visible:ring-amber-500/30"
          />
        </div>

        {/* Mood filter */}
        {journalEntries.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground mr-1">Filtrer :</span>
            <button
              onClick={() => setFilterMood(null)}
              className={`
                rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150
                ${!filterMood
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 ring-1 ring-amber-300 dark:ring-amber-700'
                  : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                }
              `}
            >
              Tous
            </button>
            {moods.map((mood) => {
              const count = moodCounts.get(mood.emoji) || 0
              if (count === 0) return null
              return (
                <button
                  key={mood.emoji}
                  onClick={() => setFilterMood(filterMood === mood.emoji ? null : mood.emoji)}
                  className={`
                    rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150 flex items-center gap-1
                    ${filterMood === mood.emoji
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 ring-1 ring-amber-300 dark:ring-amber-700'
                      : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                    }
                  `}
                >
                  <span>{mood.emoji}</span>
                  <span>{count}</span>
                </button>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Entries list */}
      <AnimatePresence mode="wait">
        {filteredEntries.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            {journalEntries.length === 0 ? (
              <>
                <motion.div
                  animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block"
                >
                  <div className="text-6xl mb-4">📝</div>
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">Votre journal est vide</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                  Commencez à écrire vos réflexions spirituelles, vos méditations et vos prières. Chaque entrée est un pas vers une meilleure compréhension de vous-même.
                </p>
                <Button
                  onClick={openNewEntryDialog}
                  className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-800"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Écrire votre première entrée
                </Button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold mb-1">Aucune entrée trouvée</h3>
                <p className="text-sm text-muted-foreground">
                  Essayez un autre filtre ou terme de recherche.
                </p>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="entries"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredEntries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3, ease: 'easeOut' }}
                layout
              >
                <Card className="border-amber-200/40 dark:border-amber-800/20 hover:border-amber-300/60 dark:hover:border-amber-700/40 transition-colors hover:shadow-sm hover:shadow-amber-100/30 dark:hover:shadow-amber-900/10 group">
                  <CardContent className="py-4 px-4">
                    <div className="flex items-start gap-3">
                      {/* Mood emoji */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30 text-xl">
                        {entry.mood}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm text-foreground leading-tight">
                            {entry.title}
                          </h3>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400"
                              onClick={() => openEditDialog(entry)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
                              onClick={() => handleDelete(entry.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Content preview */}
                        {entry.content && (
                          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed whitespace-pre-line">
                            {entry.content}
                          </p>
                        )}

                        {/* Tags + Date */}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(entry.createdAt)}
                          </span>
                          {entry.tags.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              {entry.tags.slice(0, 4).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-[10px] h-5 px-1.5 border-0 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {entry.tags.length > 4 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{entry.tags.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              {editingEntry ? 'Modifier l\'entrée' : 'Nouvelle entrée'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Titre
              </label>
              <Input
                placeholder="Donnez un titre à votre réflexion..."
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="border-amber-200/50 dark:border-amber-800/30 focus-visible:ring-amber-500/30"
              />
            </div>

            {/* Mood selector */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Humeur
              </label>
              <div className="flex items-center gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.emoji}
                    type="button"
                    onClick={() => setFormMood(mood.emoji)}
                    className={`
                      flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all duration-150
                      ${formMood === mood.emoji
                        ? 'bg-amber-100 dark:bg-amber-900/40 ring-2 ring-amber-400 dark:ring-amber-600 scale-110'
                        : 'bg-stone-50 dark:bg-stone-800/50 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                      }
                    `}
                    title={mood.label}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span className="text-[9px] text-muted-foreground">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Contenu
              </label>
              <Textarea
                placeholder="Écrivez votre réflexion, méditation ou prière..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                rows={6}
                className="border-amber-200/50 dark:border-amber-800/30 focus-visible:ring-amber-500/30 resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Tags <span className="text-muted-foreground font-normal">(séparés par des virgules)</span>
              </label>
              <Input
                placeholder="gratitude, prière, Fatiha..."
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                className="border-amber-200/50 dark:border-amber-800/30 focus-visible:ring-amber-500/30"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formTitle.trim() && !formContent.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-800"
            >
              {editingEntry ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
