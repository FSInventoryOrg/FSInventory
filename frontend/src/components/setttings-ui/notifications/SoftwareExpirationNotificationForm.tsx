import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as imsService from '@/ims-service';
import { useAppContext } from '@/hooks/useAppContext';
import DaysOptions from './DaysOptions';
import {
  NotificationSettingFormData,
  NotificationSettingSchema,
} from '@/schemas/NotificationSettingSchema';
import { NotificationSettingType } from '@/types/notification-setting';

interface SoftwareExpirationNotificationFormProps {
  defaultValues: NotificationSettingType;
}
const SoftwareExpirationNotificationForm = ({
  defaultValues,
}: SoftwareExpirationNotificationFormProps) => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const form = useForm<NotificationSettingFormData>({
    resolver: zodResolver(NotificationSettingSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { mutate: updateSoftwareNotif } = useMutation({
    mutationFn: imsService.updateSoftwareNotif,
    onSuccess: async () => {
      showToast({
        message: `Successfully updated software expiry notification!`,
        type: 'SUCCESS',
      });
      queryClient.invalidateQueries({
        queryKey: ['fetchSoftwareNotificationSettings'],
      });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' });
    },
  });

  const onSubmit = (data: NotificationSettingFormData) => {
    updateSoftwareNotif(data);
  };

  return (
    <div className="w-[60%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="daysBeforeLicenseExpiration"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DaysOptions
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      field.onBlur();
                      form.handleSubmit(onSubmit)();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default SoftwareExpirationNotificationForm;
