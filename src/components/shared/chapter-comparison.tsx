'use client';

import { useAppStore } from '@/store/use-app-store';
import { allChapters, getChapterById, type Chapter } from '@/data/chapters';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeftRight,
  BookOpen,
  ChevronRight,
  Sparkles,
  Eye,
  MessageCircle,
  Layers,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/** Extract key themes from a chapter */
function getChapterThemes(chapter: Chapter): string[] {
  const themes: string[] = [];

  // From word analysis
  for (const w of chapter.wordAnalysis) {
    if (w.mirrorDimension) {
      // Extract key concept from first few words
      const words = w.mirrorDimension.split(' ').slice(0, 3).join(' ');
      themes.push(words);
    }
  }

  // From callouts
  for (const c of chapter.callouts ?? []) {
    themes.push(c.title);
  }

  // From coherence points
  if (chapter.coherencePoints && chapter.coherencePoints.length > 0) {
    themes.push('Cohérence textuelle');
  }

  // From treasures
  if (chapter.treasuresList && chapter.treasuresList.length > 0) {
    themes.push('Trésors spirituels');
  }

  // From metaphors
  if (chapter.metaphorTable && chapter.metaphorTable.length > 0) {
    themes.push('Métaphores');
  }

  // Part-specific themes
  if (chapter.part === 'A') themes.push('Al-Fatiha');
  if (chapter.part === 'B') themes.push('Trésors du Coran');
  if (chapter.part === 'C') themes.push('Niveaux de lecture');

  // Limit to 6 themes
  return themes.slice(0, 6);
}

/** Get all mirror questions from a chapter */
function getMirrorQuestions(chapter: Chapter) {
  return chapter.mirrorQuestions.slice(0, 3);
}

