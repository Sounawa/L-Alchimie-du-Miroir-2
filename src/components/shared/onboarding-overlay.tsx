'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { Button } from '@/components/ui/button'
import { Compass, BookOpen, MessageSquare, Moon, ChevronRight, ChevronLeft, PenLine, Clock } from 'lucide-react'

const steps = [
  {
    id: 1,
    emoji: '🪞',
    title: 'Bienvenue dans L\'Alchimie du Miroir',
    description: 'Un guide de tadabbur progressif pour méditer le Coran avec l\'âme. Laissez-vous guider à travers un voyage spirituel unique.',
    pattern: '✦ ✦ ✦',
  },
  {
    id: 2,
    emoji: '🌟',
    title: 'Découvrez les fonctionnalités',
    description: 'Tout ce dont vous avez besoin pour approfondir votre méditation.',
    features: [
      { icon: Compass, label: 'Navigation', desc: 'Parcourez les chapitres facilement' },
      { icon: PenLine, label: 'Notes', desc: 'Écrivez vos réflexions personnelles' },
      { icon: MessageSquare, label: 'Chat IA', desc: 'Un guide spirituel à vos côtés' },
      { icon: Moon, label: 'Mode sombre', desc: 'Lisez confortablement la nuit' },
    ],
  },
  {
    id: 3,
    emoji: '📖',
    title: 'Comment utiliser l\'application',
    description: 'Quelques conseils pour tirer le meilleur parti de votre lecture.',
    tips: [
      { icon: BookOpen, text: 'Lisez chaque chapitre à votre rythme' },
      { icon: PenLine, text: 'Notez vos insights dans les espaces dédiés' },
      { icon: Clock, text: 'Utilisez le minuteur pour la méditation silencieuse' },
    ],
  },
  {
    id: 4,
    emoji: '✨',
    title: 'Votre voyage commence',
    description: 'Chaque pas dans cette méditation est une lumière qui s\'allume dans votre cœur. Prenez votre temps, respirez, et laissez les versets résonner en vous.',
    pattern: '✦ ✦ ✦',
  },
]

export function OnboardingOverlay() {
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const [currentStep, setCurrentStep] = useState(0)

  if (hasCompletedOnboarding) return null

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-amber-300/30 shadow-2xl shadow-amber-900/20"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100/50 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/30" />

        {/* Decorative geometric pattern */}
        <div
          className="pointer-events-none absolute inset-0 islamic-pattern opacity-[0.06] dark:opacity-[0.04]"
        />

        {/* Content */}
        <div className="relative p-6 sm:p-8 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 30, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.96 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col items-center text-center"
            >
              {/* Emoji illustration with glow */}
              <div className="relative mb-4">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-6xl sm:text-7xl">{step.emoji}</span>
                </motion.div>
                <div className="absolute inset-0 -z-10 rounded-full bg-amber-400/20 blur-2xl dark:bg-amber-400/10" />
              </div>

              {/* Title */}
              <h2 className="mb-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-300 bg-clip-text text-transparent">
                {step.title}
              </h2>

              {/* Description */}
              <p className="mb-5 text-sm text-stone-600 dark:text-stone-300/80 max-w-sm leading-relaxed">
                {step.description}
              </p>

              {/* Step-specific content - Features */}
              {'features' in step && step.features && (
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-5">
                  {step.features.map((feature) => (
                    <div
                      key={feature.label}
                      className="flex flex-col items-center gap-1.5 rounded-xl border border-amber-200/50 bg-amber-50/60 p-3 dark:border-amber-800/30 dark:bg-amber-950/20"
                    >
                      <feature.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">{feature.label}</span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400/70">{feature.desc}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Step-specific content - Tips */}
              {'tips' in step && step.tips && (
                <div className="flex flex-col gap-2.5 w-full max-w-sm mb-5">
                  {step.tips.map((tip) => (
                    <div
                      key={tip.text}
                      className="flex items-center gap-3 rounded-lg border border-amber-200/50 bg-amber-50/60 px-4 py-2.5 dark:border-amber-800/30 dark:bg-amber-950/20"
                    >
                      <tip.icon className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm text-stone-700 dark:text-stone-200/80 text-left">{tip.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Step-specific content - Pattern decoration */}
              {'pattern' in step && step.pattern && (
                <div className="mb-4 text-amber-400/50 dark:text-amber-500/40 tracking-[0.5em] text-lg select-none">
                  {step.pattern}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation - centered layout with dots above buttons */}
          <div className="mt-6 flex flex-col items-center gap-4">
            {/* Progress dots - enlarged, gold active */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-3">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className="transition-all duration-300"
                    aria-label={`Étape ${idx + 1}`}
                  >
                    <div
                      className={`rounded-full transition-all duration-300 ${
                        idx === currentStep
                          ? 'h-5 w-5 bg-amber-500 dark:bg-amber-400 animate-active-dot-pulse shadow-md shadow-amber-400/30'
                          : idx < currentStep
                            ? 'w-3.5 h-3.5 bg-amber-400/70 dark:bg-amber-500/70'
                            : 'w-3.5 h-3.5 bg-stone-300 dark:bg-stone-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-stone-400 dark:text-stone-500">Étape {currentStep + 1} sur {steps.length}</span>
            </div>

            {/* Navigation buttons row */}
            <div className="flex items-center gap-4 w-full max-w-xs">
              {/* Previous button */}
              <div className="w-20">
                {!isFirstStep && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    className="text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-300 transition-colors duration-200"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Retour
                  </Button>
                )}
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Next / Start button */}
              <Button
                onClick={handleNext}
                size="sm"
                className={
                  isLastStep
                    ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 px-5 text-amber-50 shadow-lg shadow-amber-600/30 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 relative overflow-hidden transition-all duration-300'
                    : 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-50 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 transition-all duration-300'
                }
              >
                {isLastStep ? (
                  <>
                    <span className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-300/40 via-amber-200/60 to-amber-300/40 animate-gradient-wave" />
                    <span className="relative z-10">Commencer</span>
                  </>
                ) : (
                  <>
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
