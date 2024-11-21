import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportTicketType } from "@/types/ticket";
import TicketPriority from "./TicketPriority";
import NameWithAvatar from "./NameWithAvatar";
import TicketID from "./TicketID";

export const SupportTicketColumns: ColumnDef<SupportTicketType>[] = [
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
    accessorKey: "ticketId",
    header: "Ticket ID",
    cell: ({ row }) => <TicketID ticket={row.original} />,
  },
  {
    accessorKey: "created",
    enableGlobalFilter: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs whitespace-nowrap text-start px-2 w-fit"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Submitted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (row.original.created) {
        const formattedDate = new Date(
          row.getValue("created")
        ).toLocaleDateString("en-US");
        return <div className="translate-x-4 w-fit">{formattedDate}</div>;
      }
      return <></>;
    },
  },
  {
    header: "Description",
    accessorFn: (row) => {
      if (row.type === "Asset Request") {
        return row.assetSpecsModel;
      }
      return row.assetAffected || "";
    },
  },
  {
    header: "Priority",
    enableGlobalFilter: false,
    accessorKey: "priority",
    cell: ({ row }) => {
      return <TicketPriority ticket={row.original} />;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return row.getValue("status");
    },
  },
  {
    header: "Submitted By",
    accessorKey: "employeeName",
    cell: ({ row }) => {
      return <NameWithAvatar fullName={row.getValue("employeeName")} />;
    },
  },
  {
    header: "Manager",
    accessorKey: "managerName",
    cell: ({ row }) => {
      return <NameWithAvatar fullName={row.getValue("managerName")} />;
    },
  },
  {
    id: "actions",
    enableGlobalFilter: false,
    header: "Actions",
    enableHiding: false,
    cell: () => {
      return (
        <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
    },
  },
];
