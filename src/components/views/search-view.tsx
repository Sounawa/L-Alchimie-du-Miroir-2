'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters, siteContent } from '@/data/chapters'
import type { Chapter } from '@/data/chapters'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, ArrowLeft, BookOpen, Keyboard, Sparkles, X, Clock, Filter } from 'lucide-react'

interface SearchResult {
  chapterId: string
  chapterNumber: string
  chapterTitle: string
  chapterPart: string
  matchType: 'title' | 'subtitle' | 'arabic' | 'translation' | 'exercise' | 'mirror' | 'coherence' | 'bullet' | 'callout' | 'treasure' | 'metaphor' | 'munajat' | 'extra'
  matchText: string
  matchContext: string
}

const matchTypeLabels: Record<SearchResult['matchType'], string> = {
  title: 'Titre',
  subtitle: 'Sous-titre',
  arabic: 'Verset arabe',
  translation: 'Traduction',
  exercise: 'Exercice',
  mirror: 'Question miroir',
  coherence: 'Cohérence',
  bullet: 'Point clé',
  callout: 'Encadré',
  treasure: 'Trésor',
  metaphor: 'Métaphore',
  munajat: 'Munajat',
  extra: 'Section supplémentaire',
}

const matchTypeColors: Record<SearchResult['matchType'], string> = {
  title: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  subtitle: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  arabic: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  translation: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  exercise: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  mirror: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  coherence: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  bullet: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  callout: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  treasure: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  metaphor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  munajat: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  extra: 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300',
}

function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics for accent-insensitive search
}

function searchChapter(chapter: Chapter, query: string): SearchResult[] {
  const results: SearchResult[] = []
  const q = normalizeForSearch(query)

  const addResult = (matchType: SearchResult['matchType'], matchText: string, matchContext: string) => {
    results.push({
      chapterId: chapter.id,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
      chapterPart: chapter.part,
      matchType,
      matchText,
      matchContext,
    })
  }

  // Title
  if (normalizeForSearch(chapter.title).includes(q)) {
    addResult('title', chapter.title, `Chapitre ${chapter.number}`)
  }

  // Subtitle
  if (normalizeForSearch(chapter.subtitle).includes(q)) {
    addResult('subtitle', chapter.subtitle, chapter.title)
  }

  // Arabic verse
  if (chapter.arabicVerse && chapter.arabicVerse.includes(query)) {
    addResult('arabic', chapter.arabicVerse.slice(0, 80) + (chapter.arabicVerse.length > 80 ? '...' : ''), 'Verset arabe')
  }

  // Translation
  if (chapter.translation && normalizeForSearch(chapter.translation).includes(q)) {
    addResult('translation', chapter.translation.slice(0, 120) + (chapter.translation.length > 120 ? '...' : ''), 'Traduction')
  }

  // Word analysis
  for (const w of chapter.wordAnalysis) {
    if (normalizeForSearch(w.literalMeaning).includes(q)) {
      addResult('translation', `${w.transliteration}: ${w.literalMeaning}`, 'Analyse de mot')
    }
    if (normalizeForSearch(w.mirrorDimension).includes(q)) {
      addResult('mirror', w.mirrorDimension.slice(0, 120), `Dimension miroir de ${w.transliteration}`)
    }
  }

  // Mirror questions
  for (const mq of chapter.mirrorQuestions) {
    if (normalizeForSearch(mq.question).includes(q)) {
      addResult('mirror', mq.question, 'Question miroir')
    }
    if (normalizeForSearch(mq.meditation).includes(q)) {
      addResult('mirror', mq.meditation.slice(0, 120), 'Méditation')
    }
  }

  // Coherence points
  if (chapter.coherencePoints) {
    for (const cp of chapter.coherencePoints) {
      if (normalizeForSearch(cp).includes(q)) {
        addResult('coherence', cp.slice(0, 120), 'Point de cohérence')
      }
    }
  }

  // Bullet points
  if (chapter.bulletPoints) {
    for (const bp of chapter.bulletPoints) {
      if (normalizeForSearch(bp).includes(q)) {
        addResult('bullet', bp.slice(0, 120), 'Point clé')
      }
    }
  }

  // Callouts
  if (chapter.callouts) {
    for (const c of chapter.callouts) {
      if (normalizeForSearch(c.title).includes(q) || normalizeForSearch(c.content).includes(q)) {
        addResult('callout', `${c.title}: ${c.content.slice(0, 80)}`, `Encadré ${c.type}`)
      }
    }
  }

  // Treasures
  if (chapter.treasuresList) {
    for (const t of chapter.treasuresList) {
      if (normalizeForSearch(t).includes(q)) {
        addResult('treasure', t.slice(0, 120), 'Trésor')
      }
    }
  }

  // Metaphor table
  if (chapter.metaphorTable) {
    for (const m of chapter.metaphorTable) {
      if (normalizeForSearch(m.element).includes(q) || normalizeForSearch(m.metaphor).includes(q) || normalizeForSearch(m.interpretation).includes(q)) {
        addResult('metaphor', `${m.element} → ${m.metaphor}`, 'Métaphore')
      }
    }
  }

  // Munajat prompts
  for (const mp of chapter.munajatPrompts) {
    if (normalizeForSearch(mp).includes(q)) {
      addResult('munajat', mp, 'Munajat')
    }
  }

  // Exercises
  for (const ex of chapter.exercises) {
    if (normalizeForSearch(ex.question).includes(q)) {
      addResult('exercise', ex.question.slice(0, 120), 'Exercice')
    }
  }

  // Extra sections
  if (chapter.extraSections) {
    for (const es of chapter.extraSections) {
      if (normalizeForSearch(es.title).includes(q) || normalizeForSearch(es.translation).includes(q) || normalizeForSearch(es.commentary).includes(q)) {
        addResult('extra', `${es.title}: ${es.translation.slice(0, 80)}`, 'Section supplémentaire')
      }
    }
  }

  // Comparison table
  if (chapter.comparisonTable) {
    for (const row of chapter.comparisonTable.rows) {
      for (const cell of row) {
        if (normalizeForSearch(cell).includes(q)) {
          addResult('translation', cell.slice(0, 120), `Table: ${chapter.comparisonTable!.headers[0]}`)
          break
        }
      }
    }
  }

  return results
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  // Use normalized version for matching to handle accents
  const normalizedText = normalizeForSearch(text)
  const normalizedQuery = normalizeForSearch(query)

  // Build result by matching on normalized text but slicing from original
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  // Reset regex
  const searchRegex = new RegExp(normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')

  while ((match = searchRegex.exec(normalizedText)) !== null) {
    const start = match.index
    const end = start + match[0].length

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start))
    }
    parts.push(
      <mark key={start} className="bg-amber-200/60 dark:bg-amber-800/40 rounded px-0.5 search-match-underline">
        {text.slice(start, end)}
      </mark>
    )
    lastIndex = end
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? <>{parts}</> : text
}

