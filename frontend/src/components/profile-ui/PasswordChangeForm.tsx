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

const ChangePasswordForm = () => {
  const form = useForm({
    resolver: zodResolver(ChangePasswordSchema),
    mode: 'onChange'
  });

  const onSubmit = () => {
    console.log("Button clicked");
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
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
        <Button className="w-full gap-2" type="submit" onClick={handleClick}>
          Update Password
        </Button>
      </form>
    </Form>
    
  );
};

export default ChangePasswordForm;
