
import { useState } from 'react'
import { MoreHorizontal, CopyIcon, TrashIcon, PenIcon, XIcon } from "lucide-react";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { HardwareType } from '@/types/asset';
import * as imsService from '@/ims-service'
import EditAsset from './EditAsset';
import TrashCan from '../graphics/TrashCan';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Defaults } from '@/types/options';

interface CellProps {
  row: {
    original: HardwareType;
  };
}

const ActionCell: React.FC<CellProps> = ({ row }) => {
  const queryClient = useQueryClient()
  const asset = row.original;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: defaultOptions } = useQuery<Defaults>({ 
    queryKey: ['fetchOptionValues', 'defaults'], 
    queryFn: () => imsService.fetchOptionValues('defaults'),
  })
  const handleDeleteAsset = async () => {
    await imsService.deleteAssetByCode(asset.code);
    queryClient.invalidateQueries({ queryKey: ["fetchAllAssets"] })
    queryClient.invalidateQueries({
      queryKey: ['fetchAllAssetsByStatusAndCategory'],
    });
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    setTimeout(() => {
      setIsDeleteDialogOpen(false);
    }, 100);
  };

  const handleClose = (close: boolean) => {
    setIsEditDialogOpen(!close)
  }

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
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent tabIndex={-1} className="min-w-full overflow-y-auto h-full bg-transparent justify-center flex border-none px-0 py-0 sm:py-16">
            <div className="sm:max-w-[800px] bg-card h-fit p-3 sm:p-6 rounded-lg">
            <DialogHeader className='relative'>
              <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
              <DialogTitle>Edit this asset</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Update information fields for this existing asset via the form below. Asset code can be changed, but entering an existing code of a different asset is not permitted.
              </DialogDescription>
            </DialogHeader>
            <EditAsset assetData={asset} onClose={handleClose} defaultValues={defaultOptions} />
            </div>
          </DialogContent>
        </Dialog>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className='border-none'>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                asset and remove all its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <TrashCan />
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
