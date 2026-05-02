'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

export function ViewTransition({ children }: { children: React.ReactNode }) {
  const currentView = useAppStore((s) => s.currentView)
  const currentChapterId = useAppStore((s) => s.currentChapterId)

  return (
    <motion.div
      key={`${currentView}-${currentChapterId ?? ''}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  )
}
