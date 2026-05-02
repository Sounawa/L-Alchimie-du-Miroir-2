'use client'

import type { WordAnalysis } from '@/data/chapters'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface WordAnalysisTableProps {
  words: WordAnalysis[];
}

export function WordAnalysisTable({ words }: WordAnalysisTableProps) {
  if (words.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
        Analyse des mots
      </h3>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-50 dark:hover:bg-amber-950/30">
              <TableHead className="text-amber-800 dark:text-amber-300 font-semibold">Mot arabe</TableHead>
              <TableHead className="text-amber-800 dark:text-amber-300 font-semibold">Translittération</TableHead>
              <TableHead className="text-amber-800 dark:text-amber-300 font-semibold">Sens littéral</TableHead>
              <TableHead className="text-amber-800 dark:text-amber-300 font-semibold">Dimension miroir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {words.map((word, i) => (
              <TableRow key={i}>
                <TableCell dir="rtl" lang="ar" className="text-lg font-arabic">
                  {word.arabic}
                </TableCell>
                <TableCell className="font-medium">
                  {word.transliteration}
                </TableCell>
                <TableCell>
                  {word.literalMeaning}
                </TableCell>
                <TableCell className="italic text-muted-foreground whitespace-normal">
                  {word.mirrorDimension}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
