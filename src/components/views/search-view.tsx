'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { allChapters, siteContent } from '@/data/chapters'
import type { Chapter } from '@/data/chapters'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, ArrowLeft, BookOpen } from 'lucide-react'

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

function searchChapter(chapter: Chapter, query: string): SearchResult[] {
  const results: SearchResult[] = []
  const q = query.toLowerCase()

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
  if (chapter.title.toLowerCase().includes(q)) {
    addResult('title', chapter.title, `Chapitre ${chapter.number}`)
  }

  // Subtitle
  if (chapter.subtitle.toLowerCase().includes(q)) {
    addResult('subtitle', chapter.subtitle, chapter.title)
  }

  // Arabic verse
  if (chapter.arabicVerse && chapter.arabicVerse.includes(query)) {
    addResult('arabic', chapter.arabicVerse.slice(0, 80) + (chapter.arabicVerse.length > 80 ? '...' : ''), 'Verset arabe')
  }

  // Translation
  if (chapter.translation && chapter.translation.toLowerCase().includes(q)) {
    addResult('translation', chapter.translation.slice(0, 120) + (chapter.translation.length > 120 ? '...' : ''), 'Traduction')
  }

  // Word analysis
  for (const w of chapter.wordAnalysis) {
    if (w.literalMeaning.toLowerCase().includes(q)) {
      addResult('translation', `${w.transliteration}: ${w.literalMeaning}`, 'Analyse de mot')
    }
    if (w.mirrorDimension.toLowerCase().includes(q)) {
      addResult('mirror', w.mirrorDimension.slice(0, 120), `Dimension miroir de ${w.transliteration}`)
    }
  }

  // Mirror questions
  for (const mq of chapter.mirrorQuestions) {
    if (mq.question.toLowerCase().includes(q)) {
      addResult('mirror', mq.question, 'Question miroir')
    }
    if (mq.meditation.toLowerCase().includes(q)) {
      addResult('mirror', mq.meditation.slice(0, 120), 'Méditation')
    }
  }

  // Coherence points
  if (chapter.coherencePoints) {
    for (const cp of chapter.coherencePoints) {
      if (cp.toLowerCase().includes(q)) {
        addResult('coherence', cp.slice(0, 120), 'Point de cohérence')
      }
    }
  }

  // Bullet points
  if (chapter.bulletPoints) {
    for (const bp of chapter.bulletPoints) {
      if (bp.toLowerCase().includes(q)) {
        addResult('bullet', bp.slice(0, 120), 'Point clé')
      }
    }
  }

  // Callouts
  if (chapter.callouts) {
    for (const c of chapter.callouts) {
      if (c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q)) {
        addResult('callout', `${c.title}: ${c.content.slice(0, 80)}`, `Encadré ${c.type}`)
      }
    }
  }

  // Treasures
  if (chapter.treasuresList) {
    for (const t of chapter.treasuresList) {
      if (t.toLowerCase().includes(q)) {
        addResult('treasure', t.slice(0, 120), 'Trésor')
      }
    }
  }

  // Metaphor table
  if (chapter.metaphorTable) {
    for (const m of chapter.metaphorTable) {
      if (m.element.toLowerCase().includes(q) || m.metaphor.toLowerCase().includes(q) || m.interpretation.toLowerCase().includes(q)) {
        addResult('metaphor', `${m.element} → ${m.metaphor}`, 'Métaphore')
      }
    }
  }

  // Munajat prompts
  for (const mp of chapter.munajatPrompts) {
    if (mp.toLowerCase().includes(q)) {
      addResult('munajat', mp, 'Munajat')
    }
  }

  // Exercises
  for (const ex of chapter.exercises) {
    if (ex.question.toLowerCase().includes(q)) {
      addResult('exercise', ex.question.slice(0, 120), 'Exercice')
    }
  }

  // Extra sections
  if (chapter.extraSections) {
    for (const es of chapter.extraSections) {
      if (es.title.toLowerCase().includes(q) || es.translation.toLowerCase().includes(q) || es.commentary.toLowerCase().includes(q)) {
        addResult('extra', `${es.title}: ${es.translation.slice(0, 80)}`, 'Section supplémentaire')
      }
    }
  }

  // Comparison table
  if (chapter.comparisonTable) {
    for (const row of chapter.comparisonTable.rows) {
      for (const cell of row) {
        if (cell.toLowerCase().includes(q)) {
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
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-amber-200/60 dark:bg-amber-800/40 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export function SearchView() {
  const navigate = useAppStore((s) => s.navigate)
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return []

    const allResults: SearchResult[] = []
    for (const chapter of allChapters) {
      const chapterResults = searchChapter(chapter, query.trim())
      allResults.push(...chapterResults)
    }
    return allResults
  }, [query])

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

      {/* Search input */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher dans les chapitres, versets, exercices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-base border-amber-200/50 dark:border-amber-800/30 focus-visible:ring-amber-500/30"
            autoFocus
          />
        </div>
        {query.trim().length >= 2 && (
          <p className="text-sm text-muted-foreground">
            {results.length} résultat{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
          </p>
        )}
      </motion.div>

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
                transition={{ delay: groupIdx * 0.05 }}
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
                    <Card
                      key={`${chapterId}-${idx}`}
                      className="cursor-pointer hover:border-amber-300/50 dark:hover:border-amber-700/50 transition-colors"
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
            <div className="text-4xl mb-4">🪞</div>
            <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Essayez avec d'autres mots-clés. Par exemple : &laquo; miséricorde &raquo;, &laquo; Bismillah &raquo;, &laquo; chemin droit &raquo;...
            </p>
            <p className="text-xs text-muted-foreground/60 mt-6 italic">
              &laquo; Celui qui cherche, trouve. Celui qui frappe, on lui ouvrira. &raquo;
            </p>
          </motion.div>
        ) : query.trim().length < 2 ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Rechercher</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Tapez au moins 2 caractères pour rechercher dans les titres, versets, traductions,
              exercices et plus encore.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
