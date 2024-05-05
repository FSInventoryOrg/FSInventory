
import { useState } from 'react'
import { MoreHorizontal, CopyIcon, TrashIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { HardwareType } from '@/types/asset';
import * as imsService from '@/ims-service'
import AssetDetails from '../inventory-ui/AssetDetails';
import TrashCan from '../graphics/TrashCan';

interface CellProps {
  row: {
    original: HardwareType;
  };
}

const ActionCell: React.FC<CellProps> = ({ row }) => {
  const asset = row.original;
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteAsset = async () => {
    // Assuming imsService is properly typed
    await imsService.deleteAssetByCode(asset.code);
    window.location.reload();
  };

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
            <DropdownMenuItem 
              className="flex justify-between items-center gap-2"
              onClick={() => setIsViewDialogOpen(true)}
              >
              View details
              <EyeIcon size={16} className="text-muted-foreground" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex justify-between items-center gap-2 text-destructive font-semibold focus:bg-destructive focus:text-destructive-foreground"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete asset
              <TrashIcon size={16}/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{asset.code}</DialogTitle>
              <DialogDescription>
                Detailed information on asset {asset.code}, including types, specifications, status, deployment details, current possession, etc.
              </DialogDescription>
              <AssetDetails asset={asset} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                asset and remove all its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <TrashCan/>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button onClick={handleDeleteAsset} variant='destructive'>Delete asset {asset.code}</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
};

export default ActionCell;
