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
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as authService from '@/auth-service'
import { useAppContext } from '@/hooks/useAppContext'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '../Spinner'

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex gap-2 text-md items-center'><MailIcon size={20}/>Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} autoComplete="off" />
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
              <FormLabel className='flex gap-2 text-md items-center'><LockIcon size={20}/>Password</FormLabel>
              <div className='flex items-center relative'>
                <FormControl>
                  <Input type={isPasswordVisible ? "text" : "password"} placeholder="" {...field} autoComplete="off" />
                </FormControl>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handlePasswordVisibility}
                  className='absolute right-0'
                >
                  { isPasswordVisible ? <EyeIcon /> : <EyeOffIcon /> }
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='pt-4'>
          <Button type='submit' className="w-full gap-2" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Spinner size={18}/> : null }
            Next
          </Button>
        </div>
      </form>
    </Form>    
  );
}

export default SignInForm;
