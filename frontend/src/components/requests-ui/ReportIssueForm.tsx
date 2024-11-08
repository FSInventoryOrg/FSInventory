import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { FileUploader } from "../ui/file-uploader";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import CustomFormLabel from "./CustomFormLabel";

const ReportIssueForm = () => {
  const reportIssueForm = useFormContext();

  const issueCategories = [
    {
      value: "hardware",
      label: "Hardware Issue",
      caption: "Laptop, Printer, Monitor, etc.",
    },
    {
      value: "software",
      label: "Software Issue",
      caption: "Microsoft Office, Internal App, etc.",
    },
    { value: "network", label: "Network Issue", caption: "Wi-Fi, VPN, etc." },
    {
      value: "emailOrComm",
      label: "Email or Communication Issue",
      caption: "Email, Cliq, etc.",
    },
    {
      value: "security",
      label: "Security Issue",
      caption: "Unauthorized access, etc.",
    },
  ];

  const allowedTypes =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/pdf";
  const allowedExtensions = ".pdf,.doc,.docx,.jpg,.jpeg,.png";

  const findIssueCategoryByValue = (value: string) =>
    issueCategories.find((issueCat) => issueCat.value === value);

  return (
    <div className="flex flex-col gap-3">
      <FormField
        control={reportIssueForm.control}
        name="issueCategory"
        render={({ field }) => (
          <FormItem className="sm:w-1/2 pr-2">
            <CustomFormLabel required>Issue Category</CustomFormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Issue Category">
                    {field.value
                      ? findIssueCategoryByValue(field.value)?.label
                      : "Select Issue Category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {issueCategories.map((issueCat) => (
                      <SelectItem key={issueCat.value} value={issueCat.value}>
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
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={reportIssueForm.control}
        name="assetAffected"
        render={({ field }) => (
          <FormItem className="sm:w-1/2 pr-2">
            <CustomFormLabel>Asset Affected</CustomFormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter serial number, device ID" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={reportIssueForm.control}
        name="problemDescription"
        render={({ field }) => (
          <FormItem>
            <CustomFormLabel required>Description of Issue</CustomFormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Enter description" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={reportIssueForm.control}
        name="supportingFiles"
        render={({ field }) => (
          <FormItem>
            <CustomFormLabel>Upload Supporting Files</CustomFormLabel>
            <FormControl>
              <FileUploader
                handleFiles={field.onChange}
                uploadedFiles={field.value}
                accept={allowedTypes + "," + allowedExtensions}
                wildcard="image/"
                maxFileSize={10 * 1024 * 1024}
                multiple
                uploadText="Click to Upload or Drag and Drop a File"
                borderStyle="border-[2px] border-dashed"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ReportIssueForm;
