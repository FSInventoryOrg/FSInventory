import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  className?: string;
  variant?: string;
  FirstPageIcon?: React.ReactNode;
  LastPageIcon?: React.ReactNode;
}

export function DataTablePagination<TData>({
  table,
  className,
  variant,
  FirstPageIcon,
  LastPageIcon,
}: DataTablePaginationProps<TData>) {
  const [isMD, setIsMD] = React.useState(false);
  const buttonVariant = variant === "light" ? "ghost" : "outline";

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMD(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);
  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between pt-4",
        className
      )}
    >
      {/* To hide number of rows selected for tables without a Select column, set enableRowSelection in Options */}
      {table.options.enableRowSelection ? (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      ) : (
        <div className="flex-1"></div>
      )}
      <div className="flex w-full sm:w-fit items-center justify-between sm:justify-normal space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          {isMD && <p className="text-sm font-medium">Rows per page</p>}
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger
              className={cn(
                "h-8 w-[70px]",
                variant === "light" && "bg-white text-secondary"
              )}
            >
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={buttonVariant}
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            {FirstPageIcon ?? <ChevronsLeftIcon className="h-4 w-4" />}
          </Button>
          <Button
            variant={buttonVariant}
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={buttonVariant}
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            {LastPageIcon ?? <ChevronsRightIcon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
