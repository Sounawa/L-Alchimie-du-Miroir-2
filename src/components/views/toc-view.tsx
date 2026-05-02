'use client';

import { useAppStore } from '@/store/use-app-store';
import { siteContent, getTableOfContents } from '@/data/chapters';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Bookmark, ChevronRight, BookOpen } from 'lucide-react';

const toc = getTableOfContents();

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const slideIn = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function TocView() {
  const navigate = useAppStore((s) => s.navigate);
  const isChapterComplete = useAppStore((s) => s.isChapterComplete);
  const isBookmarked = useAppStore((s) => s.isBookmarked);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      {/* Subtle geometric pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(217, 169, 99, 0.3) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(217, 169, 99, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 140px, 80px 140px',
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-2xl p-6 md:p-12"
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="mb-10 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('cover')}
            className="mb-6 text-stone-400/70 hover:text-amber-300/80"
          >
            ← Retour
          </Button>
          <h1 className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text font-serif text-3xl text-transparent md:text-4xl">
            Table des Matières
          </h1>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-amber-600/40" />
            <BookOpen className="size-4 text-amber-500/50" />
            <span className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-amber-600/40" />
          </div>
        </motion.div>

        {/* Introduction row */}
        <motion.div variants={slideIn}>
          <button
            onClick={() => navigate('intro')}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-amber-900/10"
          >
            <span className="shrink-0 text-amber-400/60">Intro</span>
            <span className="flex-1 text-stone-200/80">Introduction</span>
            <span className="text-xs text-stone-500/50">3</span>
            <ChevronRight className="size-4 text-stone-600/50 transition-colors group-hover:text-amber-400/60" />
          </button>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Separator className="my-3 bg-stone-700/30" />
        </motion.div>

        {/* Parts */}
        {toc.parts.map((part) => (
          <div key={part.id}>
            {/* Part header */}
            <motion.div variants={fadeIn} className="my-6">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-amber-600/40 to-transparent" />
                <h2 className="shrink-0 text-sm font-semibold tracking-wider text-amber-400/80 uppercase">
                  Partie {part.letter} — {part.title}
                </h2>
                <span className="h-px flex-1 bg-gradient-to-l from-amber-600/40 to-transparent" />
              </div>
            </motion.div>

            {/* Chapter entries */}
            {part.entries.map((entry) => {
              const completed = isChapterComplete(entry.id);
              const bookmarked = isBookmarked(entry.id);

              return (
                <motion.div key={entry.id} variants={slideIn}>
                  <button
                    onClick={() => navigate('chapter', entry.id)}
                    className="group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-amber-900/10"
                  >
                    {/* Completion icon */}
                    <span className="w-5 shrink-0">
                      {completed ? (
                        <CheckCircle2 className="size-4 text-emerald-400/70" />
                      ) : (
                        <span className="block size-4 rounded-full border border-stone-600/30" />
                      )}
                    </span>

                    {/* Chapter number */}
                    <span className="shrink-0 text-xs font-medium text-amber-500/60">
                      {entry.number}
                    </span>

                    {/* Title with dot leaders */}
                    <span className="flex min-w-0 flex-1 items-center gap-1">
                      <span className="shrink-0 text-stone-200/80 group-hover:text-amber-100/90">
                        {entry.title}
                      </span>
                      <span className="flex-1 border-b border-dotted border-stone-600/30" />
                    </span>

                    {/* Bookmark icon */}
                    {bookmarked && (
                      <Bookmark className="size-3.5 shrink-0 fill-amber-400/60 text-amber-400/60" />
                    )}

                    {/* Page number placeholder */}
                    <ChevronRight className="size-4 shrink-0 text-stone-600/50 transition-colors group-hover:text-amber-400/60" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        ))}

        {/* Annexes */}
        <motion.div variants={fadeIn} className="mt-8">
          <Separator className="mb-6 bg-stone-700/30" />
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-amber-600/40 to-transparent" />
            <h2 className="shrink-0 text-sm font-semibold tracking-wider text-amber-400/80 uppercase">
              Annexes
            </h2>
            <span className="h-px flex-1 bg-gradient-to-l from-amber-600/40 to-transparent" />
          </div>
        </motion.div>

        {toc.appendices.entries.map((entry, idx) => (
          <motion.div key={entry.id} variants={slideIn}>
            <button
              onClick={() => navigate('chapter', entry.id)}
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-amber-900/10"
            >
              <span className="w-5 shrink-0">
                <span className="block size-4 rounded-full border border-stone-600/30" />
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-1">
                <span className="shrink-0 text-stone-300/70 group-hover:text-amber-100/90">
                  {entry.title}
                </span>
                <span className="flex-1 border-b border-dotted border-stone-600/30" />
              </span>
              <ChevronRight className="size-4 shrink-0 text-stone-600/50 transition-colors group-hover:text-amber-400/60" />
            </button>
          </motion.div>
        ))}

        {/* Progress indicator */}
        <motion.div variants={fadeIn} className="mt-10">
          <Separator className="mb-6 bg-stone-700/30" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-400/60">Progression</span>
            <ProgressIndicator />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProgressIndicator() {
  const getProgressPercentage = useAppStore((s) => s.getProgressPercentage);
  const pct = getProgressPercentage();

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-stone-700/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <Badge
        variant="outline"
        className="border-amber-700/30 bg-amber-950/30 px-2 py-0.5 text-xs text-amber-400/70"
      >
        {pct}%
      </Badge>
    </div>
  );
}
