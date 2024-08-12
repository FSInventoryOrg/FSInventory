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
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, InfoIcon, XIcon } from 'lucide-react';
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import SuggestiveInput from './SuggestiveInput';
import Options from './Options';
import { useState } from 'react';

const GeneralInfoForm = () => {
  const { control } = useFormContext<AssetFormData>();
  const [openPurchaseDate, setOpenPurchaseDate] = useState(false);

  return (
    <div className='flex flex-col gap-2 w-full pb-4'>
      <div className="relative flex py-2 items-center">
        <span className="flex items-center gap-2 mr-2 text-lg font-semibold text-primary"><InfoIcon size={20}/>General Information</span>
        <div className="flex-grow border-t border-border border-[1px]"></div>
      </div>
      <div className='flex gap-2 w-full'>
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem className='w-full sm:w-2/3'>
              <FormLabel className='text-md text-secondary-foreground'>Category</FormLabel>
              <Options tagSelect={true} property='category' field={field} className='w-full' />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex gap-2 w-full'>
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem className='w-full sm:w-2/3'>
              <FormLabel className='text-md text-secondary-foreground'>Status</FormLabel>
              <Options colorSelect={true} property='status' field={field} className='w-full' />
              <FormDescription>
                You can view the different status types here.{" "}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex gap-2 w-full'>
        <FormField
          control={control}
          name="equipmentType"
          render={({ field }) => (
            <FormItem className='w-full sm:w-2/3'>
              <FormLabel className='text-md text-secondary-foreground'>Equipment Type</FormLabel>
              <Options property='equipmentType' field={field} className='w-full' />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormLabel className='text-md text-secondary-foreground'>Product details</FormLabel>
      <div className='flex flex-col sm:flex-row gap-2 w-full mt-2'>
        <FormField
          control={control}
          name="brand"
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <FormControl>
                <SuggestiveInput property='brand' placeholder='Brand' autoComplete='off' type='input' field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="modelName"
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <FormControl>
                <Input placeholder="Model name" autoComplete='off' type='input' {...field} tabIndex={0} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full'>
        <FormField
          control={control}
          name="modelNo"
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <FormControl>
                <Input placeholder="Model number" autoComplete='off' type='input' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="serialNo"
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <FormControl>
                <Input placeholder="Serial number" autoComplete='off' type='input' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full'>
        <FormField
          control={control}
          name="supplierVendor"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <SuggestiveInput property='supplierVendor' placeholder="Supplier or vendor" autoComplete='off' type='input' field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="purchaseDate"
          render={({ field }) => (
            <div className="flex items-center justify-center gap-0">
              <FormItem className="flex flex-col w-full sm:w-fit">
                <Popover open={openPurchaseDate} onOpenChange={setOpenPurchaseDate}>
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
                          <span>Purchase date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 h-[350px]" align="start">
                    <Calendar
                      mode="single"
                      onSelect={field.onChange}
                      onDayClick={() => {setOpenPurchaseDate(false)}}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
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
    </div>
  )
}

export default GeneralInfoForm;