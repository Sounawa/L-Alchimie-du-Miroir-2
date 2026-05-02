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
import { ArrowLeft, Sparkles, BookOpen, Lightbulb } from 'lucide-react';

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

export function IntroView() {
  const navigate = useAppStore((s) => s.navigate);
  const { intro } = siteContent;

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
        className="relative z-10 mx-auto max-w-3xl p-6 md:p-12"
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('toc')}
            className="mb-4 text-stone-400/70 hover:text-amber-300/80"
          >
            ← Table des matières
          </Button>
          <h1 className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text font-serif text-3xl text-transparent md:text-4xl">
            Introduction
          </h1>
          <div className="mx-auto mt-4 flex items-center gap-3">
            <span className="h-px flex-1 max-w-20 bg-gradient-to-r from-amber-600/40 to-transparent" />
            <BookOpen className="size-4 text-amber-500/50" />
            <span className="h-px flex-1 max-w-20 bg-gradient-to-l from-amber-600/40 to-transparent" />
          </div>
        </motion.div>

        {/* Du Niveau 1 au Niveau 2 */}
        <motion.section variants={fadeIn} className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-amber-300/80">
            <Sparkles className="size-4" />
            Du Niveau 1 au Niveau 2
          </h2>
          {intro.fromLevel1to2.split('\n\n').map((paragraph, i) => (
            <p
              key={i}
              className="mb-4 leading-relaxed text-stone-300/70"
            >
              {paragraph}
            </p>
          ))}
        </motion.section>

        <motion.div variants={fadeIn}>
          <Separator className="my-8 bg-stone-700/30" />
        </motion.div>

        {/* Ce qui change au Niveau 2 */}
        <motion.section variants={fadeIn} className="mb-10">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-amber-300/80">
            <Lightbulb className="size-4" />
            Ce qui change au Niveau 2
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {intro.whatChanges.map((change, idx) => (
              <motion.div key={idx} variants={fadeIn}>
                <Card className="border-stone-700/30 bg-stone-800/40 transition-colors hover:border-amber-700/30 hover:bg-stone-800/60">
                  <CardHeader>
                    <CardTitle className="text-sm text-amber-200/80">
                      {change.title}
                    </CardTitle>
                    <CardDescription className="text-stone-400/60">
                      {change.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.div variants={fadeIn}>
          <Separator className="my-8 bg-stone-700/30" />
        </motion.div>

        {/* Structure du Niveau 2 */}
        <motion.section variants={fadeIn} className="mb-10">
          <h2 className="mb-5 text-lg font-semibold text-amber-300/80">
            Structure du Niveau 2
          </h2>
          <div className="overflow-hidden rounded-lg border border-stone-700/30">
            <Table>
              <TableHeader>
                <TableRow className="border-stone-700/30 hover:bg-transparent">
                  <TableHead className="text-amber-400/60">Partie</TableHead>
                  <TableHead className="text-amber-400/60">Contenu</TableHead>
                  <TableHead className="text-amber-400/60">Chapitres</TableHead>
                  <TableHead className="text-amber-400/60">Durée</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {intro.structure.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className="border-stone-700/20 hover:bg-amber-900/10"
                  >
                    <TableCell className="font-medium text-stone-200/70">
                      {row.part}
                    </TableCell>
                    <TableCell className="text-stone-300/60">
                      {row.content}
                    </TableCell>
                    <TableCell className="text-amber-400/60">
                      {row.chapters}
                    </TableCell>
                    <TableCell className="text-stone-400/50">
                      {row.duration}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.section>

        <motion.div variants={fadeIn}>
          <Separator className="my-8 bg-stone-700/30" />
        </motion.div>

        {/* Advice callout */}
        <motion.section variants={fadeIn} className="mb-10">
          <div className="rounded-lg border border-amber-700/30 bg-amber-950/20 p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-amber-400">✦</span>
              <h3 className="text-sm font-semibold text-amber-300/80">
                Conseil
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-amber-200/60">
              {intro.advice}
            </p>
          </div>
        </motion.section>

        <motion.div variants={fadeIn}>
          <Separator className="my-8 bg-stone-700/30" />
        </motion.div>

        {/* Hadith quotes */}
        <motion.section variants={fadeIn} className="mb-10">
          <h2 className="mb-5 text-lg font-semibold text-amber-300/80">
            Paroles de guidance
          </h2>

          {/* Hadith about the lemon and the date */}
          <div className="mb-4 rounded-lg border-l-4 border-amber-500/40 bg-stone-800/30 py-3 pr-4 pl-5">
            <p className="mb-2 text-sm leading-relaxed text-stone-300/70 italic">
              &ldquo;L&apos;exemple d&apos;un bon compagnon et d&apos;un mauvais compagnon
              est comme celui du vendeur de musc et du forgeron : le vendeur de
              musc te donne un parfum ou tu en achètes, ou au minimum tu sens une
              bonne odeur. Quant au forgeron, il te brûle les vêtements ou tu
              sents une mauvaise odeur.&rdquo;
            </p>
            <span className="text-xs text-amber-400/50">
              — Hadith rapporté par Al-Bukhari et Muslim
            </span>
          </div>

          {/* Hadith about seeking knowledge */}
          <div className="rounded-lg border-l-4 border-amber-500/40 bg-stone-800/30 py-3 pr-4 pl-5">
            <p className="mb-2 text-sm leading-relaxed text-stone-300/70 italic">
              &ldquo;Quiconque emprunte un chemin à la recherche de la science,
              Allah lui facilite un chemin vers le Paradis.&rdquo;
            </p>
            <span className="text-xs text-amber-400/50">
              — Hadith rapporté par Muslim
            </span>
          </div>
        </motion.section>

        {/* CTA to first chapter */}
        <motion.div variants={fadeIn} className="mt-8 text-center">
          <Separator className="mb-8 bg-stone-700/30" />
          <p className="mb-4 text-sm text-stone-400/60">
            Prêt à commencer votre méditation ?
          </p>
          <Button
            onClick={() => navigate('chapter', 'a1')}
            size="lg"
            className="bg-gradient-to-r from-amber-700 to-amber-600 px-8 text-amber-50 shadow-lg shadow-amber-900/30 transition-all hover:from-amber-600 hover:to-amber-500 hover:brightness-110"
          >
            Commencer avec A1 — Bismillah →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
