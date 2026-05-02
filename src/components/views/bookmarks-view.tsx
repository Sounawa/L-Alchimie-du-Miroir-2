'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { getChapterById } from '@/data/chapters'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Bookmark, Trash2, ChevronRight, BookOpen, Sparkles } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
}

export function BookmarksView() {
  const navigate = useAppStore((s) => s.navigate)
  const bookmarks = useAppStore((s) => s.bookmarks)
  const removeBookmark = useAppStore((s) => s.removeBookmark)

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
          Vos chapitres favoris pour un accès rapide
        </p>
      </motion.div>

      {bookmarks.length === 0 ? (
        /* Empty state */
        <motion.div custom={sectionIndex++} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-dashed border-amber-200/60 dark:border-amber-800/30">
            <CardContent className="pt-10 pb-10 text-center space-y-4">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-amber-100/60 dark:bg-amber-900/20 animate-pulse" />
                <div className="absolute inset-2 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                  <Bookmark className="h-8 w-8 text-amber-400/60 dark:text-amber-500/50" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-200/80 mb-1">
                  Aucun favori pour le moment
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Parcourez les chapitres et ajoutez vos préférés en favoris pour les retrouver facilement ici.
                </p>
              </div>
              <Button
                onClick={() => navigate('toc')}
                className="bg-gradient-to-r from-amber-600 to-amber-500 text-amber-50 shadow-lg shadow-amber-600/20 hover:from-amber-500 hover:to-amber-400 gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Parcourir les chapitres
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* Bookmarks list */
        <motion.div
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
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

            return (
              <motion.div
                key={bookmark.chapterId}
                custom={sectionIndex + idx}
                variants={fadeUp}
              >
                <Card className="group border-amber-200/40 dark:border-amber-800/20 hover:border-amber-300/60 dark:hover:border-amber-700/40 transition-all hover:shadow-md hover:shadow-amber-100/30 dark:hover:shadow-amber-900/10 overflow-hidden relative">
                  {/* Subtle gradient bg */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-50/40 via-transparent to-amber-50/30 dark:from-amber-950/10 dark:via-transparent dark:to-amber-950/10 pointer-events-none" />
                  <CardContent className="pt-4 pb-4 relative">
                    <div className="flex items-start gap-4">
                      {/* Chapter number badge */}
                      <div className="shrink-0">
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-0 text-xs font-bold px-2.5 py-1">
                          {chapter.number}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => navigate('chapter', bookmark.chapterId)}
                          className="text-left w-full group/btn"
                        >
                          <h3 className="font-semibold text-foreground group-hover/btn:text-amber-700 dark:group-hover/btn:text-amber-300 transition-colors truncate">
                            {chapter.title}
                          </h3>
                          {bookmark.label && bookmark.label !== `${chapter.number} — ${chapter.title}` && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {bookmark.label}
                            </p>
                          )}
                        </button>
                        <p className="text-[11px] text-muted-foreground/70 mt-1.5">
                          Ajouté le {bookmarkDate}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('chapter', bookmark.chapterId)}
                          className="h-8 w-8 p-0 text-amber-600 dark:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-900/20"
                          title="Ouvrir le chapitre"
                        >
                          <ChevronRight className="h-4 w-4" />
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
  )
}
