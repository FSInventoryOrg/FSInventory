
import { useState } from 'react'
import { MoreHorizontal, CopyIcon, TrashIcon, EyeIcon, PenIcon } from "lucide-react";
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
import AssetDetails from './AssetDetails';
import EditAsset from './EditAsset';
import TrashCan from '../graphics/TrashCan';
import { useQueryClient } from '@tanstack/react-query';

interface CellProps {
  row: {
    original: HardwareType;
  };
}

const ActionCell: React.FC<CellProps> = ({ row }) => {
  const queryClient = useQueryClient()
  const asset = row.original;
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteAsset = async () => {
    await imsService.deleteAssetByCode(asset.code);
    queryClient.invalidateQueries({ queryKey: ["fetchAllAssets"] })
    queryClient.invalidateQueries({ queryKey: ["fetchAllAssetsByStatusAndCategory"] })
    setTimeout(() => {
      setIsDeleteDialogOpen(false);
    }, 100)
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
              onClick={() => setIsEditDialogOpen(true)}
              >
              Edit asset
              <PenIcon size={16} className="text-muted-foreground" />
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
          <DialogContent className='bg-card'>
            <DialogHeader>
              <DialogTitle>{asset.code}</DialogTitle>
              <DialogDescription>
                Detailed information on asset {asset.code}, including types, specifications, status, deployment details, current possession, etc.
              </DialogDescription>
              <AssetDetails asset={asset} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[800px] bg-card overflow-y-scroll max-h-screen scrollbar-hide">
            <DialogHeader>
              <DialogTitle>Edit this asset</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Update information fields for this existing asset via the form below. Asset code can be changed, but entering an existing code of a different asset is not permitted.
              </DialogDescription>
            </DialogHeader>
            <EditAsset assetData={asset} />
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
