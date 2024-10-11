import { FormEventHandler, useState } from 'react';
import { Button } from '../ui/button';
import { Select, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { FileInput } from '../ui/file-input';
import { SelectContent, SelectGroup } from '@radix-ui/react-select';

const RequestForm = () => {
  const [requestType, setRequestType] = useState('');
  function handleSubmit(
    onSubmit: any
  ): FormEventHandler<HTMLFormElement> | undefined {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="container">
      <form className="space-y-6">
        {/* Request Type Selection */}
        <div className="form-group">
          <label className="block text-sm font-medium">Request Type</label>
          <Select onValueChange={setRequestType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Request Type" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="Report an Issue">Report an Issue</SelectItem>
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
          <label className="block text-sm font-medium">Full Name</label>
          <Input placeholder="John Doe" />
          {/* {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>} */}
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium">Manager</label>
          <Input placeholder="Manager" />
          {/* {errors.manager && <p className="text-red-500">{errors.manager.message}</p>} */}
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium">
            Contact Information
          </label>
          <Input placeholder="johndoe@fullscale.ph or +63 912 345 6789" />
          {/* {errors.contactInfo && <p className="text-red-500">{errors.contactInfo.message}</p>} */}
        </div>

        {/* Conditional Fields for 'Report an Issue' */}
        {requestType === 'Report an Issue' && (
          <>
            <div className="form-group">
              <label className="block text-sm font-medium">
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
                    <SelectItem value="Network Issue">Network Issue</SelectItem>
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
              <label className="block text-sm font-medium">
                Asset Affected
              </label>
              <Input placeholder="Enter serial number, device ID, or select from a list of company assets" />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium">
                Detailed Description of the Problem
              </label>
              <Textarea placeholder="Provide a detailed explanation of the issue, including any steps taken before the issue occurred" />
              {/* {errors.problemDescription && <p className="text-red-500">{errors.problemDescription.message}</p>} */}
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium">
                Upload Supporting Files
              </label>
              <FileInput
                accept="image/*,.pdf,.doc,.docx"
                onError={() => {}}
                onChange={() => {}}
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
                <option value="">Select Asset Type</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network Equipment">Network Equipment</option>
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
            </div>
          </>
        )}
        {/* Submission and Confirmation */}
        <div className="form-group">
          <Button type="submit">Submit Request</Button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
