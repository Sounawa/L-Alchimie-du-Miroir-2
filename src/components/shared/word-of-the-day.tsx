'use client';

import { useAppStore } from '@/store/use-app-store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, BookOpen, Sparkles } from 'lucide-react';
import { useMemo } from 'react';

interface QuranicWord {
  arabic: string;
  transliteration: string;
  literalMeaning: string;
  mirrorDimension: string;
  verse: string;
  verseSource: string;
  chapterId: string;
}

const quranicWords: QuranicWord[] = [
  {
    arabic: 'بِسْمِ',
    transliteration: 'Bismi',
    literalMeaning: 'Avec le nom / Par le nom',
    mirrorDimension: 'Je commence chaque acte en me souvenant de Celui qui me donne la capacité d\'agir',
    verse: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    verseSource: 'Sourate 1, verset 1',
    chapterId: 'a1',
  },
  {
    arabic: 'الْحَمْدُ',
    transliteration: 'Al-Hamd',
    literalMeaning: 'La louange / La gratitude',
    mirrorDimension: 'Toute louange revient en dernier ressort à Allah — Il est la Source de toute chose digne de louange',
    verse: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    verseSource: 'Sourate 1, verset 2',
    chapterId: 'a2',
  },
  {
    arabic: 'الرَّحْمَٰنُ',
    transliteration: 'Ar-Rahman',
    literalMeaning: 'Le Tout Miséricordieux',
    mirrorDimension: 'Sa miséricorde englobe toute la création — croyants et non-croyants',
    verse: 'الرَّحْمَٰنِ الرَّحِيمِ',
    verseSource: 'Sourate 1, verset 3',
    chapterId: 'a3',
  },
  {
    arabic: 'مَالِكِ',
    transliteration: 'Maliki',
    literalMeaning: 'Le Maître / Le Roi',
    mirrorDimension: 'Il possède toute chose absolument. Je ne possède rien — tout est un dépôt (amana)',
    verse: 'مَالِكِ يَوْمِ الدِّينِ',
    verseSource: 'Sourate 1, verset 4',
    chapterId: 'a4',
  },
  {
    arabic: 'نَعْبُدُ',
    transliteration: "Na'budu",
    literalMeaning: 'Nous adorons',
    mirrorDimension: 'L\'adoration est l\'acte le plus intime entre le serviteur et son Seigneur',
    verse: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    verseSource: 'Sourate 1, verset 5',
    chapterId: 'a5',
  },
  {
    arabic: 'اهْدِنَا',
    transliteration: 'Ihdina',
    literalMeaning: 'Guide-nous',
    mirrorDimension: 'La guidée est un processus continu demandé chaque jour, dans chaque prière',
    verse: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    verseSource: 'Sourate 1, verset 6',
    chapterId: 'a6',
  },
  {
    arabic: 'الصِّرَاطَ',
    transliteration: 'As-Sirat',
    literalMeaning: 'Le chemin / La voie',
    mirrorDimension: 'Ce chemin est si étroit qu\'il « avale » ceux qui le parcourent — seul le focus sur Dieu permet de le suivre',
    verse: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    verseSource: 'Sourate 1, verset 6',
    chapterId: 'a6',
  },
  {
    arabic: 'الْحَيُّ',
    transliteration: 'Al-Hayy',
    literalMeaning: 'Le Vivant',
    mirrorDimension: 'Il est la Source de toute vie. Tout être vivant tire sa vie de Lui',
    verse: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    verseSource: 'Sourate 2, verset 255 (Ayat al-Kursi)',
    chapterId: 'b1',
  },
  {
    arabic: 'الْقَيُّومُ',
    transliteration: 'Al-Qayyum',
    literalMeaning: 'Celui qui subsiste par Lui-même',
    mirrorDimension: 'Tout le reste a besoin de Lui ; Lui n\'a besoin de rien',
    verse: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    verseSource: 'Sourate 2, verset 255 (Ayat al-Kursi)',
    chapterId: 'b1',
  },
  {
    arabic: 'نُورٌ',
    transliteration: 'Nur',
    literalMeaning: 'Lumière',
    mirrorDimension: 'Allah est la lumière qui éclaire le cœur, la connaissance et le monde entier',
    verse: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
    verseSource: 'Sourate 24, verset 35 (Ayat an-Nur)',
    chapterId: 'b2',
  },
  {
    arabic: 'مِشْكَاةٍ',
    transliteration: 'Mishkat',
    literalMeaning: 'La niche',
    mirrorDimension: 'Le cœur du croyant est une niche où la lumière divine peut résider',
    verse: 'مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ',
    verseSource: 'Sourate 24, verset 35',
    chapterId: 'b2',
  },
  {
    arabic: 'وُسْعَهَا',
    transliteration: 'Wus\'aha',
    literalMeaning: 'Sa capacité',
    mirrorDimension: 'Allah n\'impose à aucune âme une charge supérieure à sa capacité — promesse de miséricorde',
    verse: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    verseSource: 'Sourate 2, verset 286',
    chapterId: 'b3-b10',
  },
  {
    arabic: 'تَطْمَئِنُّ',
    transliteration: 'Tatma\'innu',
    literalMeaning: 'Trouvent la paix',
    mirrorDimension: 'La tranquillité n\'est pas l\'absence de problèmes, mais la présence de Dieu dans le cœur',
    verse: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    verseSource: 'Sourate 13, verset 28',
    chapterId: 'b3-b10',
  },
  {
    arabic: 'ذِكْرِ',
    transliteration: 'Dhikr',
    literalMeaning: 'Rappel / Évocation',
    mirrorDimension: 'Le dhikr est à la fois l\'acte de se rappeler et ce dont on se rappelle — le Coran lui-même est « Dhikr »',
    verse: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    verseSource: 'Sourate 13, verset 28',
    chapterId: 'c5',
  },
  {
    arabic: 'تِلَاوَةٌ',
    transliteration: 'Tilawa',
    literalMeaning: 'Récitation / Lecture suivie',
    mirrorDimension: 'La tilawa n\'est pas une simple lecture — c\'est un acte de suivi, comme suivre les pas d\'un guide',
    verse: 'إِنَّ عَلَيْنَا جَمْعَهُ وَقُرْآنَهُ',
    verseSource: 'Sourate 75, verset 17',
    chapterId: 'c1',
  },
  {
    arabic: 'تَدَبُّرٌ',
    transliteration: 'Tadabbur',
    literalMeaning: 'Méditation réflexive',
    mirrorDimension: 'Le tadabbur est le passage de la surface vers la profondeur — de la lettre vers l\'esprit',
    verse: 'أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ',
    verseSource: 'Sourate 47, verset 24',
    chapterId: 'c3',
  },
  {
    arabic: 'تَفَكُّرٌ',
    transliteration: 'Tafakkur',
    literalMeaning: 'Contemplation',
    mirrorDimension: 'Une heure de tafakkur vaut mieux que 60 ans d\'adoration — la qualité de la présence intérieure',
    verse: 'أَفَلَمْ يَنظُرُوا إِلَى السَّمَاءِ فَوْقَهُمْ',
    verseSource: 'Sourate 50, verset 6',
    chapterId: 'c4',
  },
  {
    arabic: 'تَذَكُّرٌ',
    transliteration: 'Tazakkur',
    literalMeaning: 'Rappel / Souvenir actif',
    mirrorDimension: 'Se rappeler Dieu, c\'est se réveiller de l\'oubli (ghafla) qui endort le cœur',
    verse: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    verseSource: 'Sourate 13, verset 28',
    chapterId: 'c5',
  },
  {
    arabic: 'رَبِّ',
    transliteration: 'Rabb',
    literalMeaning: 'Seigneur / Éducateur / Nourricier',
    mirrorDimension: 'Celui qui pourvoit à nos besoins physiques et spirituels, qui nous élève par étapes',
    verse: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    verseSource: 'Sourate 1, verset 2',
    chapterId: 'a2',
  },
  {
    arabic: 'الضَّالِّينَ',
    transliteration: 'Ad-Dallin',
    literalMeaning: 'Les égarés',
    mirrorDimension: 'L\'égarement vient de l\'ignorance — ceux qui cherchent le chemin mais se perdent',
    verse: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    verseSource: 'Sourate 1, verset 7',
    chapterId: 'a7',
  },
  {
    arabic: 'أَحَدٌ',
    transliteration: 'Ahad',
    literalMeaning: 'L\'Unique / L\'Un',
    mirrorDimension: 'L\'unicité absolue — rien ni personne ne peut être comparé à Lui',
    verse: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    verseSource: 'Sourate 112, verset 1 (Al-Ikhlas)',
    chapterId: 'b3-b10',
  },
  {
    arabic: 'الصَّمَدُ',
    transliteration: 'As-Samad',
    literalMeaning: 'Le Seul à être imploré',
    mirrorDimension: 'Celui dont tout dépend et qui ne dépend de rien — le refuge ultime',
    verse: 'اللَّهُ الصَّمَدُ',
    verseSource: 'Sourate 112, verset 2 (Al-Ikhlas)',
    chapterId: 'b3-b10',
  },
  {
    arabic: 'اشْرَحْ',
    transliteration: 'Ishrah',
    literalMeaning: 'Ouvre / Élargis',
    mirrorDimension: 'L\'ouverture du cœur est la première étape de toute mission spirituelle',
    verse: 'قَالَ رَبِّ اشْرَحْ لِي صَدْرِي',
    verseSource: 'Sourate 20, versets 25-26',
    chapterId: 'b3-b10',
  },
  {
    arabic: 'الْمُلْكِ',
    transliteration: 'Al-Mulk',
    literalMeaning: 'La souveraineté / Le royaume',
    mirrorDimension: 'Tout pouvoir vient de Lui et retourne à Lui — leçon d\'humilité radicale',
    verse: 'قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ',
    verseSource: 'Sourate 3, verset 26',
    chapterId: 'b3-b10',
  },
  {
    arabic: 'الْمُسْتَقِيمَ',
    transliteration: 'Al-Mustaqim',
    literalMeaning: 'Le droit / Le rectiligne',
    mirrorDimension: 'Sans déviation ni excès — l\'islam est la voie du juste milieu entre les extrêmes',
    verse: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    verseSource: 'Sourate 1, verset 6',
    chapterId: 'a6',
  },
  {
    arabic: 'الرَّحِيمِ',
    transliteration: 'Ar-Rahim',
    literalMeaning: 'Le Très Miséricordieux',
    mirrorDimension: 'Sa miséricorde spéciale est réservée aux croyants dans l\'au-delà',
    verse: 'الرَّحْمَٰنِ الرَّحِيمِ',
    verseSource: 'Sourate 1, verset 3',
    chapterId: 'a3',
  },
  {
    arabic: 'نَسْتَعِينُ',
    transliteration: "Nasta'inu",
    literalMeaning: 'Nous cherchons l\'aide',
    mirrorDimension: 'Même pour accomplir l\'adoration, j\'ai besoin de Son aide — la dépendance absolue',
    verse: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    verseSource: 'Sourate 1, verset 5',
    chapterId: 'a5',
  },
  {
    arabic: 'الدِّينِ',
    transliteration: 'Ad-Din',
    literalMeaning: 'La rétribution / Le jugement',
    mirrorDimension: 'Ce jour où chaque action sera pesée — « din » signifie aussi « suivre une voie »',
    verse: 'مَالِكِ يَوْمِ الدِّينِ',
    verseSource: 'Sourate 1, verset 4',
    chapterId: 'a4',
  },
  {
    arabic: 'أَنْعَمْتَ',
    transliteration: "An'amta",
    literalMeaning: 'Tu as comblé de faveurs',
    mirrorDimension: 'La gratitude envers les faveurs divines est le premier pas vers la guidée',
    verse: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
    verseSource: 'Sourate 1, verset 7',
    chapterId: 'a7',
  },
  {
    arabic: 'تَرْتِيلٌ',
    transliteration: 'Tartil',
    literalMeaning: 'Récitation mesurée / Psalmodie',
    mirrorDimension: 'Le tartil est la récitation lente et réfléchie — chaque mot est pesé avec le cœur',
    verse: 'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا',
    verseSource: 'Sourate 73, verset 4',
    chapterId: 'c2',
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

export function WordOfTheDay() {
  const navigate = useAppStore((s) => s.navigate);
  const dismissWordOfDay = useAppStore((s) => s.dismissWordOfDay);
  const isWordOfDayDismissed = useAppStore((s) => s.isWordOfDayDismissed);

  const word = useMemo(() => {
    const dayOfYear = getDayOfYear();
    const index = dayOfYear % quranicWords.length;
    return quranicWords[index];
  }, []);

  if (isWordOfDayDismissed()) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mb-6"
    >
      <div className="rounded-xl border border-amber-300/50 dark:border-amber-700/30 bg-gradient-to-br from-amber-50/80 via-amber-100/40 to-amber-50/60 dark:from-amber-950/30 dark:via-amber-900/15 dark:to-amber-950/20 shadow-sm shadow-amber-200/30 dark:shadow-amber-900/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400/80">
              Mot du Jour
            </span>
          </div>
          <button
            onClick={dismissWordOfDay}
            className="rounded-full p-1 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-5">
          {/* Arabic word */}
          <div className="text-center mb-4">
            <p
              className="arabic-verse text-4xl md:text-5xl leading-relaxed text-amber-800 dark:text-amber-200"
              lang="ar"
              dir="rtl"
            >
              {word.arabic}
            </p>
            <p className="mt-2 text-sm italic text-stone-500 dark:text-stone-400/70">
              {word.transliteration}
            </p>
          </div>

          {/* Meaning */}
          <div className="mb-3">
            <p className="text-sm font-medium text-stone-700 dark:text-stone-200/80">
              {word.literalMeaning}
            </p>
          </div>

          {/* Mirror dimension callout */}
          <div className="mb-4 rounded-lg border border-amber-300/40 dark:border-amber-700/20 bg-amber-100/30 dark:bg-amber-950/20 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-amber-600/70 dark:text-amber-400/50 font-medium mb-1">
              ✦ Dimension miroir
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-300/70 leading-relaxed">
              {word.mirrorDimension}
            </p>
          </div>

          {/* Verse */}
          <div className="mb-4 text-center">
            <p
              className="arabic-verse text-lg leading-relaxed text-stone-600 dark:text-stone-300/60"
              lang="ar"
              dir="rtl"
            >
              {word.verse}
            </p>
            <p className="mt-1 text-[10px] text-stone-400 dark:text-stone-500/50">
              {word.verseSource}
            </p>
          </div>

          {/* Navigate button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('chapter', word.chapterId)}
            className="w-full border-amber-300/50 dark:border-amber-700/30 text-amber-700 hover:bg-amber-100/50 dark:text-amber-300 dark:hover:bg-amber-900/20 text-xs"
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            En savoir plus
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
