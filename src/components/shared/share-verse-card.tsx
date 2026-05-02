'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, X, Copy, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface ShareVerseCardProps {
  arabicVerse: string
  translation: string
  translationSource: string
  chapterTitle?: string
}

export function ShareVerseCard({ arabicVerse, translation, translationSource, chapterTitle }: ShareVerseCardProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const cardRef = useRef<HTMLDivElement>(null)

  const shareText = `${arabicVerse}\n\n${translation}\n— ${translationSource}\n\n📖 L'Alchimie du Miroir${chapterTitle ? ` — ${chapterTitle}` : ''}`

  const handleShare = useCallback(async () => {
    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'L\'Alchimie du Miroir — Verset',
          text: shareText,
        })
        return
      } catch (err) {
        // User cancelled or API failed, fall through to clipboard
        if (err instanceof Error && err.name === 'AbortError') return
      }
    }

    // Fall back to showing preview + clipboard copy
    setShowPreview(true)
  }, [shareText])

  const handleCopyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      toast({ description: 'Verset copié dans le presse-papier ✓' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ description: 'Impossible de copier le texte' })
    }
  }, [shareText, toast])

  const handleClose = useCallback(() => {
    setShowPreview(false)
  }, [])

  return (
    <>
      {/* Share button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="h-8 gap-1.5 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs"
        aria-label="Partager le verset"
      >
        <Share2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Partager</span>
      </Button>

      {/* Share preview modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Card preview */}
              <div
                ref={cardRef}
                className="rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100 dark:from-amber-950 dark:via-stone-900 dark:to-amber-950 border border-amber-300/50 dark:border-amber-700/40 shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="px-6 pt-5 pb-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="h-px w-8 bg-amber-400/40 dark:bg-amber-500/30" />
                    <span className="text-amber-500 dark:text-amber-400 text-xs tracking-[0.3em]">✦</span>
                    <span className="h-px w-8 bg-amber-400/40 dark:bg-amber-500/30" />
                  </div>
                  {chapterTitle && (
                    <p className="text-[10px] text-amber-600/70 dark:text-amber-400/60 uppercase tracking-wider font-medium mb-1">
                      {chapterTitle}
                    </p>
                  )}
                </div>

                {/* Arabic verse */}
                <div className="px-6 py-4">
                  <p
                    dir="rtl"
                    lang="ar"
                    className="arabic-verse text-2xl md:text-3xl text-center text-amber-900 dark:text-amber-100 leading-loose"
                  >
                    {arabicVerse}
                  </p>
                </div>

                {/* Translation */}
                <div className="px-6 pb-4 text-center space-y-1">
                  <p className="text-sm italic text-amber-800/80 dark:text-amber-200/70 leading-relaxed">
                    {translation}
                  </p>
                  <p className="text-xs text-amber-700/60 dark:text-amber-300/50">
                    — {translationSource}
                  </p>
                </div>

                {/* Footer branding */}
                <div className="px-6 pb-5 pt-3 text-center border-t border-amber-300/30 dark:border-amber-700/20">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-lg">🪞</span>
                    <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                      L&apos;Alchimie du Miroir
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-600/50 dark:text-amber-400/40">
                    Méditation réflexive du Coran
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <Button
                  onClick={handleCopyToClipboard}
                  className="gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 shadow-lg"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="h-4 w-4" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copier le texte
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Fermer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
