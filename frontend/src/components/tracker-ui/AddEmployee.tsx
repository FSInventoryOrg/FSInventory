import { useEffect, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
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
import { ArrowRightIcon, PlusIcon, CalendarIcon, XIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EmployeeFormData, EmployeeSchema } from "@/schemas/AddEmployeeSchema";
import { FullScaleIcon } from "../icons/FullScaleIcon";
import { Separator } from "../ui/separator";
import { UserIcon } from "../icons/UserIcon";
import { Checkbox } from "../ui/checkbox";

const AddEmployee = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false); 
  const [employeeName, setEmployeeName] = useState('');
  const [newEmployeeCode, setNewEmployeeCode] = useState('');
  const [openCalendar, setOpenCalendar] = useState(false);
  const { showToast } = useAppContext();

  const form = useForm<z.infer<typeof EmployeeSchema>>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      code: '',
      firstName: '',
      middleName: '',
      lastName: '',
      position: '',
      startDate: undefined,
      isActive: true,
    }
  });

  const { mutate: updateAssetsByProperty, isPending: isAssetEditPending } = useMutation({
    mutationFn: imsService.updateAssetsByProperty,
  });

  const { mutate, isPending: isAddEmployeePending } = useMutation({
    mutationFn: imsService.addEmployee,
    onSuccess: async () => {
      showToast({ message: "New employee added successfully!", type: "SUCCESS" });

      updateAssetsByProperty({
        property: 'assignee',
        value: employeeName,
        newValue: newEmployeeCode,
      });

      updateAssetsByProperty({
        property: 'recoveredFrom',
        value: employeeName,
        newValue: newEmployeeCode,
      });

      queryClient.invalidateQueries({ queryKey: ["fetchEmployees"] })
      queryClient.invalidateQueries({ queryKey: ["fetchEmployeeByCode"] })
      window.location.replace(`/tracker/${newEmployeeCode}`)

      setTimeout(() => {
        setOpen(false);
      }, 100)
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });

  const onSubmit = (data: z.infer<typeof EmployeeSchema>) => {
    const employeeData: EmployeeFormData = {
      ...data,
    }
    setEmployeeName(`${employeeData.firstName} ${employeeData.lastName}`)
    setNewEmployeeCode(employeeData.code)
    mutate(employeeData)
  }

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form])

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
        <Button className='h-8 px-2 gap-1 font-semibold rounded-md border-0'>
          <span className="hidden md:inline-block text-sm">New</span>
          <PlusIcon className="h-4 w-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent tabIndex={-1} className="min-w-full overflow-y-auto h-full bg-transparent items-start sm:items-center justify-center flex border-none px-0 py-0 sm:py-16">
        <div className="sm:max-w-[800px] w-full bg-card h-max sm:h-fit p-0 rounded-none sm:rounded-lg border">
          <DialogHeader className="relative">
            <DialogClose className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form className="flex flex-col md:flex-row w-full" onSubmit={form.handleSubmit(onSubmit)}>
                <div id='side' className="flex flex-col justify-center items-center md:items-start gap-4 bg-accent rounded-md py-4 md:px-4">
                  {isSM ? 
                    <>
                      {!isMD && <FullScaleIcon size={80} className="fill-current text-primary"/>}  
                      <div className="h-56 w-56 bg-muted border-border border rounded-full justify-center items-center flex">
                        <UserIcon size={220} className="fill-current text-secondary" />
                      </div>
                    </>
                    :
                    <>
                      {!isMD && <FullScaleIcon size={40} className="fill-current text-primary"/>}  
                      <div className="h-24 w-24 bg-muted border-border border rounded-full justify-center items-center flex">
                        <UserIcon size={110} className="fill-current text-secondary" />
                      </div>
                    </>
                  }
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <>
                        <div className="flex justify-center items-center bg-border rounded-md">
                          <FormLabel className='text-sm text-secondary-foreground text-nowrap px-2'>ID No.</FormLabel>
                          <FormItem className="flex gap-2 justify-center items-center bg-border rounded-md py-0 my-0">
                            <FormControl>
                              <Input className="h-8 w-full text-sm border-border py-0 my-0" placeholder="FS-XXXX" autoComplete="off" type="input" {...field} />
                            </FormControl>
                          </FormItem>
                        </div>
                        <FormMessage />
                      </>
                    )}
                  />  
                </div>          
                <div id='main' className="w-full flex flex-col justify-between items-center gap-4 p-4">
                  {isMD && <FullScaleIcon size={80} className="fill-current text-primary"/>}
                  <div className="flex w-full flex-col gap-2 items-start">
                    <div className="flex w-full flex-col sm:flex-row gap-2 justify-center items-center">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="w-full self-start">
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
                          <FormItem className="w-full self-start">
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
                          <FormItem className="w-full self-start">
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
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <div className="flex flex-col w-full">
                          <div className="flex w-full gap-2 justify-center items-center bg-border rounded-md pl-2">
                            <FormLabel className='text-sm text-accent-foreground text-nowrap'>Start Date</FormLabel>
                            <FormItem className="flex flex-col w-full">
                              <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
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
                                <PopoverContent className="w-auto p-0 h-[350px] z-10" align="end">
                                  <Calendar
                                    mode="single"
                                    onSelect={field.onChange}
                                    onDayClick={() => {setOpenCalendar(false)}}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          </div>
                          <FormMessage />
                        </div>
                      )}
                    />  
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
                    <Button type="submit" disabled={(isAddEmployeePending || isAssetEditPending) } className="gap-2">
                      {(isAddEmployeePending || isAssetEditPending) ? <Spinner size={18}/> : null }
                      Create Employee
                      <ArrowRightIcon />
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddEmployee;
