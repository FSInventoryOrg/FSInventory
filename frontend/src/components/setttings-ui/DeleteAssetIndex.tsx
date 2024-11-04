import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import DeletePropertyDialog from "../inventory-ui/DeletePropertyDialog";
import { useState } from "react";
import { AssetCounterType } from "@/types/asset";
import { useAppContext } from "@/hooks/useAppContext";

interface DeleteProps {
  data: AssetCounterType;
}

const DeleteAssetIndex = ({ data }: DeleteProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { showToast } = useAppContext();

  const onDeleteSuccess = () => {
    showToast({
      message: "Asset counter and category deleted successfully!",
      type: "SUCCESS",
    });
  };

  const handleDelete = () => {
    onDeleteSuccess();
  };

  return (
    <>
      <Button
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
