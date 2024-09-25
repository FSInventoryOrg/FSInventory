import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import DeletePropertyDialog from "../inventory-ui/DeletePropertyDialog";
import { useState } from "react";
import { AssetCounterType } from "@/types/asset";
import { useMutation } from '@tanstack/react-query';
import * as imsService from "@/ims-service";
import { useAppContext } from '@/hooks/useAppContext';

interface DeleteProps {
  data: AssetCounterType;
}

const DeleteAssetIndex = ({ data }: DeleteProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { showToast } = useAppContext();
  
  const onDeleteSuccess = () => {
    showToast({
      message: 'Asset counter and category deleted successfully!',
      type: 'SUCCESS',
    });
  }

  const { mutate: deleteAssetCounter, isPending } = useMutation({
    mutationFn: imsService.deleteAssetCounter,
    onSuccess: async () => {
      onDeleteSuccess();
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR"});
    },
  });

  const handleDelete = () => {
    if (!data._id) { 
      // Deleted category has no existing asset counter. Occurs for new categories not yet
      // configured with asset index or counter
      return onDeleteSuccess()
    }
    deleteAssetCounter(data.prefixCode as string);
  }
 
  return (
    <>
      <Button
        disabled={isPending}
        variant="ghost"
        size="icon"
        className="text-destructive"
        onClick={() => setOpenDialog(true)}
      >
        <Trash />
      </Button>
      <DeletePropertyDialog
        property="category"
        value={data.category}
        open={openDialog}
        setOpen={setOpenDialog}
        onDelete={handleDelete}
      />
    </>
  );
};

export default DeleteAssetIndex;
