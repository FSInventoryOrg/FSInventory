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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import CustomFormLabel from "./CustomFormLabel";
import { Accept } from "react-dropzone";

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

  const accept: Accept = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/msword": [".doc"],
    "image/*": [".jpg", ".jpeg", ".png"],
  };

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
                  <SelectValue
                    placeholder={
                      <span className="font-normal text-muted-foreground">
                        Select a category
                      </span>
                    }
                  >
                    {field.value
                      ? findIssueCategoryByValue(field.value)?.label
                      : "Select a category"}
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
        name="issueDescription"
        render={({ field }) => (
          <FormItem>
            <CustomFormLabel required>Description of Issue</CustomFormLabel>
            <FormDescription>
              Provide a detailed explanation of the issue, including any steps
              taken before the issue occured.
            </FormDescription>
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
            <FormDescription>Max. file size: 10 MB.</FormDescription>
            <FormControl>
              <FileUploader
                handleFiles={field.onChange}
                uploadedFiles={field.value}
                accept={accept}
                wildcard="image/"
                maxFileSize={10 * 1024 * 1024}
                multiple
                maxFiles={5}
                uploadText="Click to Upload or Drag and Drop a File"
                borderStyle="border-[2px] border-dashed text-accent-foreground"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ReportIssueForm;
