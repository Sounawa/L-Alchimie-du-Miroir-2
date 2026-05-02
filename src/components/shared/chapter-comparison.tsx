'use client';

import { useAppStore } from '@/store/use-app-store';
import { allChapters, getChapterById, type Chapter } from '@/data/chapters';
import { motion, AnimatePresence } from 'framer-motion';
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
  Layers,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowLeft,
  Lightbulb,
  Link2,
  MessageCircle,
  BookMarked,
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

  for (const w of chapter.wordAnalysis) {
    if (w.mirrorDimension) {
      const words = w.mirrorDimension.split(' ').slice(0, 3).join(' ');
      themes.push(words);
    }
  }

  for (const c of chapter.callouts ?? []) {
    themes.push(c.title);
  }

  if (chapter.coherencePoints && chapter.coherencePoints.length > 0) {
    themes.push('Cohérence textuelle');
  }

  if (chapter.treasuresList && chapter.treasuresList.length > 0) {
    themes.push('Trésors spirituels');
  }

  if (chapter.metaphorTable && chapter.metaphorTable.length > 0) {
    themes.push('Métaphores');
  }

  if (chapter.part === 'A') themes.push('Al-Fatiha');
  if (chapter.part === 'B') themes.push('Trésors du Coran');
  if (chapter.part === 'C') themes.push('Niveaux de lecture');

  return themes.slice(0, 6);
}

/** Get vocabulary from word analysis */
function getVocabulary(chapter: Chapter): string[] {
  return chapter.wordAnalysis.map((w) => w.transliteration).filter(Boolean).slice(0, 8);
}

