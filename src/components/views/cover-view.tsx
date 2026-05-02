'use client';

import { useAppStore } from '@/store/use-app-store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';

// 7 inspiring Islamic/spiritual quotes in French for daily rotation
const dailyQuotes = [
  { text: "Le souvenir de Dieu est la paix du cœur. Chaque dhikr est une brique dans la maison de la sérénité.", source: "Sagesse soufie" },
  { text: "Ne pleurez pas sur ce que vous avez perdu, mais réjouissez-vous de ce que Dieu vous a donné.", source: "Imam Al-Ghazali" },
  { text: "La prière n'est pas une demande, c'est une conversation intime avec le Créateur de l'univers.", source: "Sagesse spirituelle" },
  { text: "Celui qui connaît son âme connaît son Seigneur. Le miroir du cœur reflète la lumière divine.", source: "Ibn Arabi" },
  { text: "La patience est la clé du soulagement. Après chaque difficulté vient la facilité.", source: "Coran 94:6" },
  { text: "Le meilleur d'entre vous est celui qui a le meilleur caractère. La beauté de l'âme surpasse toute beauté.", source: "Hadith" },
  { text: "Méditez sur la création, car elle est le livre de Dieu écrit dans le langage de la beauté.", source: "Sagesse contemplative" },
];

// Deterministic daily quote based on day of year
function getDailyQuote() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dailyQuotes[dayOfYear % dailyQuotes.length];
}

