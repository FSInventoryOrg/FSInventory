import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as imsService from "@/ims-service";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import TrashCan from "../graphics/TrashCan";

interface DeletePropertyProps {
  open: boolean;
  setOpen: (_: boolean) => void;
  property: string;
  value: string;
  onDelete?: () => void;
}

function format(str: string): string {
  return str
    .split(/(?=[A-Z])/)
    .map((part) => part.toLowerCase())
    .join(" ");
}

const DeletePropertyDialog = ({
  open,
  setOpen,
  property,
  value,
  onDelete,
}: DeletePropertyProps) => {
  const { data: assetCount } = useQuery<number>({
    queryKey: ["fetchAssetCount", property, value],
    queryFn: () => imsService.fetchAssetCount(property, value),
  });

  const queryClient = useQueryClient()

  const { mutate: deleteOption, isPending: isOptionDeletePending } =
    useMutation({
      mutationFn: () => imsService.deleteOption(property, value),
      onSuccess: async()=> {
        queryClient.invalidateQueries({ queryKey: ["fetchAssetCounters"] })
      }
    });

  const handleDelete = async () => {
    await deleteOption();
    await onDelete?.();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="border-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">
            {assetCount
              ? `Unable to delete ${format(property)}`
              : "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {assetCount ? (
              <>
                There are {assetCount} assets with {format(property)} of {value}
                . Deleting this {format(property)} is not allowed.
              </>
            ) : (
              <>
                There are no assets with {format(property)} {value}. It is safe
                to delete this {format(property)}.
              </>
            )}
          </AlertDialogDescription>
          <TrashCan />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {!assetCount && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isOptionDeletePending}
            >
              Delete {value}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePropertyDialog;
