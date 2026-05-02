'use client'

import type { MirrorQuestion } from '@/data/chapters'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface MirrorQuestionsTableProps {
  questions: MirrorQuestion[];
}

export function MirrorQuestionsTable({ questions }: MirrorQuestionsTableProps) {
  if (questions.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-50 dark:hover:bg-amber-950/30">
              <TableHead className="text-amber-800 dark:text-amber-300 font-semibold">Question miroir</TableHead>
              <TableHead className="text-amber-800 dark:text-amber-300 font-semibold">Pour la méditation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold whitespace-normal">{q.question}</TableCell>
                <TableCell className="italic text-muted-foreground whitespace-normal">
                  {q.meditation}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
