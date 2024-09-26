
import { useState } from 'react'
import { MoreHorizontal, CopyIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { HardwareType } from '@/types/asset';
import AssetDetails from '../inventory-ui/AssetDetails';

export interface CellProps {
  row: {
    index: number;
    original: HardwareType;
  };
}

const ActionCell: React.FC<CellProps> = ({ row }) => {

  const asset = row.original;
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  return (
    <div className="justify-center flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="flex justify-between items-center gap-2"
              onClick={() => {
                navigator.clipboard.writeText(asset.code)
              }}
            >
              Copy code
              <CopyIcon size={16} className="text-muted-foreground" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className='flex flex-col'>
            <DialogHeader>
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
              <DialogTitle>{asset.code}</DialogTitle>
              <DialogDescription>
                Detailed information on asset {asset.code}, including types, specifications, status, deployment details, current possession, etc.
              </DialogDescription>
            </DialogHeader>
            <AssetDetails asset={asset} />
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default ActionCell;
