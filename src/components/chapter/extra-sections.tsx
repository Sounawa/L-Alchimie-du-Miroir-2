'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface ExtraSectionsProps {
  chapterId: string;
  sections: Array<{
    id: string;
    title: string;
    arabic: string;
    translation: string;
    commentary: string;
  }>;
}

export function ExtraSections({ chapterId, sections }: ExtraSectionsProps) {
  if (sections.length === 0) return null

  return (
    <div className="space-y-3">
      <Accordion type="multiple" className="w-full">
        {sections.map((section, idx) => (
          <AccordionItem key={section.id} value={section.id} className="border border-emerald-200/40 dark:border-emerald-800/20 rounded-xl px-4 bg-emerald-50/30 dark:bg-emerald-950/10 hover:border-emerald-300/60 dark:hover:border-emerald-700/40 transition-all duration-200 data-[state=open]:bg-gradient-to-br data-[state=open]:from-emerald-50/60 data-[state=open]:via-emerald-50/30 data-[state=open]:to-amber-50/20 dark:data-[state=open]:from-emerald-950/20 dark:data-[state=open]:via-emerald-950/10 dark:data-[state=open]:to-amber-950/5 data-[state=open]:shadow-sm">
            <AccordionTrigger className="text-left hover:no-underline py-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-emerald-300/50 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 shrink-0">
                  {idx + 1}/{sections.length}
                </Badge>
                <span className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">{section.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 pt-2"
              >
                <div className="rounded-lg border border-emerald-200/60 dark:border-emerald-800/30 bg-gradient-to-b from-emerald-50/60 to-emerald-50/30 dark:from-emerald-950/20 dark:to-emerald-950/10 p-4">
                  <p
                    dir="rtl"
                    lang="ar"
                    className="arabic-verse text-2xl leading-loose text-emerald-900 dark:text-emerald-100 text-center"
                  >
                    {section.arabic}
                  </p>
                </div>

                <p className="italic text-muted-foreground leading-relaxed">
                  {section.translation}
                </p>

                <div className="rounded-lg bg-stone-50/60 dark:bg-stone-800/20 p-3 border-l-2 border-emerald-300/40 dark:border-emerald-600/30">
                  <p className="leading-relaxed text-sm text-stone-700 dark:text-stone-300/80">
                    {section.commentary}
                  </p>
                </div>
              </motion.div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
