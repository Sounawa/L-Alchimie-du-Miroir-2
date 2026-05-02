'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface MetaphorTableProps {
  metaphors: Array<{
    element: string;
    metaphor: string;
    interpretation: string;
  }>;
}

export function MetaphorTable({ metaphors }: MetaphorTableProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-50 dark:hover:bg-amber-950/30">
              <TableHead className="text-amber-800 dark:text-amber-300 font-semibold">Élément</TableHead>
              <TableHead className="text-amber-800 dark:text-amber-300 font-semibold">Métaphore</TableHead>
              <TableHead className="text-amber-800 dark:text-amber-300 font-semibold">Interprétation spirituelle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metaphors.map((m, i) => (
              <TableRow key={i}>
                <TableCell className="font-bold whitespace-normal">{m.element}</TableCell>
                <TableCell className="whitespace-normal">{m.metaphor}</TableCell>
                <TableCell className="italic text-muted-foreground whitespace-normal">
                  {m.interpretation}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
