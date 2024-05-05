import { useFormContext } from "react-hook-form";
import { AssetFormData } from '@/schemas/AddAssetSchema';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { SettingsIcon } from 'lucide-react';
import SuggestiveInput from './SuggestiveInput';

const SystemSpecsForm = () => {
  const { control } = useFormContext<AssetFormData>();
  return (
    <div className='flex flex-col gap-2 w-full pb-4'>
      <div className="relative flex py-2 items-center">
      <span className="flex items-center gap-2 mr-2 text-lg font-semibold text-primary"><SettingsIcon size={20}/>System Specification</span>
        <div className="flex-grow border-t border-border border-[1px]"></div>
      </div>
      <div className='flex flex-col gap-2 w-full mt-2'>
        <FormField
          control={control}
          name="processor"
          render={({ field }) => (
            <FormItem className='w-2/3'>
              <FormLabel className='text-secondary-foreground'>Processor</FormLabel>
              <FormControl>
                <SuggestiveInput 
                  property='processor' 
                  placeholder="Intel i7-8700k, AMD Ryzen 5 2600, Apple Silicon M1, etc." 
                  autoComplete='off'
                  field={field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="memory"
          render={({ field }) => (
            <FormItem className='w-2/3'>
              <FormLabel className='text-secondary-foreground'>Memory</FormLabel>
              <FormControl>
                <SuggestiveInput 
                  property='memory' 
                  placeholder="4GB, 8GB, 16GB, 32GB, etc."
                  autoComplete='off'
                  field={field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="storage"
          render={({ field }) => (
            <FormItem className='w-2/3'>
              <FormLabel className='text-secondary-foreground'>Storage (HDD/SSD)</FormLabel>
              <FormControl>
                <SuggestiveInput 
                  property='storage' 
                  placeholder="128GB, 256GB, 512GB, 1TB, etc."
                  autoComplete='off'
                  field={field}
                />            
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default SystemSpecsForm;