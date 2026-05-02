'use client';

import { useAppStore } from '@/store/use-app-store';
import { allChapters } from '@/data/chapters';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Sparkles,
  Target,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { useMemo } from 'react';

interface ReadingPlan {
  id: string;
  name: string;
  duration: number; // days
  description: string;
  icon: typeof Sparkles;
  color: string;
  bgGradient: string;
  schedule: { day: number; chapterIds: string[]; label: string }[];
}

const readingPlans: ReadingPlan[] = [
  {
    id: 'decouverte',
    name: 'Plan Découverte',
    duration: 7,
    description:
      'Une introduction aux sept versets de la Fatiha. Un chapitre par jour pour découvrir la méditation coranique.',
    icon: Sparkles,
    color: 'text-amber-600 dark:text-amber-400',
    bgGradient:
      'from-amber-50 via-amber-100/50 to-amber-50 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-amber-950/30',
    schedule: [
      { day: 1, chapterIds: ['a1'], label: 'Bismillah' },
      { day: 2, chapterIds: ['a2'], label: 'Al-Hamd' },
      { day: 3, chapterIds: ['a3'], label: 'Ar-Rahman Ar-Rahim' },
      { day: 4, chapterIds: ['a4'], label: 'Maliki Yawm ad-Din' },
      { day: 5, chapterIds: ['a5'], label: "Iyyaka Na'budu" },
      { day: 6, chapterIds: ['a6'], label: 'Ihdina as-Sirata' },
      { day: 7, chapterIds: ['a7'], label: 'Siratal Lazina' },
    ],
  },
  {
    id: 'approfondissement',
    name: 'Plan Approfondissement',
    duration: 17,
    description:
      'Tous les 17 chapitres du programme, un par jour. Le parcours complet pour une transformation profonde.',
    icon: Target,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgGradient:
      'from-emerald-50 via-emerald-100/50 to-emerald-50 dark:from-emerald-950/30 dark:via-emerald-900/20 dark:to-emerald-950/30',
    schedule: [
      { day: 1, chapterIds: ['a1'], label: 'Bismillah' },
      { day: 2, chapterIds: ['a2'], label: 'Al-Hamd' },
      { day: 3, chapterIds: ['a3'], label: 'Ar-Rahman Ar-Rahim' },
      { day: 4, chapterIds: ['a4'], label: 'Maliki Yawm ad-Din' },
      { day: 5, chapterIds: ['a5'], label: "Iyyaka Na'budu" },
      { day: 6, chapterIds: ['a6'], label: 'Ihdina as-Sirata' },
      { day: 7, chapterIds: ['a7'], label: 'Siratal Lazina' },
      { day: 8, chapterIds: ['b1'], label: 'Ayat al-Kursi' },
      { day: 9, chapterIds: ['b2'], label: 'Ayat an-Nur' },
      { day: 10, chapterIds: ['b3-b10'], label: 'Trésors du Coran (B3-B5)' },
      { day: 11, chapterIds: ['b3-b10'], label: 'Trésors du Coran (B6-B8)' },
      { day: 12, chapterIds: ['b3-b10'], label: 'Trésors du Coran (B9-B10)' },
      { day: 13, chapterIds: ['c1'], label: 'Tilawa' },
      { day: 14, chapterIds: ['c2'], label: 'Tartil' },
      { day: 15, chapterIds: ['c3'], label: 'Tadabbur' },
      { day: 16, chapterIds: ['c4'], label: 'Tafakkur' },
      { day: 17, chapterIds: ['c5'], label: 'Tazakkur' },
    ],
  },
  {
    id: 'intensif',
    name: 'Plan Intensif',
    duration: 5,
    description:
      'Pour les étudiants dévoués. Plusieurs chapitres par jour sur 5 jours pour une immersion totale.',
    icon: Zap,
    color: 'text-violet-600 dark:text-violet-400',
    bgGradient:
      'from-violet-50 via-violet-100/50 to-violet-50 dark:from-violet-950/30 dark:via-violet-900/20 dark:to-violet-950/30',
    schedule: [
      {
        day: 1,
        chapterIds: ['a1', 'a2', 'a3', 'a4'],
        label: 'Al-Fatiha (1-4)',
      },
      {
        day: 2,
        chapterIds: ['a5', 'a6', 'a7'],
        label: 'Al-Fatiha (5-7)',
      },
      {
        day: 3,
        chapterIds: ['b1', 'b2', 'b3-b10'],
        label: 'Trésors du Coran',
      },
      {
        day: 4,
        chapterIds: ['c1', 'c2', 'c3', 'c4'],
        label: 'Niveaux de Lecture (1-4)',
      },
      {
        day: 5,
        chapterIds: ['c5', 'c6', 'c7'],
        label: 'Niveaux de Lecture (5-7)',
      },
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function getChapterTitle(id: string): string {
  const ch = allChapters.find((c) => c.id === id);
  return ch ? `${ch.number} — ${ch.title}` : id;
}

export function ReadingPlanView() {
  const navigate = useAppStore((s) => s.navigate);
  const selectedPlan = useAppStore((s) => s.selectedPlan);
  const planStartDate = useAppStore((s) => s.planStartDate);
  const selectPlan = useAppStore((s) => s.selectPlan);
  const clearPlan = useAppStore((s) => s.clearPlan);
  const isChapterComplete = useAppStore((s) => s.isChapterComplete);
  const completedChapters = useAppStore((s) => s.completedChapters);

  const activePlan = useMemo(
    () => readingPlans.find((p) => p.id === selectedPlan) ?? null,
    [selectedPlan]
  );

  // Calculate current day and progress
  const planProgress = useMemo(() => {
    if (!activePlan || !planStartDate) return { currentDay: 0, completedDays: 0, totalDays: 0 };
    const start = new Date(planStartDate);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const currentDay = Math.min(diffDays + 1, activePlan.duration);
    const completedDays = activePlan.schedule.filter((day) =>
      day.chapterIds.every((id) => isChapterComplete(id))
    ).length;
    return { currentDay, completedDays, totalDays: activePlan.duration };
  }, [activePlan, planStartDate, isChapterComplete, completedChapters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-stone-50 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-2xl p-6 md:p-12"
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="mb-10 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('toc')}
            className="mb-6 text-stone-500 hover:text-amber-600 dark:text-stone-400/70 dark:hover:text-amber-300/80"
          >
            ← Retour
          </Button>
          <h1 className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-300 bg-clip-text font-serif text-3xl text-transparent md:text-4xl">
            Plan de Lecture
          </h1>
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400/80">
            Choisissez un rythme qui vous convient et commencez votre parcours structuré
          </p>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-amber-500/40 dark:to-amber-600/40" />
            <Calendar className="size-4 text-amber-500/50" />
            <span className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-amber-500/40 dark:to-amber-600/40" />
          </div>
        </motion.div>

        {/* Active plan progress */}
        {activePlan && planStartDate && (
          <motion.div variants={fadeIn} className="mb-8">
            <Card className="border-amber-300/50 dark:border-amber-700/30 overflow-hidden">
              <div className={`bg-gradient-to-r ${activePlan.bgGradient} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <activePlan.icon className={`h-5 w-5 ${activePlan.color}`} />
                    <span className="font-semibold text-stone-700 dark:text-stone-200">
                      {activePlan.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearPlan}
                    className="text-stone-400 hover:text-red-500 dark:text-stone-500 dark:hover:text-red-400 h-7 px-2"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Changer
                  </Button>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-500 dark:text-stone-400/80">
                      Jour {planProgress.currentDay} / {planProgress.totalDays}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-0 text-[10px]"
                    >
                      {planProgress.completedDays}/{planProgress.totalDays} complétés
                    </Badge>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-200/60 dark:bg-stone-700/40">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(planProgress.completedDays / planProgress.totalDays) * 100}%`,
                      }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Start date */}
                <div className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500/80">
                  <Calendar className="h-3 w-3" />
                  <span>Commencé le {new Date(planStartDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Daily schedule */}
              <CardContent className="p-4">
                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                  {activePlan.schedule.map((day) => {
                    const isCompleted = day.chapterIds.every((id) => isChapterComplete(id));
                    const isCurrent =
                      planProgress.currentDay === day.day && !isCompleted;

                    return (
                      <motion.button
                        key={day.day}
                        onClick={() => navigate('chapter', day.chapterIds[0])}
                        className={`
                          flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left
                          transition-all duration-200 text-sm
                          ${
                            isCurrent
                              ? 'bg-amber-100/80 dark:bg-amber-900/20 border border-amber-300/50 dark:border-amber-700/30'
                              : isCompleted
                                ? 'bg-emerald-50/50 dark:bg-emerald-950/10 opacity-70'
                                : 'hover:bg-stone-100/60 dark:hover:bg-stone-800/30'
                          }
                        `}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {/* Day number */}
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold
                          ${
                            isCurrent
                              ? 'bg-amber-500 text-white'
                              : isCompleted
                                ? 'bg-emerald-500 text-white'
                                : 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                          }
                        `}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            day.day
                          )}
                        </span>

                        {/* Day info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium truncate ${isCompleted ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-700 dark:text-stone-200'}`}
                          >
                            Jour {day.day} — {day.label}
                          </p>
                          <p className="text-[10px] text-stone-400 dark:text-stone-500/50 truncate">
                            {day.chapterIds.map(getChapterTitle).join(' · ')}
                          </p>
                        </div>

                        {isCurrent && (
                          <Badge className="bg-amber-500 text-white border-0 text-[9px] shrink-0">
                            En cours
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 shrink-0 text-stone-300 dark:text-stone-600" />
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Plan selection (only show when no plan active) */}
        {!activePlan && (
          <div className="space-y-6">
            {readingPlans.map((plan, idx) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  variants={fadeIn}
                  custom={idx}
                >
                  <Card className="overflow-hidden border-stone-200/60 dark:border-stone-700/30 hover:border-amber-300/50 dark:hover:border-amber-700/30 transition-colors">
                    <div className={`bg-gradient-to-r ${plan.bgGradient} p-5`}>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60 dark:bg-stone-800/60 shadow-sm">
                          <Icon className={`h-5 w-5 ${plan.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-stone-800 dark:text-stone-100">
                            {plan.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="bg-white/50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-300 border-0 text-[10px]"
                            >
                              <Clock className="h-3 w-3 mr-0.5" />
                              {plan.duration} jours
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="bg-white/50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-300 border-0 text-[10px]"
                            >
                              <BookOpen className="h-3 w-3 mr-0.5" />
                              {plan.schedule.reduce((acc, d) => acc + d.chapterIds.length, 0)} chapitres
                            </Badge>
                          </div>
                          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400/70 leading-relaxed">
                            {plan.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      {/* Preview schedule */}
                      <div className="space-y-1.5 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                        {plan.schedule.map((day) => (
                          <div
                            key={day.day}
                            className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400/80"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-bold">
                              {day.day}
                            </span>
                            <span className="truncate">
                              {day.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => selectPlan(plan.id)}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-200/50 dark:shadow-amber-900/30"
                      >
                        Commencer
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Info card */}
        <motion.div variants={fadeIn} className="mt-8">
          <Separator className="mb-6 bg-stone-200/60 dark:bg-stone-700/30" />
          <div className="rounded-xl border border-amber-200/40 bg-amber-50/40 dark:border-amber-800/20 dark:bg-amber-950/10 p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div>
                <p className="text-sm font-medium text-stone-700 dark:text-stone-200/80">
                  Conseil de lecture
                </p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400/80 leading-relaxed">
                  Vous pouvez changer de plan à tout moment. Votre progression est sauvegardée
                  automatiquement. Prenez le temps de méditer — la qualité prime sur la quantité.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
