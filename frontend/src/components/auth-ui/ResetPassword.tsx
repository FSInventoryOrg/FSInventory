import { ArrowRight, KeyRound } from "lucide-react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/hooks/useAppContext";
import * as authService from "@/auth-service";
import {
  ResetPasswordSchemaWithOTP
} from "@/schemas/ResetPasswordSchema";
import { PasswordInput } from "../PasswordInput";
import { useEffect } from "react";

interface ResetPasswordFormProps {
  onError: (errorMessage: string | null) => void;
  onSuccess: () => void;
}

const ResetPassword = ({ onError, onSuccess }: ResetPasswordFormProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  
  const form = useForm<z.infer<typeof ResetPasswordSchemaWithOTP>>({
    resolver: zodResolver(ResetPasswordSchemaWithOTP),
    mode: "onChange",
  });

  const password = form.watch("newPassword")

  useEffect(() => {
    if(password) form.trigger("confirmPassword")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  const handleError = (errorMessage: string) => {
    onError(errorMessage);
  };

  const mutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: async () => {
      onSuccess()
      showToast({ message: "You have logged in to the session.", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["validateToken"]});
    },
    onError: async (error: Error) => {
      handleError(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof ResetPasswordSchemaWithOTP>) => {
    mutation.mutate({ newPassword: data.newPassword, token: data.otp });
  };

  return (
    <div className="flex flex-col w-full justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <KeyRound className="ml-2 h-10 w-10" />
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="my-2 text-sm text-muted-foreground">
            Please enter OTP sent in your email.
          </p>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-l font-medium">
                  OTP
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Enter the 6 digit otp"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="my-2 text-sm text-muted-foreground">
            Please enter your new password below.
          </p>
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-l font-medium">
                  New Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Enter your new password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-l font-medium">
                  Confirm Password
                </FormLabel>
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
          <Button type="submit" className="mt-4 " disabled={!form.formState.isValid}>
            Save password and Sign in <ArrowRight className="font-light" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPassword;
