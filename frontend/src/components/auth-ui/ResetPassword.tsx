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
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = (data: z.infer<typeof ResetPasswordSchema>) => {
    console.log(data);
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
              <FormLabel className="text-l font-medium">New Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your current password"
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
              <FormLabel className="text-l font-medium">Confirm Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your current password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <Button type="submit" className="mt-4 ">
            Save password and Sign in <ArrowRight className="font-light"/>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPassword;