/** Get spiritual level indicator */
function getSpiritualLevel(chapter: Chapter): { level: string; description: string; color: string } {
  switch (chapter.part) {
    case 'A':
      return { level: 'Fondation', description: 'Les piliers de la Fatiha', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40' };
    case 'B':
      return { level: 'Exploration', description: 'Trésors et profondeurs du Coran', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40' };
    case 'C':
      return { level: 'Élévation', description: 'Les sept niveaux de lecture', color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800/40' };
    default:
      return { level: 'Introduction', description: 'Préambule au voyage', color: 'text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-950/20 border-stone-200 dark:border-stone-800/40' };
  }
}

/** Get all mirror questions from a chapter */
function getMirrorQuestions(chapter: Chapter) {
  return chapter.mirrorQuestions.slice(0, 3);
}

/** Compare two sets of items and return matching/mismatching */
function compareSets(left: string[], right: string[]): { match: string[]; leftOnly: string[]; rightOnly: string[] } {
  const leftLower = left.map((t) => t.toLowerCase());
  const rightLower = right.map((t) => t.toLowerCase());
  const match = left.filter((t, i) => rightLower.includes(leftLower[i]));
  const leftOnly = left.filter((t, i) => !rightLower.includes(leftLower[i]));
  const rightOnly = right.filter((t, i) => !leftLower.includes(rightLower[i]));
  return { match, leftOnly, rightOnly };
}

/** Find connections between two chapters */
function findConnections(left: Chapter, right: Chapter): { type: string; description: string; icon: typeof Link2 }[] {
  const connections: { type: string; description: string; icon: typeof Link2 }[] = [];

  // Same part connection
  if (left.part === right.part) {
    const partName = left.part === 'A' ? 'Al-Fatiha' : left.part === 'B' ? 'Trésors du Coran' : 'Niveaux de lecture';
    connections.push({
      type: 'Même partie',
      description: `Les deux chapitres appartiennent à la Partie ${left.part} — ${partName}, partageant le même cadre spirituel.`,
      icon: BookMarked,
    });
  } else {
    connections.push({
      type: 'Pont inter-parties',
      description: `Ces chapitres relient la Partie ${left.part} et la Partie ${right.part}, créant un pont entre différents niveaux de méditation.`,
      icon: Link2,
    });
  }

  // Munajat themes overlap
  const leftMunajat = left.munajatPrompts.join(' ').toLowerCase();
  const rightMunajat = right.munajatPrompts.join(' ').toLowerCase();
  const spiritualKeywords = ['miséricorde', 'lumière', 'cœur', 'guide', 'prière', 'chemin', 'foi', 'gratitude', 'pardon'];
  const sharedKeywords = spiritualKeywords.filter(k => leftMunajat.includes(k) && rightMunajat.includes(k));
  if (sharedKeywords.length > 0) {
    connections.push({
      type: 'Thèmes de prière partagés',
      description: `Les munajat des deux chapitres partagent les thèmes : ${sharedKeywords.join(', ')}.`,
      icon: MessageCircle,
    });
  }

  // Timer similarity
  if (left.timerMinutes === right.timerMinutes) {
    connections.push({
      type: 'Durée identique',
      description: `Les deux chapitres nécessitent ${left.timerMinutes} minutes de méditation — un rythme commun.`,
      icon: Link2,
    });
  }

  // Both have treasures
  if ((left.treasuresList?.length ?? 0) > 0 && (right.treasuresList?.length ?? 0) > 0) {
    connections.push({
      type: 'Trésors spirituels',
      description: 'Les deux chapitres contiennent des listes de trésors spirituels à contempler.',
      icon: Sparkles,
    });
  }

  // Both have metaphors
  if ((left.metaphorTable?.length ?? 0) > 0 && (right.metaphorTable?.length ?? 0) > 0) {
    connections.push({
      type: 'Richesse métaphorique',
      description: 'Les deux chapitres utilisent des métaphores pour illustrer les réalités spirituelles.',
      icon: Eye,
    });
  }

  return connections;
}

interface ComparisonIndicatorProps {
  type: 'match' | 'left' | 'right' | 'neutral';
}

function ComparisonIndicator({ type }: ComparisonIndicatorProps) {
  switch (type) {
    case 'match':
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />;
    case 'left':
    case 'right':
      return <XCircle className="h-3.5 w-3.5 text-rose-400 dark:text-rose-500 shrink-0" />;
    case 'neutral':
      return <MinusCircle className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500 shrink-0" />;
  }
}

function ChapterColumn({ chapter, label }: { chapter: Chapter; label: string }) {
  const themes = useMemo(() => getChapterThemes(chapter), [chapter]);
  const questions = useMemo(() => getMirrorQuestions(chapter), [chapter]);
  const vocabulary = useMemo(() => getVocabulary(chapter), [chapter]);
  const spiritualLevel = useMemo(() => getSpiritualLevel(chapter), [chapter]);
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
        <p className="text-xs text-stone-500 dark:text-stone-400/80 mt-0.5">
          {chapter.subtitle}
        </p>
      </div>

      {/* Spiritual level */}
      <div className={`rounded-lg border px-3 py-2 ${spiritualLevel.color}`}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <Sparkles className="h-3 w-3" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Niveau spirituel</span>
        </div>
        <p className="text-sm font-medium">{spiritualLevel.level}</p>
        <p className="text-[10px] opacity-70">{spiritualLevel.description}</p>
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
          <p className="text-sm text-stone-600 dark:text-stone-300/80 leading-relaxed italic">
            {chapter.translation}
          </p>
        </div>
      )}

      <Separator className="bg-stone-200/60 dark:bg-stone-700/30" />

      {/* Vocabulary */}
      {vocabulary.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-semibold text-stone-600 dark:text-stone-300/80">
              Vocabulaire clé
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {vocabulary.map((word, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-[10px] border-emerald-300/40 dark:border-emerald-700/20 text-stone-600 dark:text-stone-400/70"
              >
                {word}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Mirror questions */}
      {questions.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Eye className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-semibold text-stone-600 dark:text-stone-300/80">
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
            <p className="text-xs font-semibold text-stone-600 dark:text-stone-300/80">
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

  const selectableChapters = useMemo(
    () => allChapters.filter((c) => c.arabicVerse),
    []
  );

  const [leftId, setLeftId] = useState<string>(selectableChapters[0]?.id ?? 'a1');
  const [rightId, setRightId] = useState<string>(
    selectableChapters[1]?.id ?? 'a2'
  );

  const leftChapter = useMemo(() => getChapterById(leftId), [leftId]);
  const rightChapter = useMemo(() => getChapterById(rightId), [rightId]);

  // Theme comparison
  const themeComparison = useMemo(() => {
    if (!leftChapter || !rightChapter) return null;
    const leftThemes = getChapterThemes(leftChapter);
    const rightThemes = getChapterThemes(rightChapter);
    return compareSets(leftThemes, rightThemes);
  }, [leftChapter, rightChapter]);

  // Vocabulary comparison
  const vocabComparison = useMemo(() => {
    if (!leftChapter || !rightChapter) return null;
    const leftVocab = getVocabulary(leftChapter);
    const rightVocab = getVocabulary(rightChapter);
    return compareSets(leftVocab, rightVocab);
  }, [leftChapter, rightChapter]);

  // Spiritual level comparison
  const levelComparison = useMemo(() => {
    if (!leftChapter || !rightChapter) return null;
    const leftLevel = getSpiritualLevel(leftChapter);
    const rightLevel = getSpiritualLevel(rightChapter);
    return {
      left: leftLevel,
      right: rightLevel,
      isSame: leftLevel.level === rightLevel.level,
    };
  }, [leftChapter, rightChapter]);

  // Connections between chapters
  const connections = useMemo(() => {
    if (!leftChapter || !rightChapter) return [];
    return findConnections(leftChapter, rightChapter);
  }, [leftChapter, rightChapter]);

  // Similarity score
  const similarityScore = useMemo(() => {
    if (!themeComparison || !vocabComparison) return 0;
    const themeTotal = themeComparison.match.length + themeComparison.leftOnly.length + themeComparison.rightOnly.length;
    const vocabTotal = vocabComparison.match.length + vocabComparison.leftOnly.length + vocabComparison.rightOnly.length;
    const totalItems = themeTotal + vocabTotal;
    if (totalItems === 0) return 0;
    const matchItems = themeComparison.match.length + vocabComparison.match.length;
    return Math.round((matchItems / totalItems) * 100);
  }, [themeComparison, vocabComparison]);

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
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          <h1 className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-300 bg-clip-text font-serif text-3xl text-transparent md:text-4xl">
            Comparaison de Chapitres
          </h1>
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400/80">
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
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400/80 mb-1.5 block">
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
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400/80 mb-1.5 block">
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

        {/* Similarity score */}
        {leftChapter && rightChapter && (
          <motion.div variants={fadeIn} className="mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-amber-300/40 dark:border-amber-700/30 bg-amber-50/60 dark:bg-amber-950/20 px-4 py-2">
                <Link2 className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                <span className="text-xs font-medium text-stone-600 dark:text-stone-300/80">
                  Affinité spirituelle
                </span>
                <span className={`text-sm font-bold ${
                  similarityScore >= 50
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : similarityScore > 0
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-stone-400 dark:text-stone-500'
                }`}>
                  {similarityScore}%
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Side-by-side comparison */}
        {leftChapter && rightChapter && (
          <>
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

            {/* Connections between chapters */}
            {connections.length > 0 && (
              <motion.div variants={fadeIn} className="mb-6">
                <Card className="border-amber-300/40 dark:border-amber-700/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-50/80 via-amber-100/40 to-amber-50/80 dark:from-amber-950/20 dark:via-amber-900/10 dark:to-amber-950/20 p-4">
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                      <h4 className="font-semibold text-stone-700 dark:text-stone-200">
                        Connexions entre les chapitres
                      </h4>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    {connections.map((conn, idx) => {
                      const Icon = conn.icon;
                      return (
                        <div key={idx} className="flex items-start gap-3 rounded-lg bg-stone-50 dark:bg-stone-800/30 px-3 py-2.5">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/30 shrink-0 mt-0.5">
                            <Icon className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-stone-700 dark:text-stone-200/80">
                              {conn.type}
                            </p>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400/70 leading-relaxed mt-0.5">
                              {conn.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Comparison analysis cards */}
            <motion.div variants={fadeIn} className="space-y-4 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-200">
                  Analyse comparative
                </h3>
              </div>

              {/* Spiritual Level Comparison */}
              {levelComparison && (
                <Card className="border-amber-300/40 dark:border-amber-700/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-50/80 via-amber-100/40 to-amber-50/80 dark:from-amber-950/20 dark:via-amber-900/10 dark:to-amber-950/20 p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                      <h4 className="font-semibold text-stone-700 dark:text-stone-200">
                        Niveaux spirituels
                      </h4>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${levelComparison.left.color}`}>
                        <span className="text-sm font-medium">{leftChapter.number}</span>
                        <span className="text-xs">{levelComparison.left.level}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {levelComparison.isSame ? (
                          <ComparisonIndicator type="match" />
                        ) : (
                          <ComparisonIndicator type="neutral" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {levelComparison.isSame ? 'Identique' : 'Différent'}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${levelComparison.right.color}`}>
                        <span className="text-sm font-medium">{rightChapter.number}</span>
                        <span className="text-xs">{levelComparison.right.level}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Theme Comparison */}
              {themeComparison && (
                <Card className="border-amber-300/40 dark:border-amber-700/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-50/80 via-amber-100/40 to-amber-50/80 dark:from-amber-950/20 dark:via-amber-900/10 dark:to-amber-950/20 p-4">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                      <h4 className="font-semibold text-stone-700 dark:text-stone-200">
                        Comparaison des thèmes
                      </h4>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    {/* Common themes */}
                    {themeComparison.match.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <ComparisonIndicator type="match" />
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Thèmes communs ({themeComparison.match.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 ml-5">
                          {themeComparison.match.map((theme, i) => (
                            <Badge key={i} className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-[10px]">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {theme}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Left only */}
                    {themeComparison.leftOnly.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <ComparisonIndicator type="left" />
                          <span className="text-xs font-semibold text-rose-500 dark:text-rose-400">
                            Uniquement {leftChapter.number} ({themeComparison.leftOnly.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 ml-5">
                          {themeComparison.leftOnly.map((theme, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] border-rose-300/40 dark:border-rose-700/30 text-rose-600 dark:text-rose-400">
                              {theme}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Right only */}
                    {themeComparison.rightOnly.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <ComparisonIndicator type="right" />
                          <span className="text-xs font-semibold text-rose-500 dark:text-rose-400">
                            Uniquement {rightChapter.number} ({themeComparison.rightOnly.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 ml-5">
                          {themeComparison.rightOnly.map((theme, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] border-rose-300/40 dark:border-rose-700/30 text-rose-600 dark:text-rose-400">
                              {theme}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {themeComparison.match.length === 0 && themeComparison.leftOnly.length === 0 && themeComparison.rightOnly.length === 0 && (
                      <p className="text-sm text-stone-400 dark:text-stone-500/50 italic text-center py-3">
                        Aucun thème à comparer pour ces chapitres.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Vocabulary Comparison */}
              {vocabComparison && (vocabComparison.match.length > 0 || vocabComparison.leftOnly.length > 0 || vocabComparison.rightOnly.length > 0) && (
                <Card className="border-amber-300/40 dark:border-amber-700/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-50/80 via-amber-100/40 to-amber-50/80 dark:from-amber-950/20 dark:via-amber-900/10 dark:to-amber-950/20 p-4">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                      <h4 className="font-semibold text-stone-700 dark:text-stone-200">
                        Comparaison du vocabulaire
                      </h4>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    {vocabComparison.match.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <ComparisonIndicator type="match" />
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Vocabulaire partagé ({vocabComparison.match.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 ml-5">
                          {vocabComparison.match.map((word, i) => (
                            <Badge key={i} className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-[10px]">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {vocabComparison.leftOnly.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <ComparisonIndicator type="left" />
                          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                            Uniquement {leftChapter.number}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 ml-5">
                          {vocabComparison.leftOnly.map((word, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] border-stone-300/40 dark:border-stone-700/20 text-stone-600 dark:text-stone-400/70">
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {vocabComparison.rightOnly.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <ComparisonIndicator type="right" />
                          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                            Uniquement {rightChapter.number}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 ml-5">
                          {vocabComparison.rightOnly.map((word, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] border-stone-300/40 dark:border-stone-700/20 text-stone-600 dark:text-stone-400/70">
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
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
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400/80 leading-relaxed">
                  Comparez des chapitres de différentes parties (A, B, C) pour découvrir
                  comment les thèmes de la Fatiha résonnent dans les versets du Coran
                  et les niveaux de lecture approfondis. Les thèmes communs révèlent les
                  fils conducteurs spirituels entre les chapitres.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
