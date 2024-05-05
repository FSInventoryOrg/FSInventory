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
import { InventoryPagination } from "./InventoryPagination"
import AddAsset from "./AddAsset"
import { FilterIcon, SearchIcon } from "lucide-react"
import {
  RankingInfo,
  rankItem,
} from '@tanstack/match-sorter-utils'
import { ColumnVisibility } from "./ColumnVisibility"
import Empty from "../graphics/Empty"
import { TagOption } from "./Options"
import { useQuery } from '@tanstack/react-query'
import * as imsService from '@/ims-service'
import { Button } from "../ui/button"
import OptionSettings from "./OptionSettings"
import { PROPERTIES } from "@/lib/data"

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

interface InventoryTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onToggleFilters: (visible: boolean) => void;
  isFiltersVisible: boolean;
  selectedCategory: string;
}

const DEFAULT_HIDDEN_COLUMNS = [
  'category', 
  'processor', 
  'memory', 
  'storage', 
  'assignee', 
  'serviceInYears', 
  'supplierVendor', 
  'pezaForm8105', 
  'pezaForm8106', 
  'isRGE', 
  'equipmentType', 
  'remarks',
  'deploymentDate',
  'recoveredFrom',
  'recoveryDate',
  'client'
];

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

export function InventoryTable<TData, TValue>({
  columns,
  data,
  onToggleFilters,
  isFiltersVisible,
  selectedCategory,
}: InventoryTableProps<TData, TValue>) {

  const [isXL, setIsXL] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [pagination] = React.useState<PaginationState>({
    pageIndex: 0, 
    pageSize: 20, 
  });  

  const { data: optionValues } = useQuery<TagOption[]>({ 
    queryKey: ['fetchOptionValues', 'category'], 
    queryFn: () => imsService.fetchOptionValues('category'),
    enabled: !!selectedCategory,
  })
  
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    // Initialize column visibility state
    DEFAULT_HIDDEN_COLUMNS.reduce((acc, column) => {
      acc[column] = false; // Set all default columns to visible
      return acc;
    }, {} as VisibilityState)
  );
  
  React.useEffect(() => {
    if (!selectedCategory || !optionValues || optionValues.length === 0) {
      // Scenario 1: Default
      setColumnVisibility(prevVisibility => ({
        ...prevVisibility,
        ...PROPERTIES.reduce((acc, column) => {
          acc[column.id] = !DEFAULT_HIDDEN_COLUMNS.includes(column.id); // Set visibility based on properties
          return acc;
        }, {} as VisibilityState)
      }));
    } else {
      const categoryOption = optionValues.find(option => option.value === selectedCategory);
      if (!categoryOption || !categoryOption.properties || categoryOption.properties.length === 0) {
        // Scenario 2: Category option is not available or has no properties
        setColumnVisibility(prevVisibility => ({
          ...prevVisibility,
          ...PROPERTIES.reduce((acc, column) => {
            acc[column.id] = !DEFAULT_HIDDEN_COLUMNS.includes(column.id); // Set visibility based on properties
            return acc;
          }, {} as VisibilityState)
        }));
      } else {
        // Scenario 3: Category option is available and has properties
        const properties: string[] = categoryOption.properties.map(tag => tag);
        // Set visibility based on properties
        setColumnVisibility(prevVisibility => ({
          ...prevVisibility,
          ...PROPERTIES.reduce((acc, column) => {
            acc[column.id] = properties.includes(column.id); // Set visibility based on properties
            return acc;
          }, {} as VisibilityState)
        }));
      }
    }
  }, [selectedCategory, optionValues]);

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
  
  return (
    <div className="w-full flex flex-col h-full" >
      <div className="flex items-center pb-4 justify-between">
        <div className="flex items-center -translate-x-4">
          <SearchIcon className="translate-x-8 h-4 w-4"/>
          <Input
            placeholder="Search asset..."
            value={globalFilter ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm pl-10 h-8 font-light rounded-md text-sm w-fit md:w-[700px]"
          />
        </div>
        <div className="flex gap-2">
          <OptionSettings />
          <Button
            className='h-8 w-8 p-0'
            variant='outline'
            size='icon'
            onClick={() => {
              onToggleFilters(!isFiltersVisible);
            }}
          >
            <span className="sr-only">Toggle visible columns</span>
            <FilterIcon className='h-4 w-4' />
          </Button>
          <ColumnVisibility table={table} />
          <AddAsset />
        </div>
      </div>
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
      <InventoryPagination table={table}/>
    </div>
  )
}
