import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ChangePasswordForm from "./PasswordChangeForm";

interface PasswordChangeProps {
  disabled: boolean
}
const PasswordChangeModal = ({disabled}: PasswordChangeProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="secondary">Change Pasword</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
           Click update password to save your change.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ChangePasswordForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default PasswordChangeModal;
