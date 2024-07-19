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
import { AssetCounterType } from "@/types/asset";
import { useEffect, useState } from "react";
import ErrorAlert from "../ErrorAlert";

interface EditProps {
  data: AssetCounterType;
}

const EditAssetIndex = ({ data }: EditProps) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>();

  const handleErrorAlert = (errorMessage: string | null) => {
    setErrorMessage(errorMessage);
  };

  useEffect(() => {
    setErrorMessage(null);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Asset Counter</DialogTitle>
        </DialogHeader>
        {errorMessage ? <ErrorAlert errorMessage={errorMessage} /> : null}
        <EditAssetCounter
          assetCounter={data}
          onClose={() => setOpen(false)}
          onError={handleErrorAlert}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditAssetIndex;