export function SearchView() {
  const navigate = useAppStore((s) => s.navigate)
  const recentSearches = useAppStore((s) => s.recentSearches)
  const addRecentSearch = useAppStore((s) => s.addRecentSearch)
  const clearRecentSearches = useAppStore((s) => s.clearRecentSearches)
  const [query, setQuery] = useState('')
  const [partFilter, setPartFilter] = useState<string>('all')
  const inputRef = useState<React.RefObject<HTMLInputElement | null>>({ current: null })

  // Keyboard shortcut: Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const results = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return []

    const allResults: SearchResult[] = []
    for (const chapter of allChapters) {
      // Apply part filter
      if (partFilter !== 'all' && chapter.part !== partFilter) continue
      const chapterResults = searchChapter(chapter, query.trim())
      allResults.push(...chapterResults)
    }
    return allResults
  }, [query, partFilter])

  // Group results by chapter
  const groupedResults = useMemo(() => {
    const groups = new Map<string, SearchResult[]>()
    for (const r of results) {
      const key = r.chapterId
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(r)
    }
    return groups
  }, [results])

  const partLabel = (part: string) => {
    switch (part) {
      case 'A': return 'Partie A'
      case 'B': return 'Partie B'
      case 'C': return 'Partie C'
      default: return part
    }
  }

  let sectionIndex = 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
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

      {/* Search input with morphing icon */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="space-y-2">
        <div className="relative">
          <motion.div
            animate={query.length > 0 ? { rotate: -10, scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </motion.div>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Rechercher dans les chapitres, versets, exercices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim().length >= 2) {
                addRecentSearch(query.trim())
              }
            }}
            className="pl-10 pr-20 h-12 text-base border-amber-200/50 dark:border-amber-800/30 focus-visible:ring-amber-500/30"
            autoFocus
          />
          {/* Keyboard shortcut hint */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-stone-300 bg-stone-100 px-1.5 py-0.5 text-[10px] font-mono text-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
              <Keyboard className="size-3" /> ⌘K
            </kbd>
          </div>
        </div>
        {/* Category filter chips */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground/50" />
          {[
            { value: 'all', label: 'Toutes' },
            { value: 'A', label: 'Partie A' },
            { value: 'B', label: 'Partie B' },
            { value: 'C', label: 'Partie C' },
          ].map((chip) => (
            <button
              key={chip.value}
              onClick={() => setPartFilter(chip.value)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                partFilter === chip.value
                  ? chip.value === 'A'
                    ? 'border-amber-400 bg-amber-100/60 text-amber-800 dark:border-amber-600 dark:bg-amber-950/30 dark:text-amber-300'
                    : chip.value === 'B'
                      ? 'border-emerald-400 bg-emerald-100/60 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300'
                      : chip.value === 'C'
                        ? 'border-violet-400 bg-violet-100/60 text-violet-800 dark:border-violet-600 dark:bg-violet-950/30 dark:text-violet-300'
                        : 'border-amber-400 bg-amber-100/60 text-amber-800 dark:border-amber-600 dark:bg-amber-950/30 dark:text-amber-300'
                  : 'border-stone-200 bg-stone-50 text-stone-600 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-400 hover:border-amber-300 dark:hover:border-amber-700'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
        {/* Animated results counter */}
        {query.trim().length >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground"
          >
            <motion.span
              key={results.length}
              initial={{ scale: 1.2, color: '#f59e0b' }}
              animate={{ scale: 1, color: 'inherit' }}
              transition={{ duration: 0.3 }}
              className="font-semibold"
            >
              {results.length}
            </motion.span>{' '}
            résultat{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
            {partFilter !== 'all' && <span className="text-amber-600 dark:text-amber-400"> dans Partie {partFilter}</span>}
          </motion.p>
        )}
      </motion.div>

      {/* Recent search history */}
      {query.trim().length < 2 && recentSearches.length > 0 && (
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Recherches récentes</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRecentSearches}
              className="h-6 px-2 text-[10px] text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3 mr-1" />
              Effacer
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => setQuery(search)}
                className="inline-flex items-center gap-1 rounded-full border border-amber-200/60 bg-amber-50/60 px-2.5 py-1 text-xs text-stone-600 transition-colors hover:border-amber-300 hover:bg-amber-100/60 hover:text-amber-700 dark:border-amber-800/30 dark:bg-amber-950/20 dark:text-stone-400 dark:hover:border-amber-700 dark:hover:bg-amber-950/40 dark:hover:text-amber-300"
              >
                <Search className="h-2.5 w-2.5" />
                {search}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {query.trim().length >= 2 && results.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {Array.from(groupedResults.entries()).map(([chapterId, chapterResults], groupIdx) => (
              <motion.div
                key={chapterId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIdx * 0.05, duration: 0.3, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px] border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400">
                    {partLabel(chapterResults[0].chapterPart)}
                  </Badge>
                  <button
                    onClick={() => navigate('chapter', chapterId)}
                    className="text-sm font-semibold hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    {chapterResults[0].chapterNumber} — {chapterResults[0].chapterTitle}
                  </button>
                  <Badge variant="secondary" className="text-[10px] ml-auto">
                    {chapterResults.length} résultat{chapterResults.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {chapterResults.slice(0, 5).map((result, idx) => (
                    <motion.div
                      key={`${chapterId}-${idx}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: groupIdx * 0.05 + idx * 0.03, duration: 0.25, ease: 'easeOut' }}
                    >
                      <Card
                        className="cursor-pointer hover:border-amber-300/50 dark:hover:border-amber-700/50 transition-all hover:shadow-sm hover:shadow-amber-100/30 dark:hover:shadow-amber-900/10"
                        onClick={() => navigate('chapter', chapterId)}
                      >
                        <CardContent className="py-3 px-4">
                          <div className="flex items-start gap-2">
                            <Badge
                              variant="secondary"
                              className={`text-[10px] shrink-0 mt-0.5 border-0 ${matchTypeColors[result.matchType]}`}
                            >
                              {matchTypeLabels[result.matchType]}
                            </Badge>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm leading-relaxed">
                                {highlightMatch(result.matchText, query.trim())}
                              </p>
                              {result.matchContext && (
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {result.matchContext}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  {chapterResults.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      et {chapterResults.length - 5} autre{chapterResults.length - 5 !== 1 ? 's' : ''} résultat{chapterResults.length - 5 !== 1 ? 's' : ''}...
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : query.trim().length >= 2 && results.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              <div className="text-5xl mb-4">🪞</div>
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Essayez avec d&apos;autres mots-clés. Par exemple : &laquo; miséricorde &raquo;, &laquo; Bismillah &raquo;, &laquo; chemin droit &raquo;...
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-50/80 dark:bg-amber-950/20 px-4 py-2">
              <Sparkles className="size-4 text-amber-500" />
              <p className="text-xs text-amber-700 dark:text-amber-300/80 italic">
                &laquo; Celui qui cherche, trouve. Celui qui frappe, on lui ouvrira. &raquo;
              </p>
            </div>
          </motion.div>
        ) : query.trim().length < 2 ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              <Search className="h-12 w-12 mx-auto text-amber-300/50 dark:text-muted-foreground/30 mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Rechercher</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Tapez au moins 2 caractères pour rechercher dans les titres, versets, traductions,
              exercices et plus encore.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['miséricorde', 'Bismillah', 'chemin droit', 'prière'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:border-amber-700 dark:hover:bg-amber-950/30 dark:hover:text-amber-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
