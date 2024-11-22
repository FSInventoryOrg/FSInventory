import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, MailIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import * as authService from "@/auth-service";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../Spinner";
import { ForgotPasswordSchema } from "@/schemas/ForgotPasswordSchema";
import { useAppContext } from '@/hooks/useAppContext';

interface ForgotPasswordFormProps {
  onError: (errorMessage: string | null) => void;
}

const ForgotPasswordForm = ({ onError }: ForgotPasswordFormProps) => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const form = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleError = (errorMessage: string) => {
    onError(errorMessage);
  };
  const mutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: async () => {
      // When email sent is valid, user is redirected to the Reset Password Page
      navigate('/reset-password');
      showToast({ message: "OTP has been sent to your email.", type: "SUCCESS" });

    },
    onError: async (error: Error) => {
      handleError(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof ForgotPasswordSchema>) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-3"
      >
        <KeyRound className="ml-2 h-10 w-10" />
        <div>
          <h1 className="text-3xl font-bold">Forgot Password ?</h1>
          <p className="my-2 text-sm text-muted-foreground">
            Enter your email address below and we'll send you the reset
            instructions.{" "}
          </p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex text-md items-center gap-2">
                <MailIcon size={20} /> Email
              </FormLabel>
              <FormControl>
                <Input placeholder="" {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4 ">
          {form.formState.isSubmitting ? <Spinner size={18} /> : null}
          Reset Password
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
