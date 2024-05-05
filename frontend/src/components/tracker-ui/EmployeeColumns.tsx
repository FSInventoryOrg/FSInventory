"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeType } from "@/types/employee";

export const EmployeeColumns: ColumnDef<EmployeeType>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className={`w-fit overflow-hidden text-ellipsis whitespace-nowrap ${row.original.code === '' ? "text-destructive text-xs tracking-tight font-semibold" : ""}`}>
        {row.original.code === '' ? "UNREGISTERED" : row.original.code }
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs whitespace-normal text-start px-2 w-fit gap-2 flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="w-fit overflow-hidden text-ellipsis whitespace-nowrap">{row.original.name}</div>
    ),
  },
]