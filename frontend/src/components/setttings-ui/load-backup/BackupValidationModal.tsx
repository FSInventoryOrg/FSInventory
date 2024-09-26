import { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';
import { Separator } from '@/components/ui/separator';
import { ValidationResult, MongoResult } from './LoadBackupForm';
import { BackupDiffDisplay } from './BackupDiffDisplay';
import { XIcon } from "lucide-react"

interface BackupValidationModalProps {
  result: ValidationResult,
  validationComplete: boolean | null
}

export const BackupValidationModal: React.FC<BackupValidationModalProps> = ({ result, validationComplete }) => { 
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button
            disabled={result.message === '' && !validationComplete}
            className="w-[125px]"
          >
            {validationComplete === false ?
              <Spinner size={18} />
              :
              <>Load file</>
            }
          </Button>
      </DialogTrigger>
      <DialogContent tabIndex={-1} className="w-full overflow-y-auto h-full bg-transparent items-center justify-center flex border-none px-0 py-0 sm:py-16 overflow-none">
        <div className="sm:max-w-[500px] w-full bg-card h-fit flex justify-between flex-col gap-6 p-6 rounded-lg">
          <DialogHeader className="relative">
            <DialogTitle className="flex justify-center items-center my-2">
              Confirm Changes
            </DialogTitle>
            <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogDescription className='flex flex-col gap-4'>
              <span className='w-full flex justify-center text-xl text-primary font-semibold'>The following collections will be affected:</span>
            </DialogDescription>
          </DialogHeader>
          {result.values === undefined ?
            <>No conflicts with the database.</> :
            <BackupDiffDisplay values={result.values} />
          }
        </div>
      </DialogContent> 
    </Dialog>)
}