import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { PasswordInput } from "../PasswordInput";
import { Button } from "../ui/button";
import { ChangePasswordSchema } from "@/schemas/ResetPasswordSchema";
import { z } from "zod";
import * as authService from "@/auth-service";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";


interface ChangePasswordFormProps {
  onError: (errorMessage: string | null) => void;
  onSuccess: ()=> void;
}
const ChangePasswordForm = ({ onError, onSuccess }: ChangePasswordFormProps) => {
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: 'onChange'
  });

  const currentPassword = form.watch("currentPassword")
  const newPassword = form.watch("newPassword")
  useEffect(()=> {
    if(currentPassword && newPassword) form.trigger("newPassword")
    if(newPassword) form.trigger("confirmPassword")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentPassword, newPassword])

  const handleError = (errorMessage: string) => {
    onError(errorMessage);
  };

  const mutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: async () => {
      // Once user successfully updates pasword, log them out to let them login
      // with the new credentials.
      onSuccess();
    },
    onError: async (error: Error) => {
      handleError(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof ChangePasswordSchema>) => {
    mutation.mutate({currentPassword: data.currentPassword, newPassword: data.newPassword})
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-l font-medium">
                Current Password
              </FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="Enter your current password" />
              </FormControl>
              <FormMessage />
              {/* Current password is incorrect. Please try again. */}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-l font-medium">New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="Enter your new password"
                />
              </FormControl>
              <FormMessage />
              {/* New password must be different from current password. */}
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-l font-medium">Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="Confirm your new password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full gap-2" type="submit" disabled={!form.formState.isValid}>
          Update Password
        </Button>
      </form>
    </Form>
    
  );
};

export default ChangePasswordForm;
