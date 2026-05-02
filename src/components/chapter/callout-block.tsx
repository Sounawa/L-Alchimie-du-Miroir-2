'use client'

import { Sparkles, Info, AlertTriangle } from 'lucide-react'

interface CalloutBlockProps {
  type: 'gold' | 'info' | 'warning';
  title: string;
  content: string;
}

const styles = {
  gold: {
    container: 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700',
    icon: <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
  },
  info: {
    container: 'bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-700',
    icon: <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />,
  },
  warning: {
    container: 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700',
    icon: <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
  },
}

export function CalloutBlock({ type, title, content }: CalloutBlockProps) {
  const style = styles[type]

  return (
    <div className={`rounded-md border-l-4 p-4 ${style.container}`}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div>
          <p className="font-bold mb-1">{title}</p>
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  )
}
