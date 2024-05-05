import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon  } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import SignUpSchema from "@/schemas/SignUpSchema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as authService from '@/auth-service'
import { useAppContext } from '@/hooks/useAppContext'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '../Spinner'

export type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

interface SignUpFormProps {
  onError: (errorMessage: string | null) => void;
}

const SignUpForm = ({ onError }: SignUpFormProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignUpError = (errorMessage: string) => {
    onError(errorMessage)
  }
  
  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: async () => {
      showToast({ message: "Account created successfully.", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      navigate("/home");
    },
    onError: (error: Error) => {
      handleSignUpError(error.message)
    }
  });

  const onSubmit = (data: z.infer<typeof SignUpSchema>) => {
    setIsPasswordVisible(false);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='flex gap-2'>First name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='flex gap-2'>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />     
        </div>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex gap-2 text-md items-center'><UserIcon size={20}/>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full" {...field}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>
                This is your access level for permissions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <div className='flex items-center'>
                <FormControl>
                  <Input type={isPasswordVisible ? "text" : "password"} placeholder="" {...field} autoComplete="off" />
                </FormControl>
                <div className='absolute right-14 md:right-[88px]'>
                  <Button type="button" variant="ghost" onClick={handlePasswordVisibility}>
                    { isPasswordVisible ? <EyeIcon /> : <EyeOffIcon /> }
                  </Button>
                </div>
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

export default SignUpForm;
