// src/components/TicketsTable.tsx
import {
  useReactTable,
  getCoreRowModel,
  FilterFn,
  flexRender,
  VisibilityState,
  PaginationState,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rankItem, rankings } from "@tanstack/match-sorter-utils";
import { SupportTicketColumns } from "./SupportTicketColumns";
import { SupportTicketType } from "@/types/ticket";
import Empty from "../graphics/Empty";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { DataTablePagination } from "../DataTablePagination";

interface TicketsTableProps {
  id?: string;
  title?: string;
  data: SupportTicketType[];
  defaultHiddenColumns: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value, {
    threshold: rankings.CONTAINS,
  });
  addMeta({
    itemRank,
  });
  if (itemRank.passed) {
    console.log(value, row.getValue(columnId));
  }
  return itemRank.passed;
};

const TicketsTable = ({
  id,
  title,
  data,
  defaultHiddenColumns,
}: TicketsTableProps) => {
  const [globalFilter, setGlobalFilter] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultHiddenColumns.reduce((acc, column) => {
      acc[column] = false;
      return acc;
    }, {} as VisibilityState)
  );
  const [pagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const table = useReactTable({
    data,
    columns: SupportTicketColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: "fuzzy",
    enableRowSelection: false,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    initialState: {
      pagination,
    },
  });

  return (
    <div className="flex flex-col  border">
      <div className="flex gap-2 w-full">
        {title && <h1 className="text-2xl font-semibold">{title}</h1>}
        <div className="flex items-center w-full">
          <SearchIcon className="absolute translate-x-3 h-4 w-4" />
          <Input
            placeholder="Search asset..."
            value={globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="pl-10 h-8 font-light rounded-md text-sm"
          />
        </div>
      </div>
      <Table id={id} className="text-xs relative w-full  ">
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
      <DataTablePagination table={table} />
    </div>
  );
};

export default TicketsTable;
