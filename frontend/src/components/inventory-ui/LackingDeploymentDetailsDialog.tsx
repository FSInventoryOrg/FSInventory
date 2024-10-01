import { Dispatch, SetStateAction } from 'react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { AssetUnionType } from '@/types/asset';
  
interface LackingDeploymentDetailsDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  asset: AssetUnionType
  onRecoverAsset: () => void;
}

const LackingDeploymentDetailsDialog = ({
  open,
  setOpen,
  asset,
  onRecoverAsset,
}: LackingDeploymentDetailsDialogProps) => {

  const handleClick = () => {
    onRecoverAsset();
  };
  const assignee = asset?._addonData_assignee || asset?.assignee;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className='border-none'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-2xl font-bold'>
            Recover asset {asset.code}
          </AlertDialogTitle>
          <AlertDialogDescription>
            The asset being retrieved is missing deployment details:
            <ul className='mt-2 list-disc pl-5 text-sm text-muted-foreground mb-2'>
            {!assignee ? <li>Assignee</li> : null}
            {!asset.deploymentDate ? <li>Deployment date</li>: null}
            </ul>
            Would you like to continue to recover asset?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant='destructive' onClick={handleClick}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LackingDeploymentDetailsDialog