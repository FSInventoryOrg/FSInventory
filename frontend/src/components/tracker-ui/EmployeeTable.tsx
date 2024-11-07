"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import Empty from "../graphics/Empty";
import AddEmployee from "./AddEmployee";
import { EmployeePagination } from "./EmployeePagination";
import { EmployeeType } from "@/types/employee";
import EmployeeFilter from "./EmployeeFilter";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
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
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const searchColumns: any[] = ["name", "code"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const exactFilter: FilterFn<any> = (row, _columnId, value) => {
  const objectValue: string = searchColumns.reduce(
    (accum: any, element: any) => {
      accum += ` ${row.getValue(element)?.toString().toLowerCase() || ""}`;

      return accum;
    },
    ""
  );

  const searchTerm: string = value?.toString().toLowerCase() || "";
  let isFound: boolean = true;

  searchTerm
    .split(" ")
    .filter((f) => f)
    .forEach((element: string) => {
      if (isFound) isFound = objectValue.includes(element);
    });

  return isFound;
};

export function EmployeeTable<TData, TValue>({
  columns,
  data,
  onEmployeeSelect,
  onFilter,
}: EmployeeTableProps<TData, TValue>) {
  const [isXL, setIsXL] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
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
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleFilters = (filters: string[]) => {
    onFilter(filters);
  };
  const dataCount = React.useMemo(() => {
    return data ? data.length : 0;
  }, [data]);
  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center pb-2 gap-2">
        <div className="flex items-center w-full">
          <SearchIcon className="absolute translate-x-3 h-4 w-4" />
          <Input
            placeholder="Search employee..."
            value={globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm w-full pl-10 h-8 font-light rounded-md text-sm"
          />
        </div>
        <EmployeeFilter onFilter={handleFilters} dataCount={dataCount} />
        <AddEmployee />
      </div>
      <EmployeePagination table={table} />
      <ScrollArea
        className="rounded-md border h-full"
        style={isXL ? { maxHeight: "" } : {}}
      >
        <Table className="text-xs relative">
          <TableHeader className="sticky top-0 bg-accent z-10 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return !header.isPlaceholder ? (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ) : (
                    <TableHead />
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
                  onClick={() => {
                    if (row.original.code) {
                      // window.location.href = `/tracker/${row.original.code}`
                      history.pushState(
                        {},
                        "",
                        `/tracker/${row.original.code}`
                      );
                      onEmployeeSelect(row.original);
                    } else {
                      history.pushState({}, "", "/tracker");
                      onEmployeeSelect(row.original);
                    }
                    // onEmployeeSelect(row.original)
                  }}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="overflow-hidden max-w-[50%]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-full hover:bg-background">
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
      </ScrollArea>
    </div>
  );
}
