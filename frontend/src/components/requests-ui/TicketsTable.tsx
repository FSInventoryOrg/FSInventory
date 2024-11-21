// src/components/TicketsTable.tsx
import {
  useReactTable,
  getCoreRowModel,
  FilterFn,
  flexRender,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { SupportTicketColumns } from "./SupportTicketColumns";
import { SupportTicketType } from "@/types/ticket";
import Empty from "../graphics/Empty";
import { useState } from "react";

interface TicketsTableProps {
  data: SupportTicketType[];
  defaultHiddenColumns: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const TicketsTable = ({ data, defaultHiddenColumns }: TicketsTableProps) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultHiddenColumns.reduce((acc, column) => {
      acc[column] = false;
      return acc;
    }, {} as VisibilityState)
  );
  const table = useReactTable({
    data,
    columns: SupportTicketColumns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="flex flex-col  border">
      <Table className="text-xs relative w-full  ">
        <TableHeader className="sticky top-0 bg-accent z-10 border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-background">
              <TableCell colSpan={SupportTicketColumns.length}>
                <div className="h-max flex flex-col items-center justify-center">
                  <Empty height={200} width={300} />
                  <span className="text-muted-foreground">
                    No results found
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TicketsTable;
