'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { siteContent } from '@/data/chapters'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  ArrowLeft,
  Search,
  BookOpen,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

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

export function GlossaryView() {
  const navigate = useAppStore((s) => s.navigate)
  const [searchQuery, setSearchQuery] = useState('')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const glossary = siteContent.appendices.glossary
  const resources = siteContent.appendices.resources

  // Filter glossary terms based on search
  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return glossary
    const q = normalizeForSearch(searchQuery.trim())
    return glossary.filter(
      (item) =>
        normalizeForSearch(item.term).includes(q) ||
        normalizeForSearch(item.definition).includes(q)
    )
  }, [searchQuery, glossary])

  // Group filtered terms by first letter
  const groupedTerms = useMemo(() => {
    const groups = new Map<string, typeof glossary>()
    for (const item of filteredTerms) {
      const letter = item.term.charAt(0).toUpperCase()
      if (!groups.has(letter)) groups.set(letter, [])
      groups.get(letter)!.push(item)
    }
    // Sort groups alphabetically
    return new Map([...groups.entries()].sort(([a], [b]) => a.localeCompare(b)))
  }, [filteredTerms])

  const letters = useMemo(() => Array.from(groupedTerms.keys()), [groupedTerms])

  // All possible first letters for the sidebar index
  const allLetters = useMemo(() => {
    const letterSet = new Set(glossary.map((item) => item.term.charAt(0).toUpperCase()))
    return Array.from(letterSet).sort()
  }, [glossary])

  const scrollToLetter = useCallback((letter: string) => {
    const el = sectionRefs.current[letter]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  let sectionIndex = 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
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
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="mt-2 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <BookOpen className="h-5 w-5 text-amber-700 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Glossaire</h1>
            <p className="text-sm text-muted-foreground">
              Termes spirituels et concepts clés du programme
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search input */}
      <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filtrer les termes du glossaire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 border-amber-200/50 dark:border-amber-800/30 focus-visible:ring-amber-500/30"
          />
        </div>
        {searchQuery.trim() && (
          <p className="text-xs text-muted-foreground mt-1.5">
            {filteredTerms.length} terme{filteredTerms.length !== 1 ? 's' : ''} trouvé{filteredTerms.length !== 1 ? 's' : ''}
          </p>
        )}
      </motion.div>

      {/* Main content with letter index */}
      <div className="flex gap-4">
        {/* Letter index sidebar - hidden on mobile */}
        <div className="hidden md:flex flex-col items-center gap-1 sticky top-20 self-start shrink-0">
          {allLetters.map((letter) => {
            const isActive = letters.includes(letter)
            return (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                disabled={!isActive}
                className={`
                  w-7 h-7 rounded-md text-xs font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 cursor-pointer'
                    : 'text-muted-foreground/30 dark:text-muted-foreground/20 cursor-default'
                  }
                `}
              >
                {letter}
              </button>
            )
          })}
        </div>

        {/* Terms list */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {filteredTerms.length === 0 ? (
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
                  <div className="text-4xl mb-3">📖</div>
                </motion.div>
                <h3 className="text-lg font-semibold mb-1">Aucun terme trouvé</h3>
                <p className="text-sm text-muted-foreground">
                  Essayez avec un autre mot-clé dans votre recherche.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="glossary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {Array.from(groupedTerms.entries()).map(([letter, items], groupIdx) => (
                  <div
                    key={letter}
                    ref={(el) => { sectionRefs.current[letter] = el }}
                    className="mb-6"
                  >
                    {/* Letter header */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: groupIdx * 0.05, duration: 0.3 }}
                      className="flex items-center gap-2 mb-3"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-bold text-lg">
                        {letter}
                      </span>
                      <Separator className="flex-1" />
                      <Badge variant="secondary" className="text-[10px] border-0 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                        {items.length}
                      </Badge>
                    </motion.div>

                    {/* Terms accordion */}
                    <Accordion type="multiple" className="space-y-2">
                      {items.map((item, idx) => (
                        <motion.div
                          key={item.term}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: groupIdx * 0.05 + idx * 0.04, duration: 0.3, ease: 'easeOut' }}
                        >
                          <AccordionItem
                            value={item.term}
                            className="border border-amber-200/40 dark:border-amber-800/20 rounded-lg px-4 bg-amber-50/30 dark:bg-amber-950/10 hover:border-amber-300/60 dark:hover:border-amber-700/40 transition-colors"
                          >
                            <AccordionTrigger className="py-3 hover:no-underline">
                              <span className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                                {item.term}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/70">
                              {item.definition}
                            </AccordionContent>
                          </AccordionItem>
                        </motion.div>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resources section */}
          <motion.div
            custom={sectionIndex++}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <ExternalLink className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Ressources</h2>
                <p className="text-xs text-muted-foreground">
                  Ouvrages recommandés pour approfondir
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {resources.map((resource, idx) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.06, duration: 0.3, ease: 'easeOut' }}
                >
                  <Card className="border-amber-200/40 dark:border-amber-800/20 hover:border-amber-300/60 dark:hover:border-amber-700/40 transition-colors hover:shadow-sm hover:shadow-amber-100/30 dark:hover:shadow-amber-900/10">
                    <CardContent className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100/60 dark:bg-amber-900/20 mt-0.5">
                          <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm text-foreground leading-tight">
                            {resource.title}
                          </h3>
                          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                            {resource.author}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
