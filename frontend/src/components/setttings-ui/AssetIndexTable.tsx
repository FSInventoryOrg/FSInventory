import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AssetIndexColumns } from './AssetsIndexColumns';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { DataTablePagination } from '../DataTablePagination';
import { AssetCounterType } from '@/types/asset';
import { Button } from '../ui/button';
import { CodeIcon, MonitorSmartphoneIcon } from 'lucide-react';

interface AssetIndexTableProps {
  data: AssetCounterType[];
  onTypeChange: (type: 'Hardware' | 'Software') => void;
  selectedType: 'Hardware' | 'Software';
}

export default function AssetIndexTable({
  data,
  selectedType,
  onTypeChange,
}: AssetIndexTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank,
    });
    return itemRank.passed;
  };

  const table = useReactTable({
    data,
    columns: AssetIndexColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });

  return (
    <div className="md:w-5/6 flex flex-col h-[calc(100vh-16rem)]">
      <div className="flex items-center pb-4 gap-2">
        <div className="flex gap-2 md:w-1/3 w-full ">
          <Button
            variant="outline"
            className={`bg-muted rounded-xl border-2 flex w-full justify-between h-fit py-1.5 px-2 text-xs gap-2  ${
              selectedType === 'Hardware' ? 'border-primary' : ''
            }`}
            onClick={() => onTypeChange('Hardware')}
          >
            Hardware
            <MonitorSmartphoneIcon size={18} />
          </Button>
          <Button
            variant="outline"
            className={`bg-muted rounded-xl border-2 flex w-full justify-between h-fit py-1.5 px-2 text-xs gap-2  ${
              selectedType === 'Software' ? 'border-primary' : ''
            }`}
            onClick={() => onTypeChange('Software')}
          >
            Software
            <CodeIcon size={18} />
          </Button>
        </div>
        <Input
          placeholder="Filter categories..."
          value={
            (table.getColumn('category')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('category')?.setFilterValue(event.target.value)
          }
          className="md:max-w-sm"
        />
        {/* NOTE: No feature yet to add new asset counter. A new entry to this table
         is added if there is a new category. */}
        {/* <div className="ml-auto flex items-center gap-2">
              <AddAssetCounter />
            </div> */}
      </div>
      <ScrollArea className=" w-full rounded-md border h-full">
        <Table className="text-xs relative ">
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
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <DataTablePagination table={table} />
    </div>
  );
}
