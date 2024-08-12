import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '../ui/dialog';
import { XIcon } from 'lucide-react';
import AssetDetails from './AssetDetails';
import { HardwareType } from '@/types/asset';

interface AssetCodeProps {
  asset:  HardwareType;
}
const AssetCode = ({ asset }: AssetCodeProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size="sm"
          className='text-xs font-normal px-2 py-0 w-fit overflow-hidden text-ellipsis whitespace-nowrap hover:underline'
        >
          {asset.code}
        </Button>
      </DialogTrigger>
      <DialogContent className='flex flex-col'>
        <DialogHeader>
          <DialogClose className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
            <XIcon className='h-4 w-4' />
            <span className='sr-only'>Close</span>
          </DialogClose>
          <DialogTitle>{asset.code}</DialogTitle>
          <DialogDescription>
            Detailed information on asset {asset.code}, including types,
            specifications, status, deployment details, current possession, etc.
          </DialogDescription>
        </DialogHeader>
        <AssetDetails asset={asset} />
      </DialogContent>
    </Dialog>
  );
};

export default AssetCode;