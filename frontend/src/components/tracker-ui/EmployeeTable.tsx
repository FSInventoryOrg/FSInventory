"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "../ui/scroll-area"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import {
  RankingInfo,
  rankItem,
} from '@tanstack/match-sorter-utils'
import Empty from "../graphics/Empty"
import AddEmployee from "./AddEmployee"
import { EmployeePagination } from "./EmployeePagination"
import { EmployeeType } from "@/types/employee"
import EmployeeFilter from "./EmployeeFilter"

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

interface EmployeeTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onEmployeeSelect: (employee: EmployeeType) => void;
  onFilter: (filters: string[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank,
  })
  return itemRank.passed
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const exactFilter: FilterFn<any> = (row, columnId, value) => {
  const cellValue = row.getValue(columnId)?.toString().toLowerCase() || '';
  const searchTerm = value?.toString().toLowerCase() || '';
  const isMatch = cellValue.startsWith(searchTerm);

  return isMatch; 
};

export function EmployeeTable<TData, TValue>({
  columns,
  data,
  onEmployeeSelect,
  onFilter,
}: EmployeeTableProps<TData, TValue>) {

  const [isXL, setIsXL] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [pagination] = React.useState<PaginationState>({
    pageIndex: 0, 
    pageSize: 20, 
    });  
  
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: exactFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination
    }
  })

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

  const handleFilters = (filters: string[]) => {
    onFilter(filters)
  }
  
  return (
    <div className="w-full flex flex-col" >
      <div className="flex items-center pb-2 justify-between">
        <div className="flex items-center -translate-x-4">
          <SearchIcon className="translate-x-8 h-4 w-4"/>
          <Input
            placeholder="Search employee..."
            value={globalFilter ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm w-[205px] pl-10 h-8 font-light rounded-md text-sm"
          />
        </div>
        <div className="flex gap-2 -translate-x-2 z-20">
          <EmployeeFilter onFilter={handleFilters} />
          <AddEmployee />
        </div>
      </div>
      <EmployeePagination table={table}/>
      <ScrollArea className="rounded-md border h-full" style={isXL ? { maxHeight: '' } : {}}>
        <Table className="text-xs relative">
          <TableHeader className="sticky top-0 bg-accent z-10 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
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
                  onClick={() => {
                    // if (row.original.code) {
                    //   window.location.href = `/employee/${row.original.code}`
                    // } else {
                    //   onEmployeeSelect(row.original)
                    // }
                    onEmployeeSelect(row.original)
                  }}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-full hover:bg-background">
                <TableCell colSpan={columns.length}>
                  <div className='h-max flex flex-col items-center justify-center'>
                    <Empty height={200} width={300} />
                    <span className="text-muted-foreground">No results found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
