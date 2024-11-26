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
import {
  ReportIssueFormData,
  ReportIssueSchema,
} from "@/schemas/RequestFormSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RequestorForm from "./RequestorForm";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useEffect } from "react";

interface ReportIssueFormProps {
  userData: Record<string, string>;
  setUserData: Dispatch<SetStateAction<Record<string, string>>>;
  onSubmit: (data: ReportIssueFormData) => void;
  onChangeRequestType: (requestType: string) => void;
}
const ReportIssueForm = ({
  userData,
  setUserData,
  onSubmit,
  onChangeRequestType,
}: ReportIssueFormProps) => {
  const reportIssueForm = useForm<z.infer<typeof ReportIssueSchema>>({
    resolver: zodResolver(ReportIssueSchema),
    defaultValues: {
      fullName: userData?.fullName ?? "",
      manager: userData?.manager ?? "",
      contactInfo: userData?.contactInfo ?? "",
      issueCategory: "",
      problemDescription: "",
      requestType: "Report an Issue",
    },
    mode: "onChange",
  });

  useEffect(() => {
    reportIssueForm.reset({
      ...reportIssueForm,
      fullName: userData?.fullName ?? "",
      manager: userData?.manager ?? "",
      contactInfo: userData?.contactInfo ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

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
    <Form {...reportIssueForm}>
      <form
        key={1}
        onSubmit={reportIssueForm.handleSubmit(onSubmit)}
        className="w-full"
      >
        <RequestorForm />
        <FormField
          control={reportIssueForm.control}
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
                      reportIssueForm.getValues();
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
        <div className="flex flex-col ">
          <FormField
            control={reportIssueForm.control}
            name="issueCategory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">Issue Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Issue Category">
                        {field.value
                          ? findIssueCategoryByValue(field.value)?.label
                          : "Select Issue Category"}
                      </SelectValue>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={reportIssueForm.control}
            name="assetAffected"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="">Asset Affected</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter serial number, device ID, or select from a list of company assets"
                  />
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
                <FormLabel>Detailed Description of the Problem</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Provide a detailed explanation of the issue, including any steps taken before the issue occurred"
                  />
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
                <FormLabel>Upload Supporting Files</FormLabel>
                <FormControl>
                  <FileUploader
                    handleFile={field.onChange}
                    uploadedFile={field.value}
                    accept={allowedTypes + "," + allowedExtensions}
                    wildcard="image/"
                    maxFileSize={10 * 1024 * 1024}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button className="my-2" type="submit">
          Submit Request
        </Button>
      </form>
    </Form>
  );
};

export default ReportIssueForm;
