import { cn } from '@/lib/utils';
import { AssetFormData } from '@/schemas/AddAssetSchema';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon, Calendar, XIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import {
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import SuggestiveInput from './SuggestiveInput';
import { Button } from '../ui/button';
import { useState } from 'react';

const ProductDetailsForm: React.FC = () => {
  const { control } = useFormContext<AssetFormData>();
  const [openPurchaseDate, setOpenPurchaseDate] = useState(false);
  return (
    <>
      <FormLabel className='text-md text-secondary-foreground'>
        Software details
      </FormLabel>
      <div className='flex flex-col sm:flex-row gap-2 w-full mt-2'>
        <FormField
          control={control}
          name='brand'
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <FormControl>
                <SuggestiveInput
                  property='brand'
                  placeholder='Brand'
                  autoComplete='off'
                  type='input'
                  field={field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='modelName'
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <FormControl>
                <Input
                  placeholder='Model name'
                  autoComplete='off'
                  type='input'
                  {...field}
                  tabIndex={0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full'>
        <FormField
          control={control}
          name='modelNo'
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <FormControl>
                <Input
                  placeholder='Model number'
                  autoComplete='off'
                  type='input'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='serialNo'
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <FormControl>
                <Input
                  placeholder='Serial number'
                  autoComplete='off'
                  type='input'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full'>
        <FormField
          control={control}
          name='supplierVendor'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <SuggestiveInput
                  property='supplierVendor'
                  placeholder='Supplier or vendor'
                  autoComplete='off'
                  type='input'
                  field={field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='purchaseDate'
          render={({ field }) => (
            <div className='flex items-center justify-center gap-0'>
              <FormItem className='flex flex-col w-full sm:w-fit'>
                <Popover
                  open={openPurchaseDate}
                  onOpenChange={setOpenPurchaseDate}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full sm:w-[238px] pl-3 text-left font-normal rounded-r-none',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Purchase date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      onSelect={field.onChange}
                      onDayClick={() => {
                        setOpenPurchaseDate(false);
                      }}
                      disabled={(date) => date < new Date('1900-01-01')}
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
                  field.onChange(null);
                }}
              >
                <XIcon className='opacity-50' size={20} />
              </Button>
            </div>
          )}
        />
      </div>
    </>
  );
};

export default ProductDetailsForm;
