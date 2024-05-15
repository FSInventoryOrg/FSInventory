"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "../ui/scroll-area"
import { Skeleton } from "../ui/skeleton"

export function TableSuspense({ length=12, height='100%' }: { length?: number, height?: string | number }) {
  const [isXL, setIsXL] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsXL(window.innerWidth >= 1280); 
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <ScrollArea className="rounded-md border overflow-hidden" style={isXL ? { maxHeight: '', height: height } : {}}>
      <Table className="text-xs">
        <TableHeader className="sticky top-0 bg-accent z-10 border-b">
            <TableRow>
              <TableHead>
              </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: length }, (_, index) => (
            <TableRow key={index}>
              <TableCell className="p-2">
                <Skeleton className="h-12" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
