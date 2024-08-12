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
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Input } from '@/components/ui/input';
import { DataTablePagination } from '@/components/DataTablePagination';
import AddAsset from './AddAsset';
import { FilterIcon, SearchIcon, SlidersHorizontalIcon } from 'lucide-react';
import { RankingInfo, rankItem } from '@tanstack/match-sorter-utils';
import { ColumnVisibility } from './ColumnVisibility';
import Empty from '../graphics/Empty';
import { TagOption } from './Options';
import { useQuery } from '@tanstack/react-query';
import * as imsService from '@/ims-service';
import { Button } from '../ui/button';
import { PROPERTIES } from '@/lib/data';
import { Link } from 'react-router-dom';
import { Defaults } from '@/types/options';
import { Download } from '@phosphor-icons/react';
import { exportToExcel } from '@/lib/utils';

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

interface InventoryTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultOptions: Defaults;
  DEFAULT_HIDDEN_COLUMNS: string[];
  onToggleFilters: (visible: boolean) => void;
  isFiltersVisible: boolean;
  selectedCategory: string;
}

// const DEFAULT_HIDDEN_COLUMNS = [
//   'category',
//   'processor',
//   'memory',
//   'storage',
//   'assignee',
//   'serviceInYears',
//   'supplierVendor',
//   'pezaForm8105',
//   'pezaForm8106',
//   'isRGE',
//   'equipmentType',
//   'remarks',
//   'deploymentDate',
//   'recoveredFrom',
//   'recoveryDate',
//   'client'
// ];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const searchColumns: any[] = ["code", "serialNo", "assignee", "_addonData_assignee"]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const exactFilter: FilterFn<any> = (row, _columnId, value) => {
  const objectValue: string = searchColumns.reduce((accum: any, element: any) => {
    accum += ` ${row.getValue(element)?.toString().toLowerCase() || ''}`;

    return accum
  }, "");

  const searchTerm: string = value?.toString().toLowerCase() || '';
  let isFound: boolean = true;

  searchTerm.split(' ').filter(f => f).forEach((element: string) => {
    if (isFound) isFound = objectValue.includes(element)
  })

  return isFound;
};

export function InventoryTable<TData, TValue>({
  columns,
  data,
  defaultOptions,
  DEFAULT_HIDDEN_COLUMNS,
  onToggleFilters,
  isFiltersVisible,
  selectedCategory,
}: InventoryTableProps<TData, TValue>) {
  const [isXL, setIsXL] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [isDownloading, setIsDownloading] = React.useState(false);

  const { data: optionValues } = useQuery<TagOption[]>({
    queryKey: ['fetchOptionValues', 'category'],
    queryFn: () => imsService.fetchOptionValues('category'),
    enabled: !!selectedCategory,
  });

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(
      // Initialize column visibility state
      DEFAULT_HIDDEN_COLUMNS.reduce((acc, column) => {
        acc[column] = false; // Set all default columns to visible
        return acc;
      }, {} as VisibilityState)
    );

  React.useEffect(() => {
    if (!selectedCategory || !optionValues || optionValues.length === 0) {
      // Scenario 1: Default
      setColumnVisibility((prevVisibility) => ({
        ...prevVisibility,
        ...PROPERTIES.reduce((acc, column) => {
          acc[column.id] = !DEFAULT_HIDDEN_COLUMNS.includes(column.id); // Set visibility based on properties
          return acc;
        }, {} as VisibilityState),
      }));
    } else {
      const categoryOption = optionValues.find(
        (option) => option.value === selectedCategory
      );
      if (
        !categoryOption ||
        !categoryOption.properties ||
        categoryOption.properties.length === 0
      ) {
        // Scenario 2: Category option is not available or has no properties
        setColumnVisibility((prevVisibility) => ({
          ...prevVisibility,
          ...PROPERTIES.reduce((acc, column) => {
            acc[column.id] = !DEFAULT_HIDDEN_COLUMNS.includes(column.id); // Set visibility based on properties
            return acc;
          }, {} as VisibilityState),
        }));
      } else {
        // Scenario 3: Category option is available and has properties
        const properties: string[] = categoryOption.properties.map(
          (tag) => tag
        );
        // Set visibility based on properties
        setColumnVisibility((prevVisibility) => ({
          ...prevVisibility,
          ...PROPERTIES.reduce((acc, column) => {
            acc[column.id] = properties.includes(column.id); // Set visibility based on properties
            return acc;
          }, {} as VisibilityState),
        }));
      }
    }
  }, [selectedCategory, optionValues, DEFAULT_HIDDEN_COLUMNS]);

  const [rowSelection, setRowSelection] = React.useState({});

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
      pagination,
    },
  });

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

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    const columnVisibility = table.getState()?.columnVisibility;
    const visibleColumns = Object.keys(columnVisibility).filter(
      (key) => columnVisibility[key] === true
    );
    const columns = table
      .getHeaderGroups()[0]
      .headers.filter((header) => visibleColumns.includes(header.id))
      .map((header) => header.id);

    const withServiceInYears = data.map((asset: any) => {
      let serviceInYears = null;
      if (asset?.purchaseDate !== null) {
        const currentDate = new Date();
        const purchaseDate = new Date(asset?.purchaseDate);
        serviceInYears = Math.round(
          (currentDate.getTime() - purchaseDate.getTime()) /
            (1000 * 60 * 60 * 24 * 365)
        );
      }
      return { ...asset, serviceInYears };
    });
    await exportToExcel(columns, withServiceInYears, 'Inventory_Report');
    setIsDownloading(false);
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="w-full flex items-center justify-between pb-3 xl:pb-4 gap-2">
        <div className="flex gap-2 w-full">
          {!isFiltersVisible && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-8 w-8 min-w-8 p-0 bg-inherit"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      onToggleFilters(!isFiltersVisible);
                    }}
                  >
                    <span className="sr-only">Toggle visible columns</span>
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Show filter settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <div className="flex items-center w-full">
            <SearchIcon className="absolute translate-x-3 h-4 w-4" />
            <Input
              placeholder="Search asset..."
              value={globalFilter ?? ''}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="w-full pl-10 h-8 font-light rounded-md text-sm md:w-[700px]"
            />
          </div>
        </div>
        <div className="flex gap-2 w-fit">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="h-8 w-8 min-w-8 p-0"
                  variant="outline"
                  size="icon"
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                >
                  <>
                    <span className="sr-only">Export Data</span>
                    <Download className="h-4 w-4" />
                  </>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Export Data</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  className="h-8 w-8 min-w-8 p-0"
                  variant="outline"
                  size="icon"
                >
                  <Link to="/settings/inventory">
                    <span className="sr-only">Settings & preferences</span>
                    <SlidersHorizontalIcon className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Settings & preferences</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ColumnVisibility table={table} />
          {defaultOptions && <AddAsset defaultValues={defaultOptions} />}
        </div>
      </div>
      <ScrollArea
        className={`rounded-md border h-full ${
          isFiltersVisible ? 'xl:w-[calc(100vw-25rem)]' : 'w-full'
        }`}
        style={isXL ? { maxHeight: '' } : {}}
      >
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
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-background">
                <TableCell colSpan={columns.length}>
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <DataTablePagination table={table} />
    </div>
  );
}
