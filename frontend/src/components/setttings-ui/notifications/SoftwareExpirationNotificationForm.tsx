import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import * as z from 'zod';
import * as imsService from '@/ims-service';
import { useAppContext } from '@/hooks/useAppContext';

interface DaysOptionProps {
  id: string;
  value: string;
  children?: React.ReactNode;
}

const DaysOption: React.FC<DaysOptionProps> = ({ id, value, children }) => {
  return (
    <div className="h-fit bg-muted p-3 sm:p-6 rounded-lg drop-shadow ">
      <div className="flex flex-row gap-3">
        <RadioGroupItem value={value} id={id} />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const schema = z.object({
  days: z.coerce.number().min(5).max(365),
});

type FormData = z.infer<typeof schema>;
const SoftwareExpirationNotificationForm = () => {
  const { showToast } = useAppContext();
  const [days, setDays] = useState('');
  const [customDays, setCustomDays] = useState('');
  const [customDaysError, setCustomDaysError] = useState('');
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      days: '5',
    },
  });

  const { mutate: updateSoftwareNotif } = useMutation({
    mutationFn: imsService.updateSoftwareNotif,
    onSuccess: async (data) => {
      showToast({
        message: `Successfully updated software notification days ${data}`,
        type: 'SUCCESS',
      });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' });
    },
  });
  const onSubmit = (data) => {
    updateSoftwareNotif(data);
  };

  const handleInputChange = (val: string, field: ControllerRenderProps) => {
    if (val === 'custom') {
      updateSoftwareNotif(days);
    } else {
      updateSoftwareNotif(val);
    }
    field.onChange(val);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value?.trim();
    setCustomDays(value);

    const customDays = +value;

    if (!customDays) {
      setCustomDaysError('Required');
    } else if (customDays < 1 || customDays >= 365) {
      setCustomDaysError('Custom days must be within the range 1-364');
    } else {
      setCustomDaysError('');
      setDays(customDays.toString());
    }
  };
  return (
    <div className="w-[60%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="days"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={(val) => {
                      handleInputChange(val, field);
                    }}
                  >
                    <div className="grid grid-cols-3 gap-6">
                      <DaysOption value="5" id="r-1">
                        <h2 className="font-medium text-muted-foreground text-sm">
                          Default
                        </h2>
                        <h1 className="text-md font-bold text-primary-foreground whitespace-nowrap inline-block text-ellipsis">
                          5 days
                        </h1>
                      </DaysOption>
                      {/* <DaysOption value={days} id="r-2"> */}
                      <DaysOption value="custom" id="r-2">
                        <h2 className="font-medium text-muted-foreground text-sm">
                          Custom
                        </h2>
                        <Input
                          placeholder="0"
                          value={customDays}
                          onChange={handleCustomInputChange}
                        />
                        {customDaysError && (
                          <span className="text-xs text-destructive">
                            {customDaysError}
                          </span>
                        )}
                        <p className="my-2 text-xs text-muted-foreground font-light">
                          Min 1 day, Max 364 days
                        </p>
                      </DaysOption>
                      <DaysOption value="365" id="r-2">
                        <h2 className="font-medium text-muted-foreground text-sm">
                          Maximum
                        </h2>
                        <h1 className="text-md font-bold text-primary-foreground whitespace-nowrap inline-block text-ellipsis">
                          1 year
                        </h1>
                      </DaysOption>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default SoftwareExpirationNotificationForm;
