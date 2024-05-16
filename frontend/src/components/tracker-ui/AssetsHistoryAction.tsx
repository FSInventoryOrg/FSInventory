
import { useState } from 'react'
import { MoreHorizontal, CopyIcon, TrashIcon, EyeIcon, XIcon } from "lucide-react";
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
import AssetDetails from '../inventory-ui/AssetDetails';
 import { useQueryClient } from '@tanstack/react-query';

interface CellProps {
  row: {
    index: number;
    original: HardwareType;
  };
  employeeCode: string;
}

const ActionCell: React.FC<CellProps> = ({ row, employeeCode }) => {
  let code = ''
  if (employeeCode) {
    code = employeeCode.charAt(0) === '"' && employeeCode.charAt(employeeCode.length - 1) === '"'
    ? employeeCode.slice(1, -1)
    : employeeCode;
  }

  const asset = row.original;
  const queryClient = useQueryClient();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleRemoveAsset = async () => {
    await imsService.removeAssetHistoryEntry(code, row.index);
    queryClient.invalidateQueries({ queryKey: ["fetchAllAssets"] })
    queryClient.invalidateQueries({ queryKey: ["fetchAssetsByProperty"] })
    queryClient.invalidateQueries({ queryKey: ["fetchAllAssetsByStatusAndCategory"] })
    queryClient.invalidateQueries({ queryKey: ["fetchEmployees"] })
    queryClient.invalidateQueries({ queryKey: ["fetchEmployeeByCode"] })
    setIsDeleteDialogOpen(false)
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
              Remove asset
              <TrashIcon size={16}/>
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
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className='border-none'>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove this
                asset from the employee's timeline.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button onClick={handleRemoveAsset} variant='destructive'>Remove asset {asset.code}</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
};

export default ActionCell;
