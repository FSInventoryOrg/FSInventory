import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as authService from '@/auth-service'
import { useAppContext } from '@/hooks/useAppContext'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react';
import { Button } from "../ui/button"
import ExitDoor from "../graphics/ExitDoor"

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const mutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      showToast({ message: "You have been logged out of the session.", type: "SUCCESS" });
      navigate("/");
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] })

    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });

  const handleClick = () => {
    mutation.mutate();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="font-medium text-lg relative gap-2 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
        <LogOut />Log out
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">Are you leaving?</AlertDialogTitle>
          <AlertDialogDescription className="">
            Are you sure you want to log out? All your unsaved data will be lost.
          </AlertDialogDescription>
          <ExitDoor />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant='destructive' onClick={handleClick}>Continue</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SignOutButton;