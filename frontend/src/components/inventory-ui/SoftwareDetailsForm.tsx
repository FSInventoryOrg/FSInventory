import { cn } from '@/lib/utils';
import {  AssetFormData } from '@/schemas/AddAssetSchema';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, XIcon } from 'lucide-react';
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
import Options from './Options';
import { Box } from '../ui/box';

const SoftwareDetailsForm: React.FC = () => {
  const { control } = useFormContext<AssetFormData>();
  const [openPurchaseDate, setOpenPurchaseDate] = useState(false);
  const [openExpirationDate, setOpenExpirationDate] = useState(false);

  return (
    <>
      <FormLabel className='text-md text-secondary-foreground'>
        Software details
      </FormLabel>
      <div className='flex flex-col sm:flex-row gap-2 w-full mt-2'>
        <FormField
          control={control}
          name='softwareName'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input
                  placeholder='Software name'
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
          <FormField
            control={control}
            name='licenseExpirationDate'
            render={({ field }) => (
              <div className='flex items-center justify-center gap-0'>
                <FormItem className='flex flex-col w-full sm:w-fit'>
                  <FormControl>
                    <Box className='flex'>
                      <Popover
                        open={openExpirationDate}
                        onOpenChange={setOpenExpirationDate}
                      >
                        <PopoverTrigger asChild>
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
                              <span>License expiration date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={field.onChange}
                            onDayClick={() => {
                              setOpenExpirationDate(false);
                            }}
                            disabled={(date) => date < new Date('1900-01-01')}
                          />
                        </PopoverContent>
                      </Popover>
                      <Button
                        className=' flex rounded-l-none border-l-0 text-accent-foreground'
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => {
                          field.onChange(null);
                        }}
                      >
                        <XIcon className='opacity-50' size={20} />
                      </Button>
                    </Box>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full'>
        <FormField
          control={control}
          name='licenseType'
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <Options
                property='licenseType'
                field={field}
                className='w-full'
                placeholder='License type'
                />
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
                  placeholder='License key/Serial number'
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
          name='vendor'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <SuggestiveInput
                  property='vendor'
                  placeholder='Vendor'
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
                  <FormControl>
                    <Box className='flex'>
                      <Popover
                        open={openPurchaseDate}
                        onOpenChange={setOpenPurchaseDate}
                      >
                        <PopoverTrigger asChild>
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
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={field.onChange}
                            onDayClick={() => {
                              setOpenPurchaseDate(false);
                            }}
                            disabled={(date) => date < new Date('1900-01-01')}
                          />
                        </PopoverContent>
                      </Popover>
                      <Button
                        className=' flex rounded-l-none border-l-0 text-accent-foreground'
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => {
                          field.onChange(null);
                        }}
                      >
                        <XIcon className='opacity-50' size={20} />
                      </Button>
                    </Box>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          <FormField
          control={control}
          name='licenseCost'
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <FormControl>
                <Box className='relative'>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <span>₱</span>
                </div>
                <Input
                  className='pl-6'
                  placeholder='License cost'
                  autoComplete='off'
                  type='input'
                  {...field}
                />
           
                </Box>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full mt-2'>
        <FormField
          control={control}
          name='installationPath'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input
                  placeholder='Installation path'
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
         <FormField
          control={control}
          name='noOfLicense'
          render={({ field }) => (
            <FormItem className='w-full sm:w-1/2'>
              <FormControl>
                <Input
                  disabled
                  placeholder='Number of License'
                  autoComplete='off'
                  type='number'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
    </>
  );
};

export default SoftwareDetailsForm;
