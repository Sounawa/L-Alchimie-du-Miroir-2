'use client';

import { useAppStore } from '@/store/use-app-store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

export function CoverView() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/20">
      {/* Subtle Islamic geometric pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
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

      {/* Radial warm glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(180,130,60,0.08)_0%,_transparent_70%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center gap-5 px-6 py-12 text-center md:gap-7 md:py-16"
      >
        {/* Mirror emoji with glow and float */}
        <motion.div variants={item} className="relative">
          <motion.span
            className="block text-7xl md:text-8xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🪞
          </motion.span>
          <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl" />
        </motion.div>

        {/* Title with shimmer */}
        <motion.h1
          variants={item}
          className="relative bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-4xl font-serif tracking-wide text-transparent sm:text-5xl md:text-6xl"
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
          className="text-lg text-stone-300/80 md:text-xl"
        >
          Méditer le Coran avec l&apos;Âme
        </motion.p>

        {/* Level badge */}
        <motion.div variants={item}>
          <Badge
            variant="outline"
            className="border-amber-600/50 bg-amber-950/40 px-4 py-1.5 text-sm text-amber-300/90"
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
            className="border-stone-600/40 bg-stone-800/50 px-3 py-1 text-xs text-stone-300/70"
          >
            Partie A — Al-Fatiha
          </Badge>
          <Badge
            variant="outline"
            className="border-stone-600/40 bg-stone-800/50 px-3 py-1 text-xs text-stone-300/70"
          >
            Partie B — Trésors du Coran
          </Badge>
          <Badge
            variant="outline"
            className="border-stone-600/40 bg-stone-800/50 px-3 py-1 text-xs text-stone-300/70"
          >
            Partie C — Les Sept Niveaux
          </Badge>
        </motion.div>

        {/* Author line */}
        <motion.p
          variants={item}
          className="mt-3 text-sm italic text-stone-400/60"
        >
          Un guide de tadabbur progressif
        </motion.p>

        {/* Edition */}
        <motion.p
          variants={item}
          className="text-xs text-stone-500/50"
        >
          Édition 2025 — Pour usage personnel
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={item} className="mt-4">
          <Button
            onClick={() => navigate('toc')}
            size="lg"
            className="bg-gradient-to-r from-amber-700 to-amber-600 px-8 py-6 text-base font-medium text-amber-50 shadow-lg shadow-amber-900/30 transition-all hover:from-amber-600 hover:to-amber-500 hover:shadow-amber-800/40 hover:brightness-110"
          >
            Commencer la méditation →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
