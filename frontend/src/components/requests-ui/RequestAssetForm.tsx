import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import RequestorForm from './RequestorForm';
import {
  RequestAssetFormData,
  RequestNewAssetSchema,
} from '@/schemas/RequestFormSchema';

interface RequestAssetFormProps {
  userData: Record<string, string>;
  setUserData: Dispatch<SetStateAction<Record<string, string>>>;
  onSubmit: (data: RequestAssetFormData) => void;
  onChangeRequestType: (requestType: string) => void;
}
const RequestAssetForm = ({
  userData,
  setUserData,
  onSubmit,
  onChangeRequestType,
}: RequestAssetFormProps) => {
  const [openRequestedDate, setOpenRequestedDate] = useState(false);

  const requestAssetForm = useForm<z.infer<typeof RequestNewAssetSchema>>({
    resolver: zodResolver(RequestNewAssetSchema),
    defaultValues: {
      fullName: userData?.fullName ?? '',
      manager: userData?.manager ?? '',
      contactInfo: userData?.contactInfo ?? '',
      requestType: 'Request a New Asset',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    requestAssetForm.reset({
      ...requestAssetForm,
      fullName: userData?.fullName ?? '',
      manager: userData?.manager ?? '',
      contactInfo: userData?.contactInfo ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <Form {...requestAssetForm}>
      <form
        key={2}
        onSubmit={requestAssetForm.handleSubmit(onSubmit)}
        className="w-full"
      >
        <RequestorForm />
        <FormField
          control={requestAssetForm.control}
          name="requestType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Type</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    const { fullName, manager, contactInfo } =
                      requestAssetForm.getValues();
                    setUserData({ fullName, manager, contactInfo });
                    onChangeRequestType(value);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Request Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Report an Issue">
                        Report an Issue
                      </SelectItem>
                      <SelectItem value="Request a New Asset">
                        Request a New Asset
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={requestAssetForm.control}
          name="assetType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Asset Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Hardware Issue">Hardware</SelectItem>
                      <SelectItem value="Software Issue">Software</SelectItem>
                      <SelectItem value="Network Issue">
                        Network Equipment
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={requestAssetForm.control}
          name="assetSpecification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Specifications or Model</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  placeholder="Specify the model or type of asset you're requesting (e.g., Dell Latitude 7420, Adobe Creative Cloud)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={requestAssetForm.control}
          name="requestJustification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Justification for Request</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Provide a justification for why you need this asset (e.g., new project requirement, additional equipment)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={requestAssetForm.control}
          name="requestDate"
          render={({ field }) => (
            <FormItem className="w-full sm:w-fit">
              <FormLabel>Requested Date for Asset</FormLabel>
              <FormControl>
                <Popover
                  open={openRequestedDate}
                  onOpenChange={setOpenRequestedDate}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>
                          Specify a date by which you need the asset, if
                          applicable.
                        </span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      onDayClick={() => setOpenRequestedDate(false)}
                      disabled={(date) => date < new Date('1900-01-01')}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="my-2" type="submit">
          Submit Request
        </Button>
      </form>
    </Form>
  );
};

export default RequestAssetForm;
