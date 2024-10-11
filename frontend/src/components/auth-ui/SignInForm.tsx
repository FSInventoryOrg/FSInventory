import { LockIcon, EyeIcon, EyeOffIcon, MailIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import SignInSchema from "@/schemas/SignInSchema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as authService from '@/auth-service'
import { useAppContext } from '@/hooks/useAppContext'
import { Link, useNavigate } from 'react-router-dom'
import { Spinner } from '../Spinner'
import { ThemeProviderContext } from "../ThemeProvider"

export type SignInFormData = {
  email: string;
  password: string;
}

interface SignInFormProps {
  onError: (errorMessage: string | null) => void;
}

const SignInForm = ({ onError }: SignInFormProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const darkMode: boolean = useContext(ThemeProviderContext).theme === 'dark';

  const handleSignInError = (errorMessage: string) => {
    onError(errorMessage)
  }
  
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
    onSuccess: async () => {
      showToast({ message: "You have logged in to the session.", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["validateToken"]});
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      handleSignInError(error.message)
    }
  });

  const onSubmit = (data: z.infer<typeof SignInSchema>) => {
    setIsPasswordVisible(false);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 font-poppins">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`flex gap-2 text-md items-center font-normal ${darkMode ? 'text-white' : ''}`}>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" {...field} autoComplete="off" />
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
              <FormLabel className={`flex gap-2 text-md items-center font-normal ${darkMode ? 'text-white' : ''}`}>
                Password
              </FormLabel>
              <div className='flex items-center relative'>
                <FormControl>
                  <Input type={isPasswordVisible ? "text" : "password"} placeholder="Password" {...field} autoComplete="off" />
                </FormControl>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handlePasswordVisibility}
                  className='absolute right-0'
                >
                  { isPasswordVisible ? <EyeIcon color="#565F5C"/> : <EyeOffIcon color="#565F5C"/> }
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='pt-4'>
          <Button type='submit' className="w-full gap-2 text-white" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Spinner size={18}/> : null }
            Sign in
          </Button>
        </div>
      </form>
    </Form>    
  );
}

export default SignInForm;
