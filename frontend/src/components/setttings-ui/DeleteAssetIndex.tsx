import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import DeletePropertyDialog from "../inventory-ui/DeletePropertyDialog";
import { useState } from "react";
import { AssetCounterType } from "@/types/asset";

interface DeleteProps {
  data: AssetCounterType;
}

const DeleteAssetIndex = ({ data }: DeleteProps) => {
  const [openDialog, setOpenDialog] = useState(false);

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
      />
    </>
  );
};

export default DeleteAssetIndex;
