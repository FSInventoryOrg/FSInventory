import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogHeader,
} from "../ui/dialog";
import { NotebookPenIcon, XIcon } from "lucide-react";
import { AssetUnionType } from "@/types/asset";
import { Circle } from "@phosphor-icons/react";

interface AssetCodeProps {
  asset: AssetUnionType;
}
const RemarksIndicator = ({ asset }: AssetCodeProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogTrigger asChild>
        <Circle className="ml-1" weight="fill" color="#ebb505" size={12} />
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogTitle>{asset.code}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1 text-sm border-t mt-4">
          <h1 className="static -translate-y-3 translate-x-3 bg-background px-1 text-secondary-foreground flex items-center gap-1.5 w-fit">
            <NotebookPenIcon size={16} className="text-primary" />
            Remarks
          </h1>
          <span className="border rounded-md p-2 min-h-20 bg-muted">
            {asset.remarks}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemarksIndicator;
