'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ComparisonTableBlockProps {
  headers: string[];
  rows: string[][];
  title?: string;
}

export function ComparisonTableBlock({ headers, rows, title }: ComparisonTableBlockProps) {
  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
          {title}
        </h3>
      )}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-50 dark:hover:bg-amber-950/30">
              {headers.map((header, i) => (
                <TableHead key={i} className="text-amber-800 dark:text-amber-300 font-semibold">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell
                    key={j}
                    dir={j === 1 ? 'rtl' : undefined}
                    lang={j === 1 ? 'ar' : undefined}
                    className={`whitespace-normal ${j === 0 ? 'font-bold' : ''} ${j === 1 ? 'font-arabic text-lg' : ''}`}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
