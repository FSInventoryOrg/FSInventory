import { useFormContext } from 'react-hook-form';
import { Input } from '../ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import useUserData from '@/hooks/useUserData';
import { useEffect } from 'react';

const RequestorForm = () => {
  const { control, setValue } = useFormContext();
  const { data: user}  = useUserData();

  useEffect(() => {
    if (user) {
      setValue('fullName', user.firstName + ' ' + user.lastName)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  
  return (
    <div className="pb-4">
      {/* Common Fields Section */}
      <FormField
        control={control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="John Doe" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* autopopulate if logged in */}

      <FormField
        control={control}
        name="manager"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Manager</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="contactInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Information</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="johndoe@fullscale.ph or +63 912 345 6789"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RequestorForm;