function QuoteOfTheDay() {
  const quote = useMemo(() => getDailyQuote(), []);

  return (
    <div className="animate-fade-in-up rounded-xl border border-amber-200/50 dark:border-amber-700/30 bg-gradient-to-br from-amber-50/80 via-stone-50/50 to-amber-50/60 dark:from-amber-950/20 dark:via-stone-900/30 dark:to-amber-950/10 px-6 py-4 relative overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-amber-200/20 dark:bg-amber-800/10 rounded-br-full" />
      <div className="relative">
        <p className="text-xs font-medium text-amber-600/60 dark:text-amber-400/50 mb-2 uppercase tracking-wider">
          Citation du jour
        </p>
        <div className="relative">
          <span className="absolute -top-2 -left-1 text-3xl text-amber-300/40 dark:text-amber-600/30 font-serif select-none leading-none">&ldquo;</span>
          <p className="text-sm italic text-stone-700 dark:text-stone-300/80 leading-relaxed pl-4 pr-1">
            {quote.text}
          </p>
          <span className="absolute -bottom-3 right-0 text-3xl text-amber-300/40 dark:text-amber-600/30 font-serif select-none leading-none">&rdquo;</span>
        </div>
        <p className="text-[11px] text-amber-700/60 dark:text-amber-400/50 mt-3 italic">
          — {quote.source}
        </p>
      </div>
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Sparkle/particle data
interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

// Deterministic pseudo-random number generator (mulberry32)
function seededRandom(seed: number) {
  let t = seed + 0x6D2B79F5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function SparkleField() {
  const sparkles = useMemo<Sparkle[]>(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: rng() * 100,
      y: rng() * 100,
      size: rng() * 3 + 1,
      delay: rng() * 8,
      duration: rng() * 8 + 8,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-amber-400/60 dark:bg-amber-300/50"
          style={{
            left: `${s.x}%`,
            bottom: `${-10 + (s.y % 30)}%`,
            width: s.size,
            height: s.size,
            animation: `starRise ${s.duration}s ${s.delay}s ease-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function CoverView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50/80 via-amber-50/40 to-amber-100/50 dark:from-stone-950 dark:via-stone-900 dark:to-amber-950/20">
      {/* Decorative Islamic-style border pattern */}
      <div className="pointer-events-none absolute inset-3 sm:inset-5 border border-amber-300/20 dark:border-amber-600/15 rounded-xl sm:rounded-2xl" />
      <div className="pointer-events-none absolute inset-4 sm:inset-6 border border-amber-400/10 dark:border-amber-500/10 rounded-lg sm:rounded-xl" />
      {/* Corner ornaments */}
      <div className="pointer-events-none absolute top-5 sm:top-8 left-5 sm:left-8 text-amber-400/30 dark:text-amber-500/20 text-lg select-none">✦</div>
      <div className="pointer-events-none absolute top-5 sm:top-8 right-5 sm:right-8 text-amber-400/30 dark:text-amber-500/20 text-lg select-none">✦</div>
      <div className="pointer-events-none absolute bottom-5 sm:bottom-8 left-5 sm:left-8 text-amber-400/30 dark:text-amber-500/20 text-lg select-none">✦</div>
      <div className="pointer-events-none absolute bottom-5 sm:bottom-8 right-5 sm:right-8 text-amber-400/30 dark:text-amber-500/20 text-lg select-none">✦</div>
      {/* Secondary warm radial glow for light mode */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(251,191,36,0.10)_0%,_transparent_50%)] dark:bg-none" />
      {/* Soft warm vignette in light mode */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(180,130,60,0.08)_100%)] dark:bg-none" />
      {/* Subtle Islamic geometric pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(217, 169, 99, 0.3) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(217, 169, 99, 0.3) 1px, transparent 1px),
            linear-gradient(60deg, rgba(217, 169, 99, 0.15) 12%, transparent 12.5%, transparent 87%, rgba(217, 169, 99, 0.15) 87.5%),
            linear-gradient(120deg, rgba(217, 169, 99, 0.15) 12%, transparent 12.5%, transparent 87%, rgba(217, 169, 99, 0.15) 87.5%),
            linear-gradient(60deg, rgba(217, 169, 99, 0.15) 12%, transparent 12.5%, transparent 87%, rgba(217, 169, 99, 0.15) 87.5%),
            linear-gradient(120deg, rgba(217, 169, 99, 0.15) 12%, transparent 12.5%, transparent 87%, rgba(217, 169, 99, 0.15) 87.5%)
          `,
          backgroundSize: '80px 140px, 80px 140px, 56px 97px, 56px 97px, 56px 97px, 56px 97px',
        }}
      />

      {/* Sparkle/particle animation */}
      <SparkleField />

      {/* Radial warm glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(180,130,60,0.12)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(180,130,60,0.08)_0%,_transparent_70%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center gap-6 px-6 py-12 text-center md:gap-8 md:py-16"
      >
        {/* Decorative Bismillah calligraphy line */}
        <motion.div variants={item} className="mb-2 opacity-40 dark:opacity-25">
          <p
            dir="rtl"
            lang="ar"
            className="arabic-verse text-lg md:text-xl text-amber-700 dark:text-amber-400/50 select-none"
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        </motion.div>

        {/* Mirror emoji with dramatic glow and float */}
        <motion.div variants={item} className="relative">
          <motion.span
            className="block text-7xl md:text-8xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🪞
          </motion.span>
          {/* Multi-layer glow effect */}
          <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-2xl dark:bg-amber-400/30" />
          <div className="absolute inset-0 rounded-full bg-amber-300/15 blur-3xl dark:bg-amber-300/10" />
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl"
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Title with shimmer and gentle float */}
        <motion.h1
          variants={item}
          className="animate-gentle-float relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-300 bg-clip-text text-3xl font-serif tracking-wide text-transparent sm:text-4xl md:text-5xl"
          style={{
            backgroundSize: '200% auto',
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        >
          L&apos;Alchimie du Miroir
          <style>{`
            @keyframes shimmer {
              0% { background-position: 0% center; }
              50% { background-position: 100% center; }
              100% { background-position: 0% center; }
            }
          `}</style>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="text-lg text-stone-800 dark:text-stone-100 md:text-xl"
        >
          Méditer le Coran avec l&apos;Âme
        </motion.p>

        {/* Level badge */}
        <motion.div variants={item} className="mt-4">
          <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-100/60 px-4 py-1.5 text-sm text-amber-700 dark:border-amber-600/50 dark:bg-amber-950/40 dark:text-amber-300/90"
          >
            ✦ Niveau 2 : L&apos;Approfondissement ✦
          </Badge>
        </motion.div>

        {/* Three part tags */}
        <motion.div
          variants={item}
          className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-3"
        >
          <Badge
            variant="outline"
            className="border-stone-300/50 bg-stone-100/70 px-4 py-1.5 text-xs text-stone-700 dark:border-stone-600/40 dark:bg-stone-800/50 dark:text-stone-200"
          >
            Partie A — Al-Fatiha
          </Badge>
          <Badge
            variant="outline"
            className="border-stone-300/50 bg-stone-100/70 px-4 py-1.5 text-xs text-stone-700 dark:border-stone-600/40 dark:bg-stone-800/50 dark:text-stone-200"
          >
            Partie B — Trésors du Coran
          </Badge>
          <Badge
            variant="outline"
            className="border-stone-300/50 bg-stone-100/70 px-4 py-1.5 text-xs text-stone-700 dark:border-stone-600/40 dark:bg-stone-800/50 dark:text-stone-200"
          >
            Partie C — Les Sept Niveaux
          </Badge>
        </motion.div>

        {/* Author line */}
        <motion.p
          variants={item}
          className="mt-3 text-sm italic text-stone-600 dark:text-stone-300/70"
        >
          Un guide de tadabbur progressif
        </motion.p>

        {/* Edition */}
        <motion.p
          variants={item}
          className="text-xs text-stone-500 dark:text-stone-400/60"
        >
          Édition 2025 — Pour usage personnel
        </motion.p>

        {/* Citation du Jour */}
        <motion.div variants={item} className="mt-4 max-w-md">
          <QuoteOfTheDay />
        </motion.div>

        {/* CTA Button with breathing pulse */}
        <motion.div variants={item} className="mt-4 relative">
          {/* Breathing shadow pulse */}
          <motion.div
            className="absolute inset-0 rounded-md bg-amber-500/20 blur-xl"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <Button
            onClick={() => navigate('toc')}
            size="lg"
            className="relative rounded-full bg-gradient-to-r from-amber-700 to-amber-600 px-10 py-6 text-base font-medium text-amber-50 shadow-lg shadow-amber-900/30 transition-all hover:from-amber-600 hover:to-amber-500 hover:shadow-amber-800/40 hover:brightness-110 hover:scale-105"
          >
            Commencer la méditation →
          </Button>
        </motion.div>
      </motion.div>

      {/* Pulsing scroll down indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ opacity: [0.4, 0.8, 0.4], y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs text-stone-400 dark:text-stone-500/60 select-none">Défiler</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-stone-400 dark:text-stone-500/60">
          <path d="M10 4 L10 14 M5 10 L10 15 L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  );
}
