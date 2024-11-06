import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAppContext } from "@/hooks/useAppContext";
import * as imsService from "@/ims-service";
import RequestAssetForm from "./RequestAssetForm";
import ReportIssueForm from "./ReportIssueForm";
import useUserData from "@/hooks/useUserData";
import {
  ReportIssueFormData,
  RequestAssetFormData,
  RequestFormData,
  RequestFormSchema,
} from "@/schemas/RequestFormSchema";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RequestorForm from "./RequestorForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const RequestForm = () => {
  const [open, setOpen] = useState(false);

  const { showToast } = useAppContext();
  const { data: user } = useUserData();
  const [requestType, setRequestType] = useState("Report an Issue");

  const requestForm = useForm<RequestFormData>({
    resolver: zodResolver(RequestFormSchema),
    defaultValues: {
      // fullName: user?.fullName ?? "",
      // manager: user?.manager ?? "",
      // contactInfo: user?.contactInfo ?? "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      requestForm.reset({
        ...requestForm,
        fullName: user.firstName + " " + user.lastName,
        manager: "",
        contactInfo: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onSubmit = (data: RequestAssetFormData | ReportIssueFormData) => {
    mutate(data);
  };

  const { mutate } = useMutation({
    mutationFn: imsService.submitRequestForm,
    onSuccess: async () => {
      showToast({
        message:
          "Thank you for your request! Your request has been submitted, and you will receive a confirmation email with a tracking number shortly.",
        type: "SUCCESS",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary">Create a Ticket</Button>
      </DialogTrigger>
      <DialogContent
        tabIndex={-1}
        className="overflow-y-auto  sm:max-w-[800px] bg-card h-full p-3 sm:p-6 rounded-lg"
      >
        <DialogHeader className="relative">
          <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogTitle>Create Support Ticket</DialogTitle>
        </DialogHeader>
        <Form {...requestForm}>
          <form onSubmit={requestForm.handleSubmit(onSubmit)}>
            <RequestorForm />
            <FormField
              control={requestForm.control}
              name="requestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setRequestType(value);
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
            {requestType === "Report an Issue" && <ReportIssueForm />}
            {requestType === "Request a New Asset" && <RequestAssetForm />}
            <Button className="my-2" type="submit">
              Submit Request
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestForm;
