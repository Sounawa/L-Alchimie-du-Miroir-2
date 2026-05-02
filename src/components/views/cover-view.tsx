'use client';

import { useAppStore } from '@/store/use-app-store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { VerseOfTheDay } from '@/components/shared/verse-of-the-day';

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
        <p className="text-xs font-medium text-amber-600/60 dark:text-amber-400/70 mb-2 uppercase tracking-wider">
          Citation du jour
        </p>
        <div className="relative">
          <span className="absolute -top-2 -left-1 text-3xl text-amber-300/40 dark:text-amber-600/30 font-serif select-none leading-none">&ldquo;</span>
          <p className="text-sm italic text-stone-700 dark:text-stone-300/80 leading-relaxed pl-4 pr-1">
            {quote.text}
          </p>
          <span className="absolute -bottom-3 right-0 text-3xl text-amber-300/40 dark:text-amber-600/30 font-serif select-none leading-none">&rdquo;</span>
        </div>
        <p className="text-[11px] text-amber-700/60 dark:text-amber-400/70 mt-3 italic">
          — {quote.source}
        </p>
      </div>
    </div>
  );
}

// Staggered reveal with more dramatic entrance
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const itemDelay1 = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease: 'easeOut' } },
};

const itemDelay2 = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2, ease: 'easeOut' } },
};

