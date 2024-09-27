import { useState, useEffect } from 'react';
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
import { Warning } from '@phosphor-icons/react';

interface BackupValidationModalProps {
  result: ValidationResult,
  validationComplete: boolean | null
}

export const BackupValidationModal: React.FC<BackupValidationModalProps> = ({ result, validationComplete }) => { 
  const [open, setOpen] = useState<boolean>(false);
  const collectionChanges: { [index: string]: {[index:string]: '' | 'current' | 'backup'} } = {}

  useEffect(() => {
    if(validationComplete) {
      for (const collection in result.values!!) {
        collectionChanges[collection] = {}
        for (const document of result.values[collection].backup) {
          collectionChanges[collection][document._id] = ''
        }
      }
    }
  }, [validationComplete])

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
      <DialogContent tabIndex={-1} className="w-full overflow-y-auto h-full bg-transparent items-center justify-center flex flex-col border-none px-0 py-0 sm:py-16 overflow-none">
        <div className="sm:max-w-[500px] w-full bg-card h-fit flex justify-between flex-col gap-6 p-6 rounded-lg">
          <DialogHeader className="relative">
            <DialogTitle className="flex justify-center items-center my-2">
              Confirm Changes
            </DialogTitle>
            <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogDescription className='flex flex-col gap-1'>
              <span className='w-full flex justify-center text-xl text-primary font-semibold'>The following collections will be affected:</span>
            </DialogDescription>
          </DialogHeader>
          {result.values === undefined ?
            <>No conflicts with the database.</> :
            <BackupDiffDisplay values={result.values} />
          }
          <div className="flex flex-col gap-y-2">
            <span className="flex gap-x-1 text-sm items-center font-bold">
              <Warning size={24} weight="fill" color="#fac514" />
              DOCUMENTS MARKED 
              <span className={`
                w-fit h-fit px-2 py-1
                border-0 rounded-lg
                flex justify-center
                font-sans font-bold text-xs bg-destructive
                text-nowrap
              `}>
                NO BACKUP
              </span> WILL BE ERASED!
            </span>
            <span className="flex gap-x-1 text-sm">
              <span className={`
                w-fit h-fit px-2 py-1
                border-0 rounded-lg
                flex justify-center
                font-sans font-bold text-xs bg-[#2380C2]
              `}>
                CHANGED
              </span> documents will follow selected changes.
            </span>
            <span className="text-sm">Please go through all of the affected documents before confirming.</span>
          </div>
          <div className="w-full flex flex-row-reverse">
            <Button disabled={true} className="w-[125px]">
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent> 
    </Dialog>)
}