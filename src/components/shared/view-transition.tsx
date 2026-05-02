'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'

const pageVariants = {
  initial: { opacity: 0, x: -20, rotateY: -8 },
  animate: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
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
      style={{ perspective: 1200 }}
    >
      {children}
    </motion.div>
  )
}
