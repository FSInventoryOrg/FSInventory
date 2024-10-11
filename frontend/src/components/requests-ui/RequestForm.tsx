import { FormEventHandler, useState } from 'react';
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
import { FileUploader } from '../ui/file-uploader';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useAppContext } from '@/hooks/useAppContext';
import * as imsService from '@/ims-service';
import {
  ReportIssueSchema,
  RequestNewAssetSchema,
} from '@/schemas/RequestFormSchema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RequestorForm from './RequestorForm';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const RequestForm = () => {
  const { showToast } = useAppContext();
  const [requestType, setRequestType] = useState('Report an Issue');
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  const [openRequestedDate, setOpenRequestedDate] = useState(false);
  const [requestedDate, setRequestedDate] = useState<Date | undefined>();

  function handleSubmit(
    onSubmit: any
  ): FormEventHandler<HTMLFormElement> | undefined {
    throw new Error('Function not implemented.');
  }

  const { mutate } = useMutation({
    mutationFn: imsService.submitRequestForm,
    onSuccess: async () => {
      showToast({
        message:
          'Thank you for your request! Your request has been submitted, and you will receive a confirmation email with a tracking number shortly.',
        type: 'SUCCESS',
      });
    },
  });

  const reportIssueForm = useForm<z.infer<typeof ReportIssueSchema>>({
    resolver: zodResolver(ReportIssueSchema),
    defaultValues: {},
    mode: 'onChange',
  });

  const requestAssetForm = useForm<z.infer<typeof RequestNewAssetSchema>>({
    resolver: zodResolver(RequestNewAssetSchema),
    defaultValues: {},
    mode: 'onChange',
  });

  const handleFile = (file: File | undefined) => {
    setUploadedFile(file);
  };

  const issueCategories = [
    {
      value: 'hardware',
      label: 'Hardware Issue',
      caption: 'Laptop, Printer, Monitor, etc.',
    },
    {
      value: 'software',
      label: 'Software Issue',
      caption: 'Microsoft Office, Internal App, etc.',
    },
    { value: 'network', label: 'Network Issue', caption: 'Wi-Fi, VPN, etc.' },
    {
      value: 'emailOrComm',
      label: 'Email or Communication Issue',
      caption: 'Email, Cliq, etc.',
    },
    {
      value: 'security',
      label: 'Security Issue',
      caption: 'Unauthorized access, etc.',
    },
  ];
  return (
    <div className="container mb-20">
      <div className="flex w-7/12  mx-auto">
        <div className="space-y-6 w-full ">
          <RequestorForm />
          <div className="form-group">
            <label className="block text-sm font-medium pb-2">
              Request Type
            </label>
            <Select onValueChange={setRequestType}>
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
            {/* {errors.requestType && <p className="text-red-500">{errors.requestType.message}</p>} */}
          </div>
          {/* Conditional Fields for 'Report an Issue' */}
          {requestType === 'Report an Issue' && (
            <Form {...reportIssueForm}>
              <form
                key={1}
                onSubmit={(e) => {
                  e.preventDefault();
                  mutate();
                }}
              >
                <div className="flex flex-col gap-3">
                  <FormField
                    control={reportIssueForm.control}
                    name="issueCategory"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="flex gap-2">
                          Issue Category
                        </FormLabel>
                        <FormControl>
                          <Select>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Issue Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {issueCategories.map((issueCat) => (
                                  <SelectItem
                                    key={issueCat.value}
                                    value={issueCat.value}
                                  >
                                    <div className="flex flex-col">
                                      <span>{issueCat.label}</span>
                                      <span className="text-sm text-gray-500">
                                        {issueCat.caption}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={reportIssueForm.control}
                    name="assetAffected"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="flex gap-2">
                          Asset Affected
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter serial number, device ID, or select from a list of company assets"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={reportIssueForm.control}
                    name="problemDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Detailed Description of the Problem
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Provide a detailed explanation of the issue, including any steps taken before the issue occurred"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={reportIssueForm.control}
                    name="supportingFiles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Supporting Files</FormLabel>
                        <FormControl>
                          <FileUploader
                            handleFile={handleFile}
                            uploadedFile={uploadedFile}
                            accept="image/*,.pdf,.doc,.docx"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          )}

          {/* Conditional Fields for 'Request a New Asset' */}
          {requestType === 'Request a New Asset' && (
            <Form {...requestAssetForm}>
              <form
                key={2}
                onSubmit={(e) => {
                  e.preventDefault();
                  mutate();
                }}
              >
                <FormField
                  control={requestAssetForm.control}
                  name="assetType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Type</FormLabel>

                      <FormControl>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Asset Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Hardware Issue">
                                Hardware
                              </SelectItem>
                              <SelectItem value="Software Issue">
                                Software
                              </SelectItem>
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
                        <Input placeholder="Specify the model or type of asset you're requesting (e.g., Dell Latitude 7420, Adobe Creative Cloud)" />
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
                        <Textarea placeholder="Provide a justification for why you need this asset (e.g., new project requirement, additional equipment)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={requestAssetForm.control}
                  name="requestDate"
                  render={({ field }) => (
                    <FormItem>
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
                                !requestedDate && 'text-muted-foreground'
                              )}
                            >
                              {requestedDate ? (
                                format(requestedDate, 'PPP')
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
                              onSelect={setRequestedDate}
                              onDayClick={() => setOpenRequestedDate(false)}
                              disabled={(date) => date < new Date('1900-01-01')}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
          {/* Submission and Confirmation */}
          <div className="form-group">
            <Button type="submit">Submit Request</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
