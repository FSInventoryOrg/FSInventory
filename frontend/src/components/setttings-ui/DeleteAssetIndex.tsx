import { Trash } from "lucide-react";
import TrashCan from "../graphics/TrashCan";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

const DeleteAssetIndex = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          {/* <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                asset and remove all its data from our servers.
              </AlertDialogDescription> */}
        </AlertDialogHeader>
        <TrashCan />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={() => {}} variant="destructive">
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAssetIndex;
