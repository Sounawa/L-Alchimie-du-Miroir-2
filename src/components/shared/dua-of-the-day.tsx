'use client';

import { useAppStore } from '@/store/use-app-store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Heart, Copy, Check } from 'lucide-react';
import { useMemo, useState, useCallback } from 'react';

interface DuaEntry {
  arabic: string;
  french: string;
  source: string;
}

const duas: DuaEntry[] = [
  {
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    french: 'Notre Seigneur, accorde-nous une bonne chose dans ce monde et une bonne chose dans l\'au-delà, et protège-nous du châtiment du Feu.',
    source: 'Sourate 2, verset 201',
  },
  {
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    french: 'Ô mon Seigneur, ouvre-moi ma poitrine, et facilite ma mission.',
    source: 'Sourate 20, versets 25-26',
  },
  {
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    french: 'Ô mon Seigneur, augmente ma connaissance.',
    source: 'Sourate 20, verset 114',
  },
  {
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ',
    french: 'Notre Seigneur, ne laisse pas nos cœurs dévier après que Tu nous as guidés, et accorde-nous une miséricorde de Ta part. C\'est Toi, certes, le Grand Donateur.',
    source: 'Sourate 3, verset 8',
  },
  {
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    french: 'Allah nous suffit et Il est le meilleur garant.',
    source: 'Sourate 3, verset 173',
  },
  {
    arabic: 'رَبِّ إِنِّي أَعُوذُ بِكَ أَنْ أَسْأَلَكَ مَا لَيْسَ لِي بِهِ عِلْمٌ ۖ وَإِلَّا تَغْفِرْ لِي وَتَرْحَمْنِي أَكُن مِّنَ الْخَاسِرِينَ',
    french: 'Ô mon Seigneur, je cherche refuge auprès de Toi contre le fait de Te demander ce dont je n\'ai pas connaissance. Et si Tu ne me pardonnes pas et ne me fais pas miséricorde, je serai du nombre des perdants.',
    source: 'Sourate 11, verset 47',
  },
  {
    arabic: 'لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    french: 'Il n\'y a de dieu que Toi ! Gloire à Toi ! J\'ai été du nombre des injustes.',
    source: 'Sourate 21, verset 87 (Dou\'a de Yunus)',
  },
  {
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    french: 'Notre Seigneur, fais que nos épouses et nos enfants soient la joie de nos yeux, et fais de nous des guides pour les pieux.',
    source: 'Sourate 25, verset 74',
  },
  {
    arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ',
    french: 'Ô mon Seigneur, inspire-moi pour que je rende grâce pour Tes bienfaits dont Tu m\'as comblé ainsi que mes parents, et pour que je fasse une bonne œuvre que Tu agrées.',
    source: 'Sourate 46, verset 15',
  },
  {
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
    french: 'Ô Allah, je cherche refuge auprès de Toi contre l\'anxiété et la tristesse, et je cherche refuge auprès de Toi contre l\'incapacité et la paresse.',
    source: 'Hadith — Rapporté par Abu Dawud',
  },
  {
    arabic: 'رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    french: 'Notre Seigneur, pardonne-nous nos péchés et nos excès, affermis nos pas et donne-nous la victoire sur les gens mécréants.',
    source: 'Sourate 3, verset 147',
  },
  {
    arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    french: 'Ô mon Seigneur, fais que j\'accomplisse la prière et une partie de ma descendance. Notre Seigneur, agrée mon invocation.',
    source: 'Sourate 14, verset 40',
  },
  {
    arabic: 'رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ أَنْ آمِنُوا بِرَبِّكُمْ فَآمَنَّا ۚ رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ',
    french: 'Notre Seigneur, nous avons entendu un appel à la foi : « Croyez en votre Seigneur », et nous avons cru. Notre Seigneur, pardonne-nous nos péchés, efface nos méfaits et fais nous mourir avec les vertueux.',
    source: 'Sourate 3, verset 193',
  },
  {
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    french: 'Gloire à Allah et par Sa louange. Gloire à Allah le Très Grand.',
    source: 'Hadith — Rapporté par Al-Bukhari et Muslim',
  },
];

/** Get the day-of-year (1-365/366) */
function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function DuaOfTheDay() {
  const dismissDuaOfDay = useAppStore((s) => s.dismissDuaOfDay);
  const isDuaOfDayDismissed = useAppStore((s) => s.isDuaOfDayDismissed);
  const [copied, setCopied] = useState(false);

  const dua = useMemo(() => {
    const dayOfYear = getDayOfYear();
    const index = dayOfYear % duas.length;
    return duas[index];
  }, []);

  const handleCopy = useCallback(async () => {
    const text = `${dua.arabic}\n\n${dua.french}\n— ${dua.source}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, [dua]);

  if (isDuaOfDayDismissed()) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mb-6"
    >
      <div className="rounded-xl border border-emerald-400/40 dark:border-emerald-700/30 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-emerald-50/50 dark:from-emerald-950/30 dark:via-teal-900/15 dark:to-emerald-950/20 shadow-sm shadow-emerald-200/30 dark:shadow-emerald-900/10 overflow-hidden relative">
        {/* Decorative ornaments */}
        <div className="absolute top-2 left-3 text-emerald-400/25 dark:text-emerald-600/20 text-xs select-none">✦</div>
        <div className="absolute top-2 right-3 text-emerald-400/25 dark:text-emerald-600/20 text-xs select-none">✦</div>

        {/* Subtle teal glow background */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-200/20 dark:bg-teal-800/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 relative">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-emerald-500 dark:text-emerald-400 fill-emerald-500/20 dark:fill-emerald-400/20" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400/80">
              Du&apos;a du Jour
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="rounded-full p-1.5 text-stone-400 hover:text-emerald-600 dark:text-stone-500 dark:hover:text-emerald-300 transition-colors hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20"
              title="Copier le du'a"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={dismissDuaOfDay}
              className="rounded-full p-1 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 relative">
          {/* Arabic du'a */}
          <div className="text-center mb-4">
            <p
              className="arabic-verse text-2xl md:text-3xl leading-relaxed text-emerald-800 dark:text-emerald-200"
              lang="ar"
              dir="rtl"
            >
              {dua.arabic}
            </p>
          </div>

          {/* Decorative separator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-emerald-400/40 dark:to-emerald-600/30" />
            <span className="text-emerald-400/50 dark:text-emerald-600/40 text-[10px]">✦</span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-emerald-400/40 dark:to-emerald-600/30" />
          </div>

          {/* French translation */}
          <div className="mb-3">
            <p className="text-sm italic text-stone-600 dark:text-stone-300/80 leading-relaxed">
              {dua.french}
            </p>
          </div>

          {/* Source attribution */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-emerald-500/60 dark:text-emerald-400/70">—</span>
            <p className="text-[10px] text-emerald-600/60 dark:text-emerald-400/70 font-medium">
              {dua.source}
            </p>
          </div>
        </div>

        {/* Bottom decorative ornament */}
        <div className="flex items-center justify-center pb-2 gap-2">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-emerald-400/20 dark:to-emerald-600/15" />
          <span className="text-emerald-400/30 dark:text-emerald-600/20 text-[8px] select-none">✦ ✦ ✦</span>
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-emerald-400/20 dark:to-emerald-600/15" />
        </div>
      </div>
    </motion.div>
  );
}
