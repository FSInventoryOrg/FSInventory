import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { AutomatedReportSettingsSchema } from '@/schemas/AutomatedReportSettingsSchema';
import { AutoMailType } from '@/types/automail';
import * as imsService from '@/ims-service';
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
import { useAppContext } from '@/hooks/useAppContext';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import Recipients from './Recipients';
import { WEEKDAYS } from '@/lib/data';

const AutomatedReportForm = ({
  defaultValues,
}: {
  defaultValues: AutoMailType;
}) => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const [recipients, setRecipients] = useState<string[]>(
    defaultValues.recipient
  );
  const form = useForm<z.infer<typeof AutomatedReportSettingsSchema>>({
    resolver: zodResolver(AutomatedReportSettingsSchema),
    defaultValues: {
      contact: defaultValues.contact,
      recipient: defaultValues.recipient,
      frequency: defaultValues.frequency,
      day: defaultValues.day,
      weekday: defaultValues.weekday,
      time: defaultValues.time,
    },
  });
  const frequency = form.watch('frequency');

  const { mutate: saveSettings, isPending: isSavePending } = useMutation({
    mutationFn: imsService.postAutoMailSettings,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['autoMailSettings'] });
      showToast({
        message: 'Automated report settings saved!',
        type: 'SUCCESS',
      });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' });
    },
  });

  const { mutate: sendNow, isPending: isSendPending } = useMutation({
    mutationFn: imsService.sendAutoMailNow,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['autoMailSettings'] });
      showToast({ message: 'Email report sent!', type: 'SUCCESS' });
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

    if (settingsData.frequency === 'Daily') {
      settingsData.day = undefined;
      settingsData.weekday = undefined;
    } else if (settingsData.frequency === 'Weekly') {
      settingsData.day = undefined;
    } else if (settingsData.frequency === 'Bi-Weekly') {
      settingsData.day = undefined;
    } else if (settingsData.frequency === 'Monthly') {
      settingsData.weekday = undefined;
    }

    saveSettings(settingsData);
  };
  const handleSendNow = () => {
    sendNow();
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="w-full flex flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem className="pb-4">
                <FormLabel>Contact person</FormLabel>
                <FormControl className="md:w-2/3">
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormDescription>
                  The email to contact for queries regarding the generated
                  automated email reports.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem className="pb-4">
            <FormLabel>Recipients</FormLabel>
            <Recipients
              className="md:w-2/3"
              recipients={recipients}
              setRecipients={setRecipients}
            />
            <FormDescription>
              The emails to send automated reports to.
            </FormDescription>
          </FormItem>
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem className="pb-4">
                <FormLabel>Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="md:w-2/3">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* <SelectItem value="Daily">Daily</SelectItem> */}
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The frequency or how often to send the automated email
                  reports.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {frequency === 'Monthly' && (
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>Day of the month</FormLabel>
                  <FormControl className="md:w-2/3">
                    <Input
                      type="number"
                      placeholder="Day of the month"
                      max={31}
                      min={1}
                      step={1}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Day of the month to send reports.
                  </FormDescription>
                </FormItem>
              )}
            />
          )}
          {(frequency === 'Bi-Weekly' || frequency === 'Weekly') && (
            <FormField
              control={form.control}
              name="weekday"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>Day of the week</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl className="md:w-2/3">
                      <SelectTrigger>
                        <SelectValue placeholder="Select day of the week" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WEEKDAYS.map((day) => (
                        <SelectItem
                          key={day.value}
                          value={day.value?.toString()}
                        >
                          {day.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Day of the week to send reports.
                  </FormDescription>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem className="pb-4">
                <FormLabel>Time</FormLabel>
                <FormControl className="md:w-2/3">
                  <Input
                    type="time"
                    placeholder="Time"
                    {...field}
                    className="block w-full px-3 py-2"
                  />
                </FormControl>
                <FormDescription>Time to send reports.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="italic text-xs text-primary">
            {defaultValues?.lastRollOut &&
              `Last report was sent on ${defaultValues.lastRollOut.toLocaleString()}, `}
            {defaultValues?.nextRoll &&
              `Next report will be sent on ${defaultValues.nextRoll.toLocaleString()}`}
          </p>
          <Separator className="my-4" />
          <div className="flex flex-row justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSendNow}
              disabled={isSendPending}
            >
              <Send className="mr-2 h-4 w-4" size={18} />
              {isSendPending ? 'Sending...' : 'Send Now'}
            </Button>
            <Button
              type="submit"
              disabled={isSavePending}
              className="w-[125px]"
            >
              {isSavePending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" size={18} /> Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AutomatedReportForm;
