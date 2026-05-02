'use client';

import { useAppStore } from '@/store/use-app-store';
import { siteContent, getTableOfContents, getChapterById } from '@/data/chapters';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Bookmark, ChevronRight, BookOpen, Flame, Trophy, Clock, Eye } from 'lucide-react';
import { DailyInspiration } from '@/components/shared/daily-inspiration';
import { StudyReminder } from '@/components/shared/study-reminder';
import { useRef, useEffect, useState } from 'react';

const toc = getTableOfContents();

// Calculate reading time estimate for a chapter (~200 words/min for French)
function getReadingTime(chapterId: string): number {
  const chapter = getChapterById(chapterId);
  if (!chapter) return 5;
  let wordCount = 0;
  // Count words in main text fields
  if (chapter.arabicVerse) wordCount += chapter.arabicVerse.split(/\s+/).length;
  if (chapter.translation) wordCount += chapter.translation.split(/\s+/).length;
  wordCount += chapter.wordAnalysis.reduce((acc, w) => acc + (w.mirrorDimension?.split(/\s+/).length || 0) + (w.literalMeaning?.split(/\s+/).length || 0), 0);
  wordCount += chapter.mirrorQuestions.reduce((acc, q) => acc + (q.question?.split(/\s+/).length || 0) + (q.meditation?.split(/\s+/).length || 0), 0);
  wordCount += chapter.munajatPrompts.reduce((acc, p) => acc + (p?.split(/\s+/).length || 0), 0);
  wordCount += chapter.exercises.reduce((acc, e) => acc + (e.question?.split(/\s+/).length || 0), 0);
  if (chapter.coherencePoints) wordCount += chapter.coherencePoints.reduce((acc, p) => acc + (p?.split(/\s+/).length || 0), 0);
  if (chapter.bulletPoints) wordCount += chapter.bulletPoints.reduce((acc, p) => acc + (p?.split(/\s+/).length || 0), 0);
  if (chapter.callouts) wordCount += chapter.callouts.reduce((acc, c) => acc + (c.title?.split(/\s+/).length || 0) + (c.content?.split(/\s+/).length || 0), 0);
  if (chapter.treasuresList) wordCount += chapter.treasuresList.reduce((acc, t) => acc + (t?.split(/\s+/).length || 0), 0);
  if (chapter.metaphorTable) wordCount += chapter.metaphorTable.reduce((acc, m) => acc + (m.interpretation?.split(/\s+/).length || 0) + (m.metaphor?.split(/\s+/).length || 0), 0);
  if (chapter.extraSections) wordCount += chapter.extraSections.reduce((acc, s) => acc + (s.translation?.split(/\s+/).length || 0) + (s.commentary?.split(/\s+/).length || 0), 0);
  if (chapter.quotes) wordCount += chapter.quotes.reduce((acc, q) => acc + (q.text?.split(/\s+/).length || 0), 0);
  // Add meditation time
  const readMinutes = Math.ceil(wordCount / 200);
  return Math.max(readMinutes, 3); // minimum 3 minutes
}

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

// Part color map for left border indicator
const partBorderColor: Record<string, string> = {
  A: 'border-l-amber-500 dark:border-l-amber-400',
  B: 'border-l-emerald-500 dark:border-l-emerald-400',
  C: 'border-l-violet-500 dark:border-l-violet-400',
};

const partDotColor: Record<string, string> = {
  A: 'bg-amber-500 dark:bg-amber-400',
  B: 'bg-emerald-500 dark:bg-emerald-400',
  C: 'bg-violet-500 dark:bg-violet-400',
};

