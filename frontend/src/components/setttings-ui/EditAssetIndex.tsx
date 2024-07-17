import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import EditAssetCounter from "./EditAssetCounter";
import { AssetCounter } from "@/types/asset";

interface EditProps {
  data: AssetCounter;
}
const EditAssetIndex = ({ data }: EditProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Asset Counter</DialogTitle>
        </DialogHeader>
        <EditAssetCounter assetCounter={data} onClose={() => {}} />
      </DialogContent>
    </Dialog>
  );
};

export default EditAssetIndex;
