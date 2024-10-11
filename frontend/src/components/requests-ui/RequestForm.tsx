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
import * as imsService from "@/ims-service";
import { ReportIssueSchema, RequestNewAssetSchema } from '@/schemas/RequestFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";

const RequestForm = () => {
    const { showToast } = useAppContext();
  const [requestType, setRequestType] = useState('');
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
      showToast({ message: "Thank you for your request! Your request has been submitted, and you will receive a confirmation email with a tracking number shortly.", type: "SUCCESS" });
    },
  });

  const reportIssueForm = useForm<z.infer<typeof ReportIssueSchema>>({
    resolver: zodResolver(ReportIssueSchema),
    defaultValues: {

    }
  })

  const requestAssetForm = useForm<z.infer<typeof RequestNewAssetSchema>>({
    resolver: zodResolver(RequestNewAssetSchema),
    defaultValues: {

    }
  })

  const handleFile = (file: File | undefined) => {
    setUploadedFile(file);
  };

  return (
    <div className="container mb-20">
      <div className="flex w-7/12  mx-auto">
        <form onSubmit={(e)=> {e.preventDefault();mutate()}} className="space-y-6 w-full ">
          {/* Request Type Selection */}
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

          {/* Common Fields Section */}
          <div className="form-group">
            {/* autopopulate if logged in */}
            <label className="block text-sm font-medium pb-2">Full Name</label>
            <Input placeholder="John Doe" />
            {/* {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>} */}
          </div>

          <div className="form-group">
            {/* autopopulate if logged in */}
            <label className="block text-sm font-medium pb-2">Manager</label>
            <Input />
            {/* {errors.manager && <p className="text-red-500">{errors.manager.message}</p>} */}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium pb-2">
              Contact Information
            </label>
            <Input placeholder="johndoe@fullscale.ph or +63 912 345 6789" />
            {/* {errors.contactInfo && <p className="text-red-500">{errors.contactInfo.message}</p>} */}
          </div>

          {/* Conditional Fields for 'Report an Issue' */}
          {requestType === 'Report an Issue' && (
            <>
              <div className="form-group">
                <label className="block text-sm font-medium pb-2">
                  Issue Category
                </label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Issue Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Hardware Issue">
                        Hardware Issue
                      </SelectItem>
                      <SelectItem value="Software Issue">
                        Software Issue
                      </SelectItem>
                      <SelectItem value="Network Issue">
                        Network Issue
                      </SelectItem>
                      <SelectItem value="Email or Communication Issues">
                        Email or Communication Issues
                      </SelectItem>
                      <SelectItem value="Security Issues">
                        Security Issues
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {/* {errors.issueCategory && <p className="text-red-500">{errors.issueCategory.message}</p>} */}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium pb-2">
                  Asset Affected
                </label>
                <Input placeholder="Enter serial number, device ID, or select from a list of company assets" />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium pb-2">
                  Detailed Description of the Problem
                </label>
                <Textarea placeholder="Provide a detailed explanation of the issue, including any steps taken before the issue occurred" />
                {/* {errors.problemDescription && <p className="text-red-500">{errors.problemDescription.message}</p>} */}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium pb-2">
                  Upload Supporting Files
                </label>
                <FileUploader
                  handleFile={handleFile}
                  uploadedFile={uploadedFile}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>
            </>
          )}

          {/* Conditional Fields for 'Request a New Asset' */}
          {requestType === 'Request a New Asset' && (
            <>
              <div className="form-group">
                <label className="block text-sm font-medium">Asset Type</label>
                <Select>
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
                {/* {errors.assetType && <p className="text-red-500">{errors.assetType.message}</p>} */}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium">
                  Asset Specifications or Model
                </label>
                <Input placeholder="Specify the model or type of asset you're requesting (e.g., Dell Latitude 7420, Adobe Creative Cloud)" />
                {/* {errors.assetSpecification && <p className="text-red-500">{errors.assetSpecification.message}</p>} */}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium">
                  Justification for Request
                </label>
                <Textarea placeholder="Provide a justification for why you need this asset (e.g., new project requirement, additional equipment)" />
                {/* {errors.requestJustification && <p className="text-red-500">{errors.requestJustification.message}</p>} */}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium">
                  Requested Date for Asset
                </label>
                {/* <Controller
                  control={control}
                  name="requestDate"
                  render={({ field }) => (
                    <Datepicker {...field} placeholder="Specify a date by which you need the asset, if applicable" />
                  )}
                /> */}
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
              </div>
            </>
          )}
          {/* Submission and Confirmation */}
          <div className="form-group">
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
