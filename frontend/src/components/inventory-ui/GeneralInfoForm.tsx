import { useFormContext } from 'react-hook-form';
import { AssetFormData } from '@/schemas/AddAssetSchema';
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InfoIcon } from 'lucide-react';
import Options from './Options';
import ProductDetailsForm from './ProductDetailsForm';
import SoftwareDetailsForm from './SoftwareDetailsForm';

const GeneralInfoForm = () => {
  const { control, watch } = useFormContext<AssetFormData>();

  const isHardwareTab: boolean = watch('type') === 'Hardware';

  return (
    <div className='flex flex-col gap-2 w-full pb-4'>
      <div className='relative flex py-2 items-center'>
        <span className='flex items-center gap-2 mr-2 text-lg font-semibold text-primary'>
          <InfoIcon size={20} />
          General Information
        </span>
        <div className='flex-grow border-t border-border border-[1px]'></div>
      </div>
      <div className='flex gap-2 w-full'>
        <FormField
          control={control}
          name='category'
          render={({ field }) => (
            <FormItem className='w-full sm:w-2/3'>
              <FormLabel className='text-md text-secondary-foreground'>
                Category
              </FormLabel>
              <Options
                tagSelect={true}
                property='category'
                field={field}
                className='w-full'
                type={isHardwareTab ? 'Hardware' : 'Software'}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex gap-2 w-full'>
        <FormField
          control={control}
          name='status'
          render={({ field }) => (
            <FormItem className='w-full sm:w-2/3'>
              <FormLabel className='text-md text-secondary-foreground'>
                Status
              </FormLabel>
              <Options
                colorSelect={true}
                property='status'
                field={field}
                className='w-full'
              />
              <FormDescription>
                You can view the different status types here.{' '}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {isHardwareTab && (
        <div className='flex gap-2 w-full'>
          <FormField
            control={control}
            name='equipmentType'
            render={({ field }) => (
              <FormItem className='w-full sm:w-2/3'>
                <FormLabel className='text-md text-secondary-foreground'>
                  Equipment Type
                </FormLabel>
                <Options
                  property='equipmentType'
                  field={field}
                  className='w-full'
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      {isHardwareTab ? <ProductDetailsForm /> : <SoftwareDetailsForm />}
    </div>
  );
};

export default GeneralInfoForm;
