"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HardwareType } from "@/types/asset";
import ActionCell from './EmployeeAssetsAction';
import DeploymentDuration from "./DeploymentDuration";
import RetrieveAsset from "../inventory-ui/RetrieveAsset";
import DeployAsset from "../inventory-ui/DeployAsset";

export const EmployeeAssetsColumns: ColumnDef<HardwareType>[] = [
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
    accessorKey: "deploymentDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-translate-x-4 text-xs whitespace-nowrap text-start px-2"
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
    accessorKey: "deploymentDuration",
    header: () => {
      return (
        <div className="w-[120px]">Duration</div>
      )
    },
    cell: ({ row }) => <DeploymentDuration deploymentDate={row.original.deploymentDate} />
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