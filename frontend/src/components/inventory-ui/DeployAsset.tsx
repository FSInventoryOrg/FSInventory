import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input, InputProps } from '../ui/input';
import { HardwareType } from "@/types/asset"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as imsService from '@/ims-service'
import { useAppContext } from '@/hooks/useAppContext'
import { Spinner } from '../Spinner'
import { AssetFormData, AssetSchema} from "@/schemas/DeployAssetSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "../ui/calendar"
import React from "react"
import { RocketLaunch } from "@phosphor-icons/react"
import { EmployeeType } from "@/types/employee";

interface DeployAssetProps {
  assetData: HardwareType;
}

const DeployAsset = ({ assetData }: DeployAssetProps) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = React.useState(false)
  const [openDeploymentDate, setOpenDeploymentDate] = React.useState(false)
  const { showToast } = useAppContext();

  const form = useForm<z.infer<typeof AssetSchema>>({
    resolver: zodResolver(AssetSchema),
    defaultValues: {
      code: assetData.code,
      assignee: '',
      deploymentDate: undefined,
    }
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ['deployAsset'],
    mutationFn: imsService.deployAsset,
    onSuccess: async () => {
      showToast({ message: "Asset deployed successfully!", type: "SUCCESS" });
      queryClient.invalidateQueries({ queryKey: ["fetchAllAssetsByStatusAndCategory"] })
      setTimeout(() => {
        setOpen(false);
      }, 500)
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });

  const onSubmit = (data: z.infer<typeof AssetSchema>) => {
    const currentTime = new Date();
    data.deploymentDate.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds(), currentTime.getMilliseconds());
    const deployedAsset: AssetFormData & { _id: string } = {
      ...data,
      _id: assetData._id,
    }
    mutate({ code: assetData.code, deployedAsset: deployedAsset });
  }

  React.useEffect(() => {
    if (open) {
      form.reset()
    }
  }, [open, form])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-[90px] justify-between h-8 px-2 gap-2 text-xs font-semibold" variant='secondary'>
          Deploy
          <RocketLaunch weight="fill" size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Deploy asset {assetData.code}</SheetTitle>
          <SheetDescription>
            Fill-up the deployment details below. All fields are required for deployment.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4 py-4 w-full" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2 w-full">
              <FormLabel htmlFor="assignee" className="">
                Assignee
              </FormLabel>
              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <SuggestiveInput 
                        placeholder='e.g. Juan De La Cruz, Joe Smith' 
                        autoComplete='off' 
                        type='input' 
                        field={field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <FormLabel htmlFor="deploymentDate" className="">
                Deployment Date
              </FormLabel>
              <FormField
                control={form.control}
                name="deploymentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <Popover open={openDeploymentDate} onOpenChange={setOpenDeploymentDate} >
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
                      <PopoverContent className="w-auto p-0 h-[350px]" align="start">
                        <Calendar
                          mode="single"
                          onSelect={field.onChange}
                          onDayClick={() => setOpenDeploymentDate(false)}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <Button type="submit" disabled={isPending} className="gap-2 font-semibold">
                {isPending ? <Spinner size={18}/> : null }
                Deploy {assetData.code}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default DeployAsset;

interface SuggestiveInputProps extends InputProps {
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field?: any;
}

const SuggestiveInput = React.forwardRef<HTMLInputElement, SuggestiveInputProps>(
  ({ placeholder, field, className, autoComplete, type }, ref) => {
    const { data: employees } = useQuery<EmployeeType[]>({ 
      queryKey: ['fetchAllEmployees'], 
      queryFn: () => imsService.fetchAllEmployees(),
    });

    const [filteredOptions, setFilteredOptions] = React.useState<EmployeeType[]>([]);
    const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = event.target.value.toLowerCase().trim();
      const filtered = employees?.filter(employee =>
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm)
      ) || [];
      setFilteredOptions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1);
      field.onChange(event.target.value);
    };
    
    const handleSuggestionClick = (option: EmployeeType) => {
      setFilteredOptions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      // Set the form value to the employee code
      field.onChange(option.code);
    };
    
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
          field.onChange(filteredOptions[selectedIndex].code);
          setFilteredOptions([]);
          setShowSuggestions(false); // Hide suggestions when Enter is pressed
          setSelectedIndex(-1); // Reset selected index
        } else if (filteredOptions.length > 0) {
          field.onChange(filteredOptions[0].code);
          setFilteredOptions([]);
          setShowSuggestions(false); // Hide suggestions when Enter is pressed
          setSelectedIndex(-1); // Reset selected index
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredOptions.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex - 1 + filteredOptions.length) % filteredOptions.length);
      } else if (event.key === 'Tab' && showSuggestions) {
        event.preventDefault(); 
        if (!event.shiftKey) {
          setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredOptions.length);
        } else {
          setSelectedIndex((prevIndex) => (prevIndex - 1 + filteredOptions.length) % filteredOptions.length);
        }
      } else if (event.key === 'Escape' && showSuggestions) {
        event.preventDefault();
        setShowSuggestions(false);
      }
    };

    React.useEffect(() => {
      if (showSuggestions && selectedIndex !== -1) {
        const suggestionElement = document.getElementById(`suggestion_${selectedIndex}`);
        if (suggestionElement) {
          suggestionElement.scrollIntoView({ behavior: "auto", block: "nearest" });
        }
      }
    }, [showSuggestions, selectedIndex]);

    const handleInputBlur = () => {
      setTimeout(() => {
        setShowSuggestions(false);
      }, 100);
    };

    return (
      <div className='relative w-full'>
        <Input
          ref={ref}
          type={type}
          autoComplete={autoComplete}
          className={cn(className)}
          placeholder={placeholder}
          onChangeCapture={handleInputChange}
          onKeyDown={handleKeyPress}
          onBlurCapture={handleInputBlur}
          value={filteredOptions.length > 0 ? `${filteredOptions[0].firstName} ${filteredOptions[0].lastName}` : field.value}
          {...field}
        />
        {showSuggestions && filteredOptions.length > 0 && (
          <div className='max-h-[200px] overflow-y-scroll absolute top-full left-0 bg-popover border border-border w-full z-50 rounded-lg my-1 p-1'>
            {filteredOptions.map((option, index) => (
              <Button 
                key={index} 
                type='button'
                variant='ghost'
                className={cn('p-1 w-full justify-start gap-2 grid-cols-3 grid', {
                  'bg-accent': index === selectedIndex,
                })}
                onClick={() => handleSuggestionClick(option)}
              >
                <span className="px-3 py-1.5 rounded-md text-start bg-muted font-semibold text-sm text-muted-foreground">{`${option.code}`}</span>
                <span className="text-start col-span-2">{`${option.firstName} ${option.lastName}`}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
