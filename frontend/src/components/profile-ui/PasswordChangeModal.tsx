import { useEffect, useState } from "react";
import PasswordChangedSuccess from "../auth-ui/PasswordChangedSuccess";
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
import Alert, { Props } from "@/components/Alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as authService from "@/auth-service";
import { useAppContext } from "@/hooks/useAppContext";
import { useNavigate } from "react-router-dom";

interface PasswordChangeProps {
  disabled: boolean;
}
const PasswordChangeModal = ({ disabled }: PasswordChangeProps) => {
  const [open, setOpen] = useState(false)
  const [showSuccessSplash, setShowSuccessSplash] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const { mutate: logout } = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      showToast({
        message: "You have been logged out of the session.",
        type: "SUCCESS",
      });
      setTimeout(() => {
        navigate("/");
      }, 100)
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
    
    },
  });

  useEffect(()=> {
    if(!open) {
      if (showSuccessSplash) logout()
      setAlert({type: "", message: ""})
      setShowSuccessSplash(false)
    }
  }, [open, showSuccessSplash, logout])
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="secondary">
          Change Pasword
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
      >
        {showSuccessSplash ? (
          <PasswordChangedSuccess
            redirectPath={{ name: "login", path: "/login" }}
            delay={3000}
            skipWait={false}
            onComplete={logout}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Click update password to save your change.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {alert.message && (
                <Alert
                  type={alert.type as Props["type"]}
                  message={alert.message}
                />
              )}
              <ChangePasswordForm
                onError={(errorMessage) =>
                  setAlert({ type: "error", message: errorMessage as string })
                }
                onSuccess={() => setShowSuccessSplash(true)}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default PasswordChangeModal;