export function TocView() {
  const navigate = useAppStore((s) => s.navigate);
  const isChapterComplete = useAppStore((s) => s.isChapterComplete);
  const isBookmarked = useAppStore((s) => s.isBookmarked);
  const completedChapters = useAppStore((s) => s.completedChapters);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const getProgressPercentage = useAppStore((s) => s.getProgressPercentage);
  const currentChapterId = useAppStore((s) => s.currentChapterId);

  // Parallax scroll effect for background pattern
  const scrollRef = useRef<HTMLDivElement>(null);
  const [patternOffset, setPatternOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setPatternOffset(window.scrollY * 0.3);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find the most recently completed chapter for "Dernière lecture"
  const lastReadChapter = completedChapters.length > 0
    ? completedChapters[completedChapters.length - 1]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-stone-50 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      {/* Subtle geometric pattern with parallax */}
      <div
        className="pointer-events-none fixed inset-0 islamic-pattern opacity-[0.04] dark:opacity-[0.025]"
        style={{ transform: `translateY(${patternOffset}px)` }}
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
            className="mb-6 text-stone-500 hover:text-amber-600 dark:text-stone-400/70 dark:hover:text-amber-300/80"
          >
            ← Retour
          </Button>
          <h1 className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-300 bg-clip-text font-serif text-3xl text-transparent md:text-4xl">
            Table des Matières
          </h1>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-amber-500/40 dark:to-amber-600/40" />
            <BookOpen className="size-4 text-amber-500/50" />
            <span className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-amber-500/40 dark:to-amber-600/40" />
          </div>
        </motion.div>

        {/* Résumé de progression mini-card */}
        <motion.div variants={fadeIn} className="mb-6">
          <StudyReminder />
          <div className="rounded-xl border border-amber-200/50 bg-gradient-to-r from-amber-50/80 via-stone-50 to-amber-50/60 p-4 dark:border-amber-800/30 dark:from-amber-950/20 dark:via-stone-900 dark:to-amber-950/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-200/80">Résumé de progression</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400/60">{completedChapters.length}/17 chapitres complétés</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentStreak > 0 && (
                  <Badge variant="secondary" className="gap-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-0 text-[10px]">
                    <Flame className="h-3 w-3" />
                    {currentStreak}j
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-0 text-[10px]">
                  {getProgressPercentage()}%
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Inspiration */}
        <motion.div variants={fadeIn} className="mb-8">
          <DailyInspiration />
        </motion.div>

        {/* Dernière lecture indicator */}
        {lastReadChapter && (
          <motion.div variants={fadeIn} className="mb-6">
            <div className="rounded-xl border border-amber-200/50 bg-gradient-to-r from-amber-50/60 via-amber-50/30 to-transparent dark:border-amber-800/30 dark:from-amber-950/20 dark:via-amber-950/10 dark:to-transparent p-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Eye className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-amber-600/60 dark:text-amber-400/50 font-medium">Dernière lecture</p>
                <p className="text-sm font-medium text-stone-700 dark:text-stone-200/80 truncate">{lastReadChapter.title}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('chapter', lastReadChapter.chapterId)}
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 shrink-0"
              >
                Lire →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Introduction row */}
        <motion.div variants={slideIn}>
          <button
            onClick={() => navigate('intro')}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 hover:bg-amber-100/50 dark:hover:bg-amber-900/10 hover:shadow-sm hover:shadow-amber-200/20 dark:hover:shadow-amber-900/10 hover:translate-x-1"
          >
            <span className="shrink-0 text-amber-500 dark:text-amber-400/60">Intro</span>
            <span className="flex-1 text-stone-700 dark:text-stone-200/80">Introduction</span>
            <span className="text-xs text-stone-400 dark:text-stone-500/50">3</span>
            <ChevronRight className="size-4 text-stone-400 transition-colors group-hover:text-amber-500 dark:text-stone-600/50 dark:group-hover:text-amber-400/60" />
          </button>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Separator className="my-3 bg-stone-200/60 dark:bg-stone-700/30" />
        </motion.div>

        {/* Parts */}
        {toc.parts.map((part, partIdx) => (
          <motion.div
            key={part.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: partIdx * 0.1, duration: 0.5, ease: 'easeOut' }}
          >
            {/* Part header with color dot */}
            <div className="my-6">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-amber-500/40 to-transparent dark:from-amber-600/40" />
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${partDotColor[part.letter] || 'bg-amber-500'}`} />
                  <h2 className="shrink-0 text-sm font-semibold tracking-wider text-amber-600 dark:text-amber-400/80 uppercase">
                    Partie {part.letter} — {part.title}
                  </h2>
                </div>
                <span className="h-px flex-1 bg-gradient-to-l from-amber-500/40 to-transparent dark:from-amber-600/40" />
              </div>
            </div>

            {/* Chapter entries with left border color */}
            {part.entries.map((entry) => {
              const completed = isChapterComplete(entry.id);
              const bookmarked = isBookmarked(entry.id);

              return (
                <motion.div key={entry.id} variants={slideIn}>
                  <button
                    onClick={() => navigate('chapter', entry.id)}
                    className={`group flex w-full items-center gap-2 rounded-xl border-l-2 ${partBorderColor[part.letter] || 'border-l-amber-500'} px-3 py-2.5 text-left transition-all duration-200 hover:bg-amber-100/50 dark:hover:bg-amber-900/10 hover:shadow-sm hover:shadow-amber-200/20 dark:hover:shadow-amber-900/10 hover:border-l-[3px] hover:translate-x-1 ${currentChapterId === entry.id ? 'bg-amber-50/80 dark:bg-amber-900/15 border-l-[3px]' : ''}`}
                  >
                    {/* Completion icon */}
                    <span className="w-5 shrink-0">
                      {completed ? (
                        <CheckCircle2 className="size-4 text-emerald-500 dark:text-emerald-400/70" />
                      ) : (
                        <span className="block size-4 rounded-full border border-stone-300 dark:border-stone-600/30" />
                      )}
                    </span>

                    {/* Chapter number */}
                    <span className="shrink-0 text-xs font-medium text-amber-500 dark:text-amber-500/60">
                      {entry.number}
                    </span>

                    {/* Title with elegant dot leaders */}
                    <span className="flex min-w-0 flex-1 items-baseline gap-1">
                      <span className="shrink-0 text-stone-700 group-hover:text-amber-700 dark:text-stone-200/80 dark:group-hover:text-amber-100/90 transition-colors">
                        {entry.title}
                      </span>
                      <span className="flex-1 border-b border-dotted border-stone-300 dark:border-stone-600/30 group-hover:border-amber-400 dark:group-hover:border-amber-600/40 transition-colors" />
                    </span>

                    {/* Bookmark icon */}
                    {bookmarked && (
                      <Bookmark className="size-3.5 shrink-0 fill-amber-500 text-amber-500 dark:fill-amber-400/60 dark:text-amber-400/60" />
                    )}

                    {/* Reading time */}
                    <span className="shrink-0 text-[10px] text-stone-400 dark:text-stone-500/60 flex items-center gap-0.5">
                      <Clock className="size-3" />
                      {getReadingTime(entry.id)} min
                    </span>

                    {/* Chevron */}
                    <ChevronRight className="size-4 shrink-0 text-stone-400 transition-colors group-hover:text-amber-500 dark:text-stone-600/50 dark:group-hover:text-amber-400/60" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        ))}

        {/* Annexes */}
        <motion.div variants={fadeIn} className="mt-8">
          <Separator className="mb-6 bg-stone-200/60 dark:bg-stone-700/30" />
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-amber-500/40 to-transparent dark:from-amber-600/40" />
            <h2 className="shrink-0 text-sm font-semibold tracking-wider text-amber-600 dark:text-amber-400/80 uppercase">
              Annexes
            </h2>
            <span className="h-px flex-1 bg-gradient-to-l from-amber-500/40 to-transparent dark:from-amber-600/40" />
          </div>
        </motion.div>

        {toc.appendices.entries.map((entry, idx) => (
          <motion.div key={entry.id} variants={slideIn}>
            <button
              onClick={() => navigate('chapter', entry.id)}
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-all duration-200 hover:bg-amber-100/50 dark:hover:bg-amber-900/10 hover:shadow-sm hover:shadow-amber-200/20 dark:hover:shadow-amber-900/10 hover:translate-x-1"
            >
              <span className="w-5 shrink-0">
                <span className="block size-4 rounded-full border border-stone-300 dark:border-stone-600/30" />
              </span>
              <span className="flex min-w-0 flex-1 items-baseline gap-1">
                <span className="shrink-0 text-stone-600 group-hover:text-amber-700 dark:text-stone-300/70 dark:group-hover:text-amber-100/90 transition-colors">
                  {entry.title}
                </span>
                <span className="flex-1 border-b border-dotted border-stone-300 dark:border-stone-600/30 group-hover:border-amber-400 dark:group-hover:border-amber-600/40 transition-colors" />
              </span>
              <ChevronRight className="size-4 shrink-0 text-stone-400 transition-colors group-hover:text-amber-500 dark:text-stone-600/50 dark:group-hover:text-amber-400/60" />
            </button>
          </motion.div>
        ))}

        {/* Progress indicator */}
        <motion.div variants={fadeIn} className="mt-10">
          <Separator className="mb-6 bg-stone-200/60 dark:bg-stone-700/30" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500 dark:text-stone-400/60">Progression</span>
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
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <Badge
        variant="outline"
        className="border-amber-400/40 bg-amber-100/50 px-2 py-0.5 text-xs text-amber-600 dark:border-amber-700/30 dark:bg-amber-950/30 dark:text-amber-400/70"
      >
        {pct}%
      </Badge>
    </div>
  );
}
