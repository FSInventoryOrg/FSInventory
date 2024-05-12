"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HardwareType } from "@/types/asset";
import ActionCell from './AssetsHistoryAction';

export const AssetsHistoryColumns: ColumnDef<HardwareType>[] = [
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
      <div className="w-fit overflow-hidden text-ellipsis whitespace-nowrap">{row.original.code}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "modelName",
    header: "Model Name",
  },
  {
    accessorKey: "modelNo",
    header: "Model No.",
  },
  {
    accessorKey: "serialNo",
    header: "Serial No.",
  },
  {
    id: "actions",
    header: "Actions",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell: ({ row, table }) => <ActionCell row={row} employeeCode={JSON.stringify((table.options.meta as any).employee.code)} />

  },
]