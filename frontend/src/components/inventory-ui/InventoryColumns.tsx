"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { HardwareType } from "@/types/asset";
import ActionCell from './InventoryAction';
import StatusBadge from "./StatusBadge";
import RetrieveAsset from "./RetrieveAsset";
import DeployAsset from "./DeployAsset";

export const InventoryColumns: ColumnDef<HardwareType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "processor",
    header: "Processor",
  },
  {
    accessorKey: "memory",
    header: "Memory",
  },
  {
    accessorKey: "storage",
    header: "Storage",
  },
  {
    accessorKey: "status",
    header: () => {
      return (
        <div className="text-xs whitespace-normal text-start px-2 w-fit" >
          Status
        </div>
      )
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <StatusBadge status={status} style="flat" />
      );
    },
  },
  {
    accessorKey: "client",
    header: "From Client",
  },
  {
    accessorKey: "_addonData_assignee",
    header: "Assignee",
  },
  {
    accessorKey: "purchaseDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs whitespace-nowrap text-start px-2 w-fit"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Purchase Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      if (row.original.purchaseDate) {
        const formattedDate = new Date(row.getValue("purchaseDate")).toLocaleDateString("en-US");
        return <div className="translate-x-4 w-fit">{formattedDate}</div>;
      } else {
        return <></>;
      }
    }
  },
  {
    accessorKey: "serviceInYears",
    header: "Service In Years",
    cell: ({ row }) => {
      let serviceInYears = null
      if (row.original.purchaseDate !== null) {
        const currentDate = new Date(); // Get current date
        const purchaseDate = new Date(row.getValue("purchaseDate"));
        serviceInYears = Math.round((currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365)); 
      } 
      return (
        <div className="text-center">
          {serviceInYears}
        </div>
      )
    }
  },
  {
    accessorKey: "supplierVendor",
    header: "Supplier/Vendor",
  },
  {
    accessorKey: "pezaForm8105",
    header: "PEZA Form (8105)",
  },
  {
    accessorKey: "pezaForm8106",
    header: "PEZA Form (8106)",
  },
  {
    accessorKey: "isRGE",
    header: "Is RGE",
    cell: ({ row }) => (row.original.isRGE ? "YES" : "NO")
  },
  {
    accessorKey: "equipmentType",
    header: "Equipment Type",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    accessorKey: "deploymentDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-translate-x-4 text-xs whitespace-normal text-start px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Deployment Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      if (row.original.deploymentDate) {
        const formattedDate = new Date(row.getValue("deploymentDate")).toLocaleDateString("en-US");
        return <>{formattedDate}</>;
      } else {
        return <></>;
      }
    }
  },
  {
    accessorKey: "recoveredFrom",
    header: "Recovered From",
  },
  {
    accessorKey: "recoveryDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-translate-x-4 text-xs whitespace-normal text-start px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Recovery Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      if (row.original.recoveryDate) {
        const formattedDate = new Date(row.getValue("recoveryDate")).toLocaleDateString("en-US");
        return <>{formattedDate}</>;
      } else {
        return <></>;
      }
    }
  },
  {
    id: "deployment",
    cell: ({ row }) => {
      if (row.original.status === 'Deployed') {
        return <RetrieveAsset assetData={row.original} />
      } else if (row.original.status === 'IT Storage') {
        return <DeployAsset assetData={row.original} />
      } else {
        return <></>
      }
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />
  },
]