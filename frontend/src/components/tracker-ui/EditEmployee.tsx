import { useEffect, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as imsService from '@/ims-service'
import { useAppContext } from '@/hooks/useAppContext'
import { Spinner } from '../Spinner'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { ArrowRightIcon, PencilIcon, CalendarIcon, XIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EmployeeFormData, EmployeeSchema } from "@/schemas/AddEmployeeSchema";
import { FullScaleIcon } from "../icons/FullScaleIcon";
import { Separator } from "../ui/separator";
import { UserIcon } from "../icons/UserIcon";
import { Checkbox } from "../ui/checkbox";
import { EmployeeType } from "@/types/employee";
import { useNavigate } from "react-router-dom";

interface EditEmployeeProps {
  employeeData: EmployeeType;
}

const EditEmployee = ({ employeeData }: EditEmployeeProps) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false); 
  const [newEmployeeCode, setNewEmployeeCode] = useState('');
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof EmployeeSchema>>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      code: employeeData.code,
      firstName: employeeData.firstName,
      middleName: employeeData.middleName,
      lastName: employeeData.lastName,
      position: employeeData.position,
      startDate: employeeData.startDate ? new Date(employeeData.startDate) : undefined,
      isActive: employeeData.isActive,
    }
  });

  const { mutate, isPending: isEditEmployeePending } = useMutation({
    mutationFn: imsService.updateEmployee,
    onSuccess: async () => {
      showToast({ message: "Employee updated successfully!", type: "SUCCESS" });

      queryClient.invalidateQueries({ queryKey: ["fetchEmployees"] })
      queryClient.invalidateQueries({ queryKey: ["fetchEmployeeByCode"] })
      
      navigate(`/tracker/${newEmployeeCode}`)

      setTimeout(() => {
        setOpen(false);
      }, 100)
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = (data: z.infer<typeof EmployeeSchema>) => {
    const updatedEmployee: EmployeeFormData & { _id: string } = {
      ...data,
      _id: employeeData._id,
    }
    setNewEmployeeCode(updatedEmployee.code)
    mutate({ code: employeeData.code, updatedEmployee: updatedEmployee });
  }

  useEffect(() => {
    if (open) {
      form.reset({...employeeData, 
        startDate: employeeData.startDate 
          ? new Date(employeeData.startDate) 
          : undefined
      });
    }
  }, [open, form, employeeData])


  const [isMD, setIsMD] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMD(window.innerWidth >= 768); 
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const [isSM, setIsSM] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSM(window.innerWidth >= 640); 
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="icon"
          className="text-white flex justify-center items-center rounded-full h-8 w-8 sm:h-10 sm:w-10 bg-transparent hover:bg-muted-foreground/20 border-0">
          {isSM ? <PencilIcon size={20} /> : <PencilIcon size={16} />}
        </Button>
      </DialogTrigger>
      <DialogContent tabIndex={-1} className="sm:max-w-[800px] bg-card p-0 rounded-md">
        <div className="">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <Form {...form}>
            <form className="flex flex-col md:flex-row w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <div id='side' className="flex flex-col justify-center items-center md:items-start gap-4 bg-accent rounded-md py-4 md:px-4">
                {!isMD && <FullScaleIcon size={80} className="fill-current text-primary"/>}  
                <div className="h-56 w-56 bg-muted border-border border rounded-full justify-center items-center flex">
                  <UserIcon size={220} className="fill-current text-secondary" />
                </div>
                <div className="flex gap-1 justify-center items-center bg-border pl-2 rounded-md">
                  <FormLabel className='text-sm text-secondary-foreground text-nowrap'>ID No.</FormLabel>
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input className="h-8 w-full text-sm border-border" placeholder="FS-XXXX" autoComplete="off" type="input" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />  
                </div>
              </div>          
              <div id='main' className="w-full flex flex-col justify-between items-center gap-4 p-4">
                {isMD && <FullScaleIcon size={80} className="fill-current text-primary"/>}  
                <div className="flex w-full flex-col gap-2 items-start">
                  <div className="flex w-full gap-2 justify-center items-center">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input className="text-sm" placeholder="First name" autoComplete="off" type="input" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />  
                    <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input className="text-sm" placeholder="Middle name" autoComplete="off" type="input" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />  
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input className="text-sm" placeholder="Last name" autoComplete="off" type="input" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />  
                  </div>
                  <div className="flex w-full justify-center items-center">
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input className="text-sm" placeholder="Position" autoComplete="off" type="input" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />  
                  </div>
                  <Separator className="my-4" />
                  <div className="flex w-full gap-2 justify-center items-center bg-border rounded-md pl-2">
                    <FormLabel className='text-sm text-accent-foreground text-nowrap'>Start Date</FormLabel>
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>MM / DD / YEAR</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-10" align="end">
                              <Calendar
                                mode="single"
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date("1900-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />  
                  </div>
                </div>
                <div className="self-end flex flex-row justify-center items-center gap-2">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none text-accent-foreground">
                          <FormLabel>
                            Is employee active?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isEditEmployeePending} className="gap-2">
                    {isEditEmployeePending ? <Spinner size={18}/> : null }
                    Save Employee
                    <ArrowRightIcon />
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditEmployee;
