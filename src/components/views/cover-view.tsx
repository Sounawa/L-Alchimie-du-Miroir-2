'use client';

import { useAppStore } from '@/store/use-app-store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';

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
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: rng() * 100,
      y: rng() * 100,
      size: rng() * 3 + 1,
      delay: rng() * 5,
      duration: rng() * 3 + 2,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-amber-400/60 dark:bg-amber-300/50"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function CoverView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-stone-50 to-amber-100/30 dark:from-stone-950 dark:via-stone-900 dark:to-amber-950/20">
      {/* Decorative Islamic-style border pattern */}
      <div className="pointer-events-none absolute inset-3 sm:inset-5 border border-amber-300/20 dark:border-amber-600/15 rounded-xl sm:rounded-2xl" />
      <div className="pointer-events-none absolute inset-4 sm:inset-6 border border-amber-400/10 dark:border-amber-500/10 rounded-lg sm:rounded-xl" />
      {/* Corner ornaments */}
      <div className="pointer-events-none absolute top-5 sm:top-8 left-5 sm:left-8 text-amber-400/30 dark:text-amber-500/20 text-lg select-none">✦</div>
      <div className="pointer-events-none absolute top-5 sm:top-8 right-5 sm:right-8 text-amber-400/30 dark:text-amber-500/20 text-lg select-none">✦</div>
      <div className="pointer-events-none absolute bottom-5 sm:bottom-8 left-5 sm:left-8 text-amber-400/30 dark:text-amber-500/20 text-lg select-none">✦</div>
      <div className="pointer-events-none absolute bottom-5 sm:bottom-8 right-5 sm:right-8 text-amber-400/30 dark:text-amber-500/20 text-lg select-none">✦</div>
      {/* Subtle Islamic geometric pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.04]"
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
        className="relative z-10 flex flex-col items-center gap-5 px-6 py-12 text-center md:gap-7 md:py-16"
      >
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

        {/* Title with shimmer */}
        <motion.h1
          variants={item}
          className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-300 bg-clip-text text-4xl font-serif tracking-wide text-transparent sm:text-5xl md:text-6xl"
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
          className="text-lg text-stone-600 dark:text-stone-300/80 md:text-xl"
        >
          Méditer le Coran avec l&apos;Âme
        </motion.p>

        {/* Level badge */}
        <motion.div variants={item}>
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
            className="border-stone-300/50 bg-stone-100/70 px-3 py-1 text-xs text-stone-600 dark:border-stone-600/40 dark:bg-stone-800/50 dark:text-stone-300/70"
          >
            Partie A — Al-Fatiha
          </Badge>
          <Badge
            variant="outline"
            className="border-stone-300/50 bg-stone-100/70 px-3 py-1 text-xs text-stone-600 dark:border-stone-600/40 dark:bg-stone-800/50 dark:text-stone-300/70"
          >
            Partie B — Trésors du Coran
          </Badge>
          <Badge
            variant="outline"
            className="border-stone-300/50 bg-stone-100/70 px-3 py-1 text-xs text-stone-600 dark:border-stone-600/40 dark:bg-stone-800/50 dark:text-stone-300/70"
          >
            Partie C — Les Sept Niveaux
          </Badge>
        </motion.div>

        {/* Author line */}
        <motion.p
          variants={item}
          className="mt-3 text-sm italic text-stone-500 dark:text-stone-400/60"
        >
          Un guide de tadabbur progressif
        </motion.p>

        {/* Edition */}
        <motion.p
          variants={item}
          className="text-xs text-stone-400 dark:text-stone-500/50"
        >
          Édition 2025 — Pour usage personnel
        </motion.p>

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
            className="relative bg-gradient-to-r from-amber-700 to-amber-600 px-8 py-6 text-base font-medium text-amber-50 shadow-lg shadow-amber-900/30 transition-all hover:from-amber-600 hover:to-amber-500 hover:shadow-amber-800/40 hover:brightness-110"
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
