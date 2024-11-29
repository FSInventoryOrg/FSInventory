import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignInSchema from "@/schemas/SignInSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as authService from "@/auth-service";
import { useAppContext } from "@/hooks/useAppContext";
import { useUserContext } from "@/hooks/useUserData";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../Spinner";
import { LoginReturn } from "@/types/auth";

export type SignInFormData = {
  email: string;
  password: string;
};

interface SignInFormProps {
  onError: (errorMessage: string | null) => void;
  onSubmit: () => void;
}

const SignInForm = ({ onError, onSubmit }: SignInFormProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { setUser } = useUserContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSignInError = (errorMessage: string) => {
    onError(errorMessage);
  };

  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data: LoginReturn) => {
      const {
        employee_id: id,
        role_name: role,
        first_name,
        last_name,
        is_admin,
        email,
        avatar,
      } = data.user;

      setUser({
        _id: String(id),
        role,
        first_name,
        last_name,
        is_admin,
        email,
        avatar,
      });
      setServerError(false);
      showToast({
        message: "You have logged in to the session.",
        type: "SUCCESS",
      });
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      setServerError(true);
      handleSignInError(error.message);
    },
  });

  const handleSubmit = (data: z.infer<typeof SignInSchema>) => {
    onSubmit();
    setServerError(false);
    setIsSubmitting(true);
    setIsPasswordVisible(false);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 font-poppins"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={
                  "flex gap-2 text-md items-center font-normal dark:text-white"
                }
              >
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  error={serverError}
                  placeholder="Enter email address"
                  {...field}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={
                  "flex gap-2 text-md items-center font-normal dark:text-white"
                }
              >
                Password
              </FormLabel>
              <div className="flex items-center relative">
                <FormControl>
                  <Input
                    type={isPasswordVisible ? "text" : "password"}
                    error={serverError}
                    placeholder="Password"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePasswordVisibility}
                  className="absolute right-0"
                >
                  {isPasswordVisible ? (
                    <EyeIcon color="#565F5C" />
                  ) : (
                    <EyeOffIcon color="#565F5C" />
                  )}
                </Button>
                <style>{`
                  .hide-password-toggle::-ms-reveal,
                  .hide-password-toggle::-ms-clear {
                    visibility: hidden;
                    pointer-events: none;
                    display: none;
                  }
                `}</style>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full gap-2 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner size={18} /> : "Sign in"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
