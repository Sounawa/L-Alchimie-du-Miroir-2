'use client';

import { useAppStore } from '@/store/use-app-store';
import { siteContent } from '@/data/chapters';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Sparkles, BookOpen, Lightbulb, BookMarked, Clock, Layers, Star, ArrowRight } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Staggered row animation for structure table
const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
};

// Icons for the structure table rows
const partIcons = [
  <Star key="a" className="size-4 text-amber-500" />,
  <BookMarked key="b" className="size-4 text-amber-500" />,
  <Layers key="c" className="size-4 text-amber-500" />,
];

// Part colors for badges
const partColors: Record<number, string> = {
  0: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  1: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  2: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
};

// Islamic pattern divider component
function IslamicDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <span className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent via-amber-400/30 to-amber-400/30 dark:via-amber-600/20 dark:to-amber-600/20" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-amber-400/40 dark:text-amber-600/30 shrink-0">
        <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="0.5" fill="none" />
      </svg>
      <span className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent via-amber-400/30 to-amber-400/30 dark:via-amber-600/20 dark:to-amber-600/20" />
    </div>
  );
}

export function IntroView() {
  const navigate = useAppStore((s) => s.navigate);
  const { intro } = siteContent;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-stone-50 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      {/* Subtle geometric pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] dark:opacity-[0.025]"
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
        className="relative z-10 mx-auto max-w-3xl p-6 md:p-12"
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('toc')}
            className="mb-4 text-stone-500 hover:text-amber-600 dark:text-stone-400/70 dark:hover:text-amber-300/80"
          >
            ← Table des matières
          </Button>
          <h1 className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-300 bg-clip-text font-serif text-3xl text-transparent md:text-4xl">
            Introduction
          </h1>
          <div className="mx-auto mt-4 flex items-center gap-3">
            <span className="h-px flex-1 max-w-20 bg-gradient-to-r from-amber-500/40 to-transparent dark:from-amber-600/40" />
            <BookOpen className="size-4 text-amber-500/50" />
            <span className="h-px flex-1 max-w-20 bg-gradient-to-l from-amber-500/40 to-transparent dark:from-amber-600/40" />
          </div>
        </motion.div>

        {/* Du Niveau 1 au Niveau 2 */}
        <motion.section variants={fadeIn} className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-amber-600 dark:text-amber-300/80">
            <Sparkles className="size-4" />
            Du Niveau 1 au Niveau 2
          </h2>
          {intro.fromLevel1to2.split('\n\n').map((paragraph, i) => (
            <p
              key={i}
              className="mb-4 leading-relaxed text-stone-600 dark:text-stone-300/80"
            >
              {paragraph}
            </p>
          ))}
        </motion.section>

        <motion.div variants={fadeIn}>
          <IslamicDivider />
        </motion.div>

        {/* Ce qui change au Niveau 2 */}
        <motion.section variants={fadeIn} className="mb-10">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-amber-600 dark:text-amber-300/80">
            <Lightbulb className="size-4" />
            Ce qui change au Niveau 2
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {intro.whatChanges.map((change, idx) => (
              <motion.div key={idx} variants={fadeIn}>
                <Card className="border-stone-200/80 bg-white/80 shadow-sm transition-all duration-300 hover:border-amber-300/60 hover:shadow-md hover:shadow-amber-100/50 hover:scale-[1.02] dark:border-stone-700/30 dark:bg-stone-800/40 dark:hover:border-amber-700/30 dark:hover:bg-stone-800/60 dark:hover:shadow-amber-900/10">
                  <CardHeader>
                    <CardTitle className="text-sm text-amber-700 dark:text-amber-200/80">
                      {change.title}
                    </CardTitle>
                    <CardDescription className="text-stone-500 dark:text-stone-400/80">
                      {change.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.div variants={fadeIn}>
          <IslamicDivider />
        </motion.div>

        {/* Structure du Niveau 2 — Enhanced with animated part cards */}
        <motion.section variants={fadeIn} className="mb-10">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-amber-600 dark:text-amber-300/80">
            <Layers className="size-4" />
            Structure du Niveau 2
          </h2>

          {/* Animated part cards */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {intro.structure.map((row, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.99 }}
                className="cursor-pointer"
                onClick={() => navigate('toc')}
              >
                <div className={`rounded-xl border border-stone-200/80 dark:border-stone-700/30 bg-white/80 dark:bg-stone-800/40 p-4 shadow-sm transition-all duration-300 hover:border-amber-300/60 hover:shadow-md hover:shadow-amber-100/50 dark:hover:border-amber-700/30 dark:hover:shadow-amber-900/10`}>
                  <div className="flex items-center gap-3">
                    <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${partColors[idx] || 'bg-amber-100 text-amber-800'}`}>
                      {partIcons[idx] || <Star className="size-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-stone-800 dark:text-stone-200/90">
                        {row.part}
                      </h3>
                      <p className="text-sm text-stone-600 dark:text-stone-300/80 truncate">
                        {row.content}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400/80">
                        {row.chapters}
                      </p>
                      <div className="flex items-center gap-1 justify-end text-xs text-stone-500 dark:text-stone-400/80">
                        <Clock className="size-3" />
                        {row.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Also keep the table for detailed reference */}
          <div className="overflow-hidden rounded-lg border border-stone-200/80 bg-white/80 dark:border-stone-700/30 dark:bg-stone-900/40">
            <Table>
              <TableHeader>
                <TableRow className="border-stone-200/60 hover:bg-transparent dark:border-stone-700/30">
                  <TableHead className="text-amber-600 dark:text-amber-400/60">Partie</TableHead>
                  <TableHead className="text-amber-600 dark:text-amber-400/60">Contenu</TableHead>
                  <TableHead className="text-amber-600 dark:text-amber-400/60">Chapitres</TableHead>
                  <TableHead className="text-amber-600 dark:text-amber-400/60">Durée</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {intro.structure.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className="border-stone-100/60 hover:bg-amber-50/50 dark:border-stone-700/20 dark:hover:bg-amber-900/10"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2 text-stone-700 dark:text-stone-200/70">
                        {partIcons[idx] || null}
                        {row.part}
                      </div>
                    </TableCell>
                    <TableCell className="text-stone-600 dark:text-stone-300/80">
                      {row.content}
                    </TableCell>
                    <TableCell className="text-amber-600 dark:text-amber-400/80">
                      {row.chapters}
                    </TableCell>
                    <TableCell className="text-stone-500 dark:text-stone-400/80">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3 text-stone-400 dark:text-stone-500/50" />
                        {row.duration}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.section>

        <motion.div variants={fadeIn}>
          <IslamicDivider />
        </motion.div>

        {/* Advice callout — with pulsing glow border */}
        <motion.section variants={fadeIn} className="mb-10">
          <div className="rounded-xl border-2 border-amber-300/60 dark:border-amber-600/40 bg-amber-50/80 dark:bg-amber-950/20 p-5 relative overflow-hidden animate-pulse-glow-border">
            {/* Pulsing glow effect */}
            <div className="absolute inset-0 rounded-xl border-2 border-amber-400/30 dark:border-amber-500/20 pointer-events-none" style={{ animation: 'pulseGlow 3s ease-in-out infinite' }} />
            <div className="relative">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-amber-500 dark:text-amber-400">✦</span>
                <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300/80">
                  Conseil
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-amber-800/70 dark:text-amber-200/60">
                {intro.advice}
              </p>
            </div>
          </div>
        </motion.section>

        <motion.div variants={fadeIn}>
          <IslamicDivider />
        </motion.div>

        {/* Hadith quotes */}
        <motion.section variants={fadeIn} className="mb-10">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-amber-600 dark:text-amber-300/80">
            <BookMarked className="size-4" />
            Paroles de guidance
          </h2>

          {/* Hadith about the lemon and the date */}
          <div className="mb-4 rounded-lg border-l-4 border-amber-400/60 bg-amber-50/50 py-3 pr-4 pl-5 dark:border-amber-500/40 dark:bg-stone-800/30">
            <p className="mb-2 text-sm leading-relaxed text-stone-600 italic dark:text-stone-300/80">
              &ldquo;L&apos;exemple d&apos;un bon compagnon et d&apos;un mauvais compagnon
              est comme celui du vendeur de musc et du forgeron : le vendeur de
              musc te donne un parfum ou tu en achètes, ou au minimum tu sens une
              bonne odeur. Quant au forgeron, il te brûle les vêtements ou tu
              sents une mauvaise odeur.&rdquo;
            </p>
            <span className="text-xs text-amber-600/70 dark:text-amber-400/70">
              — Hadith rapporté par Al-Bukhari et Muslim
            </span>
          </div>

          {/* Hadith about seeking knowledge */}
          <div className="rounded-lg border-l-4 border-amber-400/60 bg-amber-50/50 py-3 pr-4 pl-5 dark:border-amber-500/40 dark:bg-stone-800/30">
            <p className="mb-2 text-sm leading-relaxed text-stone-600 italic dark:text-stone-300/80">
              &ldquo;Quiconque emprunte un chemin à la recherche de la science,
              Allah lui facilite un chemin vers le Paradis.&rdquo;
            </p>
            <span className="text-xs text-amber-600/70 dark:text-amber-400/70">
              — Hadith rapporté par Muslim
            </span>
          </div>
        </motion.section>

        {/* CTA "Commencer" button that navigates to TOC */}
        <motion.div variants={fadeIn} className="mt-8 text-center">
          <Separator className="mb-8 bg-stone-200/60 dark:bg-stone-700/30" />
          <p className="mb-4 text-sm text-stone-500 dark:text-stone-400/80">
            Prêt à commencer votre méditation ?
          </p>
          <Button
            onClick={() => navigate('toc')}
            size="lg"
            className="bg-gradient-to-r from-amber-700 to-amber-600 px-8 text-amber-50 shadow-lg shadow-amber-900/30 transition-all hover:from-amber-600 hover:to-amber-500 hover:brightness-110 hover:scale-[1.02] active:scale-95"
          >
            Commencer
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>

        {/* Original CTA for chapter A1 */}
        <motion.div variants={fadeIn} className="mt-6 text-center">
          <Button
            onClick={() => navigate('chapter', 'a1')}
            variant="outline"
            size="sm"
            className="border-amber-300/50 dark:border-amber-700/30 text-amber-700 hover:bg-amber-100/50 dark:text-amber-300 dark:hover:bg-amber-900/20"
          >
            Ou commencer avec A1 — Bismillah →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