const itemDelay3 = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' } },
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
  const isClient = useSyncExternalStore(
    () => () => {}, // noop subscribe
    () => true,     // client snapshot
    () => false     // server snapshot
  );
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

  if (!isClient) {
    return <div className="pointer-events-none absolute inset-0 overflow-hidden" />;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-amber-400/60 dark:bg-amber-300/50"
          style={{
            left: `${s.x}%`,
            bottom: `${-10 + (s.y % 30)}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `starRise ${s.duration}s ${s.delay}s ease-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function CoverView() {
  const navigate = useAppStore((s) => s.navigate);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50/80 via-amber-50/40 to-amber-100/50 dark:from-stone-950 dark:via-stone-900 dark:to-amber-950/20 animate-cover-entrance noise-overlay">
      {/* Decorative Islamic-style border pattern */}
      <div className="pointer-events-none absolute inset-3 sm:inset-5 border border-amber-300/20 dark:border-amber-600/15 rounded-xl sm:rounded-2xl" />
      <div className="pointer-events-none absolute inset-4 sm:inset-6 border border-amber-400/10 dark:border-amber-500/10 rounded-lg sm:rounded-xl" />
      {/* Corner ornaments */}
      <div className="pointer-events-none absolute top-5 sm:top-8 left-5 sm:left-8 text-amber-400/30 dark:text-amber-500/20 text-lg select-none">✦</div>
      <div className="pointer-events-none absolute top-5 sm:top-8 right-5 sm:right-8 text-amber-400/30 dark:text-amber-500/20 text-lg select-none">✦</div>
      <div className="pointer-events-none absolute bottom-5 sm:bottom-8 left-5 sm:left-8 text-amber-400/30 dark:text-amber-500/20 text-lg select-none">✦</div>
      <div className="pointer-events-none absolute bottom-5 sm:bottom-8 right-5 sm:right-8 text-amber-400/30 dark:text-amber-500/20 text-lg select-none">✦</div>
      {/* Secondary warm radial glow for light mode — parallax (client-only transform) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(251,191,36,0.10)_0%,_transparent_50%)] dark:bg-none" style={scrollY > 0 ? { transform: `translateY(${scrollY * -0.15}px)` } : undefined} />
      {/* Soft warm vignette in light mode — parallax (client-only transform) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(180,130,60,0.08)_100%)] dark:bg-none" style={scrollY > 0 ? { transform: `translateY(${scrollY * -0.1}px)` } : undefined} />
      {/* Subtle Islamic geometric pattern overlay — parallax (client-only transform) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(217, 169, 99, 0.3) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(217, 169, 99, 0.3) 1px, transparent 1px), linear-gradient(60deg, rgba(217, 169, 99, 0.15) 12%, transparent 12.5%, transparent 87%, rgba(217, 169, 99, 0.15) 87.5%), linear-gradient(120deg, rgba(217, 169, 99, 0.15) 12%, transparent 12.5%, transparent 87%, rgba(217, 169, 99, 0.15) 87.5%), linear-gradient(60deg, rgba(217, 169, 99, 0.15) 12%, transparent 12.5%, transparent 87%, rgba(217, 169, 99, 0.15) 87.5%), linear-gradient(120deg, rgba(217, 169, 99, 0.15) 12%, transparent 12.5%, transparent 87%, rgba(217, 169, 99, 0.15) 87.5%)',
          backgroundSize: '80px 140px, 80px 140px, 56px 97px, 56px 97px, 56px 97px, 56px 97px',
          ...(scrollY > 0 ? { transform: `translateY(${scrollY * -0.2}px)` } : {}),
        }}
      />

      {/* Sparkle/particle animation — parallax (client-only transform) */}
      <div style={scrollY > 0 ? { transform: `translateY(${scrollY * -0.25}px)` } : undefined}>
        <SparkleField />
      </div>

      {/* Radial warm glow (client-only transform) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(180,130,60,0.12)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(180,130,60,0.08)_0%,_transparent_70%)]" style={scrollY > 0 ? { transform: `translateY(${scrollY * -0.08}px)` } : undefined} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center gap-6 px-6 py-12 text-center max-w-lg md:gap-8 md:py-16 md:max-w-xl"
        style={scrollY > 0 ? { transform: `translateY(${scrollY * -0.3}px)` } : undefined}
      >
        {/* Decorative Bismillah calligraphy line — enhanced */}
        <motion.div variants={item} className="mb-2 relative">
          <div className="absolute inset-0 bg-amber-300/10 dark:bg-amber-500/5 blur-xl rounded-full scale-150" />
          <div className="relative flex items-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/30 dark:to-amber-500/20" />
            <p
              dir="rtl"
              lang="ar"
              className="arabic-verse text-lg md:text-xl text-amber-700/60 dark:text-amber-400/40 select-none"
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/30 dark:to-amber-500/20" />
          </div>
        </motion.div>

        {/* Mirror emoji with geometric mandala and dramatic multi-layer glow */}
        <motion.div variants={item} className="relative">
          {/* Slow-rotating geometric mandala behind mirror */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="mandala-slow-rotate w-48 h-48 md:w-56 md:h-56 opacity-[0.08] dark:opacity-[0.05]" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" className="text-amber-500" />
              <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="0.5" className="text-amber-400" />
              <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" className="text-amber-500" />
              {/* 8-pointed star pattern */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line key={angle} x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="0.3" className="text-amber-400" transform={`rotate(${angle} 100 100)`} />
              ))}
              {/* Diamond shapes at intersections */}
              {[0, 45, 90, 135].map((angle) => (
                <rect key={`d${angle}`} x="94" y="20" width="12" height="12" stroke="currentColor" strokeWidth="0.5" className="text-amber-500" transform={`rotate(${angle + 22.5} 100 100)`} />
              ))}
            </svg>
          </div>
          {/* Reverse-rotating inner mandala */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="mandala-reverse-rotate w-36 h-36 md:w-44 md:h-44 opacity-[0.06] dark:opacity-[0.04]" viewBox="0 0 200 200" fill="none">
              <polygon points="100,20 120,80 180,80 130,120 150,180 100,140 50,180 70,120 20,80 80,80" stroke="currentColor" strokeWidth="0.5" className="text-amber-400" />
              <polygon points="100,40 115,75 150,75 122,98 132,135 100,112 68,135 78,98 50,75 85,75" stroke="currentColor" strokeWidth="0.5" className="text-amber-500" />
            </svg>
          </div>
          <motion.span
            className="relative block text-8xl md:text-9xl"
            animate={{ y: [0, -8, 0], scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🪞
          </motion.span>
          {/* Layer 1: Outermost soft ethereal haze */}
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-300/10 blur-[60px] dark:bg-amber-400/8"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.85, 1.2, 0.85] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Layer 2: Mid glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-400/15"
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Layer 3: Inner bright glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-500/15 blur-xl dark:bg-amber-300/10"
            animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.92, 1.08, 0.92] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Layer 4: Core highlight */}
          <div className="absolute inset-0 rounded-full bg-amber-200/10 blur-lg dark:bg-amber-200/5" />
        </motion.div>

        {/* Title with shimmer and gentle float — staggered reveal */}
        <motion.h1
          variants={itemDelay1}
          className="animate-gentle-float relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-300 bg-clip-text text-3xl font-serif tracking-widest text-transparent sm:text-4xl md:text-5xl"
          style={{
            backgroundSize: '200% auto',
            animation: 'shimmer 5s ease-in-out infinite, gentleFloat 6s ease-in-out infinite',
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

        {/* Subtitle with serif styling — staggered reveal */}
        <motion.p
          variants={itemDelay2}
          className="text-lg font-serif text-stone-700/90 dark:text-amber-50/90 md:text-xl tracking-wide italic"
        >
          Méditer le Coran avec l&apos;Âme
        </motion.p>

        {/* Level badge — staggered reveal */}
        <motion.div variants={itemDelay3} className="mt-4">
          <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-100/60 px-4 py-1.5 text-sm text-amber-700 dark:border-amber-600/50 dark:bg-amber-950/40 dark:text-amber-300/90"
          >
            ✦ Niveau 2 : L&apos;Approfondissement ✦
          </Badge>
        </motion.div>

        {/* Three part tags — staggered reveal */}
        <motion.div
          variants={itemDelay3}
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
          className="mt-3 text-sm font-serif italic text-stone-600 dark:text-stone-300/80 tracking-wide"
        >
          Un guide de tadabbur progressif
        </motion.p>

        {/* Edition with decorative separator — perfectly centered */}
        <motion.div variants={item} className="w-full text-center">
          <p className="text-xs text-stone-500 dark:text-stone-400/80 tracking-wider">
            ✦ Édition 2025 — Pour usage personnel ✦
          </p>
        </motion.div>

        {/* Citation du Jour */}
        <motion.div variants={item} className="mt-4 max-w-md">
          <QuoteOfTheDay />
        </motion.div>

        {/* Verse of the Day */}
        <motion.div variants={item} className="mt-4 max-w-md w-full">
          <VerseOfTheDay />
        </motion.div>

        {/* CTA Button with shimmer reflection effect */}
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
            role="button"
            aria-label="Commencer la méditation"
            className="cta-shimmer-reflection relative rounded-full bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 px-10 py-6 text-base font-medium text-amber-50 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:from-amber-700 hover:via-amber-600 hover:to-amber-700 hover:shadow-amber-800/40 hover:brightness-110 hover:scale-[1.03] active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
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
        <span className="text-xs text-stone-400 dark:text-stone-500 select-none">Défiler</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-stone-400 dark:text-stone-500">
          <path d="M10 4 L10 14 M5 10 L10 15 L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  );
}
