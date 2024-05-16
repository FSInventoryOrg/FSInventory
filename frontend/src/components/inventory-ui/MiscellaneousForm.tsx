import { Input } from '../ui/input';
import { useFormContext } from "react-hook-form";
import { AssetFormData } from '@/schemas/AddAssetSchema';
import {
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, LibraryBigIcon, XIcon } from 'lucide-react';
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Textarea } from '../ui/textarea';
import SuggestiveInput from './SuggestiveInput';
import { useState } from 'react';
import { EmployeeSuggestiveInput } from './DeployAsset';
import WarningAlert from '../WarningAlert';

const MiscellaneousForm = () => {
  const { control } = useFormContext<AssetFormData>();
  const [openDeploymentDate, setOpenDeploymentDate] = useState(false);
  const [openRecoveryDate, setOpenRecoveryDate] = useState(false);

  return (
    <div className='flex flex-col gap-2 w-full pb-4'>
      <div className="relative flex py-2 items-center">
        <span className="flex items-center gap-2 mr-2 text-lg font-semibold text-primary"><LibraryBigIcon size={20}/>Miscellaneous</span>
        <div className="flex-grow border-t border-border border-[1px]"></div>
      </div>
      <FormLabel className='text-md text-secondary-foreground'>Legal information</FormLabel>
      <FormField
        control={control}
        name="client"
        render={({ field }) => (
          <FormItem className='w-full sm:w-2/3 mt-2'>
            <FormControl>
              <SuggestiveInput property='client' placeholder="Client" autoComplete='off' type='input' field={field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='flex flex-col sm:flex-row gap-2 w-full'>
        <FormField
          control={control}
          name="pezaForm8105"
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <FormControl>
                <Input placeholder="PEZA Form 8105" autoComplete='off' type='input' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="pezaForm8106"
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <FormControl>
                <Input placeholder="PEZA Form 8106" autoComplete='off' type='input' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
          control={control}
          name="isRGE"
          render={({ field }) => (
            <FormItem className='w-full sm:w-2/3'>
              <Select
                onValueChange={(value) => field.onChange(value === 'true' ? true : false)} // Convert string value to boolean
                defaultValue={field.value ? field.value.toString() : ''} // Convert boolean value to string
              >                
                <FormControl>
                  <SelectTrigger className="w-full text-start">
                    <SelectValue placeholder="Is RGE?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="false">NO</SelectItem>
                  <SelectItem value="true">YES</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Default set to NO.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      <FormLabel className='text-md text-secondary-foreground'>Deployment details</FormLabel>
      <div className='mt-2 mb-4'>
        <WarningAlert warningMessage="
          We recommend using the DEPLOY and RETRIEVE functions to update the deployment information. Leave these fields empty unless absolutely necessary.
        " />
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full'>
        <FormField
          control={control}
          name="assignee"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <EmployeeSuggestiveInput property='assignee' placeholder="Assignee" autoComplete='off' type='input' field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="deploymentDate"
          render={({ field }) => (
            <div className="flex items-center justify-center gap-0">
              <FormItem className="flex flex-col w-full sm:w-fit">
                <Popover open={openDeploymentDate} onOpenChange={setOpenDeploymentDate}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full sm:w-[238px] pl-3 text-left font-normal rounded-r-none",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Deployment date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 h-[350px]" align="start">
                    <Calendar
                      mode="single"
                      onSelect={field.onChange}
                      onDayClick={() => {setOpenDeploymentDate(false)}}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
              <Button 
                className='rounded-l-none border-l-0 text-accent-foreground'
                type='button'
                variant='outline'
                size='icon'
                onClick={() => {
                  field.onChange(null)
                }}
              >
                <XIcon className='opacity-50' size={20} />
              </Button>
            </div>
          )}
        />
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full'>
        <FormField
          control={control}
          name="recoveredFrom"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <SuggestiveInput property='recoveredFrom' placeholder="Recovered from" autoComplete='off' type='input' field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="recoveryDate"
          render={({ field }) => (
            <div className="flex items-center justify-center gap-0">
              <FormItem className='flex flex-col w-full sm:w-fit'>
                <Popover open={openRecoveryDate} onOpenChange={setOpenRecoveryDate}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full sm:w-[238px] pl-3 text-left font-normal rounded-r-none",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Recovery date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 h-[350px]" align="start">
                    <Calendar
                      mode="single"
                      onSelect={field.onChange}
                      onDayClick={() => {setOpenRecoveryDate(false)}}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
              <Button 
                className='rounded-l-none border-l-0 text-accent-foreground'
                type='button'
                variant='outline'
                size='icon'
                onClick={() => {
                  field.onChange(null)
                }}
              >
                <XIcon className='opacity-50' size={20} />
              </Button>
            </div>
          )}
        />
      </div>
      <FormField
        control={control}
        name="remarks"
        render={({ field }) => (
          <FormItem className='w-full mt-2'>
            <FormLabel className='text-md text-secondary-foreground'>Remarks</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Add your remarks here." 
                autoComplete='off'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default MiscellaneousForm;