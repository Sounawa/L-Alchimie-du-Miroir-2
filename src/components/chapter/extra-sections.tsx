'use client'

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
        {sections.map((section) => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger className="text-left hover:no-underline">
              <span className="font-semibold">{section.title}</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4">
                  <p
                    dir="rtl"
                    lang="ar"
                    className="text-xl leading-loose text-amber-900 dark:text-amber-100 font-arabic text-center"
                  >
                    {section.arabic}
                  </p>
                </div>

                <p className="italic text-muted-foreground leading-relaxed">
                  {section.translation}
                </p>

                <p className="leading-relaxed">
                  {section.commentary}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
