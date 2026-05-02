'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { getChapterById } from '@/data/chapters'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Bookmark, Trash2, BookOpen, Sparkles, BookOpenCheck, Share2 } from 'lucide-react'
import { ShareVerseCard } from '@/components/shared/share-verse-card'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
}

// Part badge colors
const partBadgeStyles: Record<string, string> = {
  A: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  B: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  C: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
}

function getPartLetter(chapterId: string): string {
  const letter = chapterId.charAt(0).toUpperCase()
  return letter === 'A' || letter === 'B' || letter === 'C' ? letter : 'A'
}

export function BookmarksView() {
  const navigate = useAppStore((s) => s.navigate)
  const bookmarks = useAppStore((s) => s.bookmarks)
  const removeBookmark = useAppStore((s) => s.removeBookmark)

  let sectionIndex = 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-stone-50 to-stone-100/50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Back button */}
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('toc')}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Table des matières
          </Button>
        </motion.div>

        {/* Title */}
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible" className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Bookmark className="h-7 w-7 text-amber-500 fill-amber-500" />
            <h1 className="text-3xl font-bold tracking-tight">Favoris</h1>
          </div>
          <p className="text-muted-foreground">
            Vos chapitres favoris avec versets et partage
          </p>
        </motion.div>

        {bookmarks.length === 0 ? (
          /* Empty state */
          <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
            <Card className="border-dashed border-amber-200/60 dark:border-amber-800/30 overflow-hidden">
              <CardContent className="pt-12 pb-12 text-center space-y-6">
                <div className="relative mx-auto w-28 h-28">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-amber-100/40 dark:bg-amber-900/15"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="absolute inset-3 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <BookOpen className="h-10 w-10 text-amber-300/60 dark:text-amber-500/50" />
                    </motion.div>
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  >
                    <Sparkles className="h-4 w-4 text-amber-400/70" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-200/80">
                    Aucun favori pour le moment
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Parcourez les chapitres et ajoutez vos préférés en favoris en cliquant sur l&apos;icône
                    <Bookmark className="inline h-3 w-3 mx-1 text-amber-500" />
                    pour les retrouver facilement ici.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() => navigate('toc')}
                    className="bg-gradient-to-r from-amber-600 to-amber-500 text-amber-50 shadow-lg shadow-amber-600/20 hover:from-amber-500 hover:to-amber-400 gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Parcourir les chapitres
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Bookmarks list with Arabic verse and share */
          <motion.div initial="hidden" animate="visible" className="space-y-3">
            <motion.div custom={sectionIndex++} variants={fadeUp} className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {bookmarks.length} favori{bookmarks.length > 1 ? 's' : ''}
              </p>
              <Badge variant="outline" className="border-amber-300/50 dark:border-amber-700/40 text-amber-600 dark:text-amber-400 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Accès rapide
              </Badge>
            </motion.div>

            {bookmarks.map((bookmark, idx) => {
              const chapter = getChapterById(bookmark.chapterId)
              if (!chapter) return null

              const bookmarkDate = new Date(bookmark.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })

              const partLetter = getPartLetter(bookmark.chapterId)
              const partStyle = partBadgeStyles[partLetter] || partBadgeStyles['A']

              return (
                <motion.div
                  key={bookmark.chapterId}
                  custom={sectionIndex + idx}
                  variants={fadeUp}
                >
                  <Card className="group border-amber-200/40 dark:border-amber-800/20 hover:border-amber-300/60 dark:hover:border-amber-700/40 transition-all hover:shadow-md hover:shadow-amber-100/30 dark:hover:shadow-amber-900/10 overflow-hidden relative card-hover-lift">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-50/40 via-transparent to-amber-50/30 dark:from-amber-950/10 dark:via-transparent dark:to-amber-950/10 pointer-events-none" />
                    <CardContent className="pt-4 pb-4 relative">
                      <div className="flex items-start gap-4">
                        {/* Part letter badge */}
                        <div className="shrink-0 flex flex-col items-center gap-1">
                          <Badge className={`${partStyle} border-0 text-xs font-bold px-2.5 py-1`}>
                            {partLetter}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground/50">Part. {partLetter}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => navigate('chapter', bookmark.chapterId)}
                            className="text-left w-full group/btn"
                          >
                            <h3 className="font-semibold text-foreground group-hover/btn:text-amber-700 dark:group-hover/btn:text-amber-300 transition-colors truncate">
                              {chapter.number} — {chapter.title}
                            </h3>
                          </button>

                          {/* Arabic verse preview */}
                          {chapter.arabicVerse && (
                            <p
                              dir="rtl"
                              lang="ar"
                              className="arabic-verse text-sm text-amber-800/70 dark:text-amber-200/60 mt-1.5 truncate leading-relaxed"
                            >
                              {chapter.arabicVerse.substring(0, 80)}{chapter.arabicVerse.length > 80 ? '...' : ''}
                            </p>
                          )}

                          {/* Translation preview */}
                          {chapter.translation && (
                            <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2 italic">
                              {chapter.translation.substring(0, 120)}{chapter.translation.length > 120 ? '...' : ''}
                            </p>
                          )}

                          <p className="text-[11px] text-muted-foreground/70 mt-1.5">
                            Ajouté le {bookmarkDate}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Share button */}
                          {chapter.arabicVerse && (
                            <ShareVerseCard
                              arabicVerse={chapter.arabicVerse}
                              translation={chapter.translation || ''}
                              translationSource={chapter.translationSource || ''}
                              chapterTitle={`${chapter.number} — ${chapter.title}`}
                            />
                          )}
                          {/* Read button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('chapter', bookmark.chapterId)}
                            className="h-8 px-3 text-amber-600 dark:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 text-xs gap-1.5"
                            title="Lire le chapitre"
                          >
                            <BookOpenCheck className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Lire</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBookmark(bookmark.chapterId)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Retirer des favoris"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
