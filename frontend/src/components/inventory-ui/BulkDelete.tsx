import React, { Dispatch, SetStateAction } from 'react';
import { TrashIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { AssetType } from '@/types/asset';
import { Row } from '@tanstack/react-table';
import { ScrollArea } from '../ui/scroll-area';
import { Spinner } from '../Spinner';

interface BulkDeleteProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: (assetIds: string[]) => void;
  selectedAssets: Row<AssetType>[];
  isLoading: boolean;
}

const BulkDelete: React.FC<BulkDeleteProps> = ({ open, setOpen, onDelete, selectedAssets, isLoading}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button
          size='icon'
          className='pl-2 pr-3 h-8 gap-1 w-fit'
          variant='destructive'
        >
          <TrashIcon size={16} />
          Delete ({selectedAssets.length})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          This action cannot be undone. Are you sure you want to delete the
          following asset(s)?   
        </AlertDialogDescription>
        <ScrollArea className='flex flex-col gap-4 max-h-[350px] px-2'>
            <ul className='mt-2 list-disc pl-5 text-sm text-muted-foreground mb-4'>
              {selectedAssets.map(({ original: asset }) => (
                <li key={asset.code}>
                  <span><strong>Code:</strong> {asset.code}</span>
                  <span>, <strong>Serial Number:</strong> {asset.serialNo}</span>
                  {asset.modelName ? <span>, <strong>Model:</strong> {asset.modelName}</span> : null}
                </li>
              ))}
            </ul>
          </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant='destructive' 
            onClick={()=> onDelete(selectedAssets?.map(({ original: asset }) => asset.code))}
            >
            {isLoading ? <Spinner size={18}/> : null }
            Delete {selectedAssets.length > 1 ? selectedAssets.length : ''}{' '}
            asset{selectedAssets.length > 1 ? 's' : ''}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BulkDelete;
