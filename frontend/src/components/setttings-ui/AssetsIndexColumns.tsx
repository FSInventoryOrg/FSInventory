import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetCounterType } from "@/types/asset";
import EditAssetIndex from "./EditAssetIndex";
import DeleteAssetIndex from "./DeleteAssetIndex";

export const AssetIndexColumns: ColumnDef<AssetCounterType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "prefixCode",
    header: "Prefix Code",
    cell: ({ row }) => <div className='uppercase'>{row.getValue("prefixCode")}</div>,
  },
  {
    accessorKey: "threshold",
    header: "Threshold",
    cell: ({ row }) => <div>{row.getValue("threshold")}</div>,
  },
  {
    accessorKey: "counter",
    header: "Index Count",
    cell: ({ row }) => <div>{row.getValue("counter")}</div>,
  },

  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <>
          <EditAssetIndex data={row.original} />
          <DeleteAssetIndex data={row.original} />
        </>
      );
    },
  },
];
