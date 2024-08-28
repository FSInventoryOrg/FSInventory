import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AutomatedReportSettingsSchema } from '@/schemas/AutomatedReportSettingsSchema';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/Spinner';
import { AutoMailType } from '@/types/automail';
import Recipients from './Recipients';
import * as imsService from '@/ims-service';
import { useAppContext } from '@/hooks/useAppContext';

const AutomatedReportForm = ({
  defaultValues,
}: {
  defaultValues: AutoMailType;
}) => {
  const { showToast } = useAppContext();
  const [recipients, setRecipients] = useState<string[]>(
    defaultValues?.recipient || []
  );
  const form = useForm<z.infer<typeof AutomatedReportSettingsSchema>>({
    resolver: zodResolver(AutomatedReportSettingsSchema),
    defaultValues: {
      contact: defaultValues?.contact,
      recipient: defaultValues?.recipient,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: imsService.postAutoMailSettings,
    onSuccess: async () => {
      showToast({
        message: 'Automated report settings saved!',
        type: 'SUCCESS',
      });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' });
    },
  });

  const onSubmit = (data: z.infer<typeof AutomatedReportSettingsSchema>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const settingsData: any = {
      ...data,
      recipient: recipients,
    };
    mutate(settingsData);
  };
  return (
    <div>
      <Form {...form}>
        <form
          className='w-full flex flex-col'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='contact'
            render={({ field }) => (
              <FormItem className='pb-2'>
                <FormLabel>Contact Person</FormLabel>
                <FormControl className='md:w-2/3'>
                  <Input type='email' placeholder='Email' {...field} />
                </FormControl>
                <FormDescription>
                  The email to contact for queries regarding the generated
                  automated email reports.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem className='pb-2'>
            <FormLabel>Recipients</FormLabel>
            <Recipients
              className='md:w-2/3'
              recipients={recipients}
              setRecipients={setRecipients}
            />
            <FormDescription>
              The emails to send automated reports to.
            </FormDescription>
          </FormItem>
          <Separator className='my-4' />
          <Button
            type='submit'
            className='gap-2 w-fit md:w-1/6 self-end'
            disabled={isPending}
          >
            {isPending ? <Spinner size={18} /> : null}
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AutomatedReportForm;
