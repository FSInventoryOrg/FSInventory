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
import { useParams } from "react-router-dom";
import * as authService from "@/auth-service";
import {
  ResetPasswordSchema
} from "@/schemas/ResetPasswordSchema";
import { PasswordInput } from "../PasswordInput";
import { useEffect } from "react";

type ResetPasswordParams = {
  token: string;
};

interface ResetPasswordFormProps {
  onError: (errorMessage: string | null) => void;
  onSuccess: () => void;
}

const ResetPassword = ({ onError, onSuccess }: ResetPasswordFormProps) => {
  const { token } = useParams<ResetPasswordParams>();
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
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

  const onSubmit = (data: z.infer<typeof ResetPasswordSchema>) => {
    mutation.mutate({ newPassword: data.newPassword, token });
  };

  return (
    <div className="flex flex-col w-full justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <KeyRound className="ml-2 h-10 w-10" />
          <h1 className="text-3xl font-bold">Reset Password</h1>
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