function ChapterColumn({ chapter, label }: { chapter: Chapter; label: string }) {
  const themes = useMemo(() => getChapterThemes(chapter), [chapter]);
  const questions = useMemo(() => getMirrorQuestions(chapter), [chapter]);
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="space-y-4">
      {/* Label */}
      <Badge
        variant="secondary"
        className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-0 text-[10px]"
      >
        {label}
      </Badge>

      {/* Title */}
      <div>
        <h3 className="font-bold text-stone-800 dark:text-stone-100">
          {chapter.number} — {chapter.title}
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400/60 mt-0.5">
          {chapter.subtitle}
        </p>
      </div>

      {/* Arabic verse */}
      {chapter.arabicVerse && (
        <div className="rounded-lg border border-amber-200/40 dark:border-amber-700/20 bg-amber-50/40 dark:bg-amber-950/10 p-3 text-center">
          <p
            className="arabic-verse text-xl leading-relaxed text-amber-800 dark:text-amber-200"
            lang="ar"
            dir="rtl"
          >
            {chapter.arabicVerse}
          </p>
        </div>
      )}

      {/* Translation */}
      {chapter.translation && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500/50 font-medium mb-1">
            Traduction
          </p>
          <p className="text-sm text-stone-600 dark:text-stone-300/70 leading-relaxed italic">
            {chapter.translation}
          </p>
        </div>
      )}

      <Separator className="bg-stone-200/60 dark:bg-stone-700/30" />

      {/* Mirror questions */}
      {questions.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Eye className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-semibold text-stone-600 dark:text-stone-300/70">
              Questions miroir
            </p>
          </div>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div
                key={i}
                className="rounded-md bg-stone-50 dark:bg-stone-800/30 px-3 py-2"
              >
                <p className="text-xs text-stone-700 dark:text-stone-200/70 leading-relaxed">
                  {q.question}
                </p>
                {q.meditation && (
                  <p className="mt-1 text-[10px] text-stone-400 dark:text-stone-500/50 italic">
                    {q.meditation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Themes */}
      {themes.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Layers className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-semibold text-stone-600 dark:text-stone-300/70">
              Thèmes clés
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {themes.map((theme, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-[10px] border-amber-300/40 dark:border-amber-700/20 text-stone-600 dark:text-stone-400/70"
              >
                {theme}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Navigate to chapter */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('chapter', chapter.id)}
        className="w-full border-amber-300/50 dark:border-amber-700/30 text-amber-700 hover:bg-amber-100/50 dark:text-amber-300 dark:hover:bg-amber-900/20 text-xs"
      >
        <BookOpen className="h-3.5 w-3.5 mr-1.5" />
        Lire le chapitre
      </Button>
    </div>
  );
}

export function ChapterComparison() {
  const navigate = useAppStore((s) => s.navigate);

  // Selectable chapters (all main chapters)
  const selectableChapters = useMemo(
    () => allChapters.filter((c) => c.arabicVerse), // only chapters with content
    []
  );

  const [leftId, setLeftId] = useState<string>(selectableChapters[0]?.id ?? 'a1');
  const [rightId, setRightId] = useState<string>(
    selectableChapters[1]?.id ?? 'a2'
  );

  const leftChapter = useMemo(() => getChapterById(leftId), [leftId]);
  const rightChapter = useMemo(() => getChapterById(rightId), [rightId]);

  // Common themes
  const commonThemes = useMemo(() => {
    if (!leftChapter || !rightChapter) return [];
    const leftThemes = getChapterThemes(leftChapter).map((t) =>
      t.toLowerCase()
    );
    const rightThemes = getChapterThemes(rightChapter).map((t) =>
      t.toLowerCase()
    );
    return leftThemes.filter((t) => rightThemes.includes(t));
  }, [leftChapter, rightChapter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-stone-50 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-5xl p-6 md:p-12"
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="mb-8 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('toc')}
            className="mb-6 text-stone-500 hover:text-amber-600 dark:text-stone-400/70 dark:hover:text-amber-300/80"
          >
            ← Retour
          </Button>
          <h1 className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-300 bg-clip-text font-serif text-3xl text-transparent md:text-4xl">
            Comparaison de Chapitres
          </h1>
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400/60">
            Comparez deux chapitres côte à côte pour découvrir les résonances spirituelles
          </p>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-amber-500/40 dark:to-amber-600/40" />
            <ArrowLeftRight className="size-4 text-amber-500/50" />
            <span className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-amber-500/40 dark:to-amber-600/40" />
          </div>
        </motion.div>

        {/* Chapter selectors */}
        <motion.div variants={fadeIn} className="mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400/60 mb-1.5 block">
                Chapitre 1
              </label>
              <Select value={leftId} onValueChange={setLeftId}>
                <SelectTrigger className="w-full border-amber-300/40 dark:border-amber-700/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectableChapters.map((ch) => (
                    <SelectItem key={ch.id} value={ch.id}>
                      {ch.number} — {ch.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <ArrowLeftRight className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>

            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400/60 mb-1.5 block">
                Chapitre 2
              </label>
              <Select value={rightId} onValueChange={setRightId}>
                <SelectTrigger className="w-full border-amber-300/40 dark:border-amber-700/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectableChapters.map((ch) => (
                    <SelectItem key={ch.id} value={ch.id}>
                      {ch.number} — {ch.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Comparison columns */}
        {leftChapter && rightChapter && (
          <>
            {/* Desktop: side by side, Mobile: stacked */}
            <motion.div variants={fadeIn} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-stone-200/60 dark:border-stone-700/30">
                  <CardContent className="p-5">
                    <ChapterColumn chapter={leftChapter} label="Chapitre 1" />
                  </CardContent>
                </Card>
                <Card className="border-stone-200/60 dark:border-stone-700/30">
                  <CardContent className="p-5">
                    <ChapterColumn chapter={rightChapter} label="Chapitre 2" />
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Common themes section */}
            <motion.div variants={fadeIn}>
              <Card className="border-amber-300/40 dark:border-amber-700/20 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50/80 via-amber-100/40 to-amber-50/80 dark:from-amber-950/20 dark:via-amber-900/10 dark:to-amber-950/20 p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                    <h3 className="font-semibold text-stone-700 dark:text-stone-200">
                      Thèmes communs
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400/60">
                    Points de résonance entre ces deux chapitres
                  </p>
                </div>
                <CardContent className="p-4">
                  {commonThemes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {commonThemes.map((theme, i) => (
                        <Badge
                          key={i}
                          className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-0"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-400 dark:text-stone-500/50 italic">
                      Aucun thème commun direct trouvé entre ces chapitres. Chaque
                      chapitre a sa propre richesse spirituelle.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* Tip */}
        <motion.div variants={fadeIn} className="mt-8">
          <Separator className="mb-6 bg-stone-200/60 dark:bg-stone-700/30" />
          <div className="rounded-xl border border-amber-200/40 bg-amber-50/40 dark:border-amber-800/20 dark:bg-amber-950/10 p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg">📖</span>
              <div>
                <p className="text-sm font-medium text-stone-700 dark:text-stone-200/80">
                  Astuce de comparaison
                </p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400/60 leading-relaxed">
                  Comparez des chapitres de différentes parties (A, B, C) pour découvrir
                  comment les thèmes de la Fatiha résonnent dans les versets du Coran
                  et les niveaux de lecture approfondis.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
