import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/hooks/useAppContext";
import * as imsService from "@/ims-service";
import RequestAssetForm from "./RequestAssetForm";
import ReportIssueForm from "./ReportIssueForm";
import {
  RequestFormData,
  RequestFormSchema,
  RequestType,
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
  FormMessage,
} from "../ui/form";
import RequestTypeOptions from "./RequestTypeOptions";
import { Separator } from "../ui/separator";
import { UserType } from "@/types/user";
import { mapUserToRequesForm } from "@/lib/utils";

const defaultReportIssueValues = {
  issueCategory: "",
  assetAffected: "",
  problemDescription: "",
  supportingFiles: undefined,
};

const defaultRequestAssetValues = {
  assetType: "",
  assetModel: "",
  justification: "",
  requestedDate: undefined,
};

interface RequestFormProps {
  user?: UserType;
}

const RequestForm = ({ user }: RequestFormProps) => {
  const userData = user ? mapUserToRequesForm(user) : {};
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { showToast } = useAppContext();

  const { mutate } = useMutation({
    mutationFn: imsService.submitTicket,
    onSuccess: async () => {
      showToast({
        message:
          "Thank you for your request! Your request has been submitted, and you will receive a confirmation email with a tracking number shortly.",
        type: "SUCCESS",
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getTickets"] });
    },
  });

  const requestForm = useForm<RequestFormData>({
    resolver: zodResolver(RequestFormSchema),
    defaultValues: {
      type: "Issue Report",
      ...userData,
      ...defaultReportIssueValues,
    },
    mode: "onChange",
  });

  const requestType = requestForm.watch("type", "Issue Report" as RequestType);

  const resetForm = (type: RequestType) => {
    requestForm.reset({
      ...requestForm.getValues(),
      ...(type === "Issue Report"
        ? defaultReportIssueValues
        : defaultRequestAssetValues),
    });
  };

  useEffect(() => {
    if (!open) {
      requestForm.reset({ type: "Issue Report" });
    }
  }, [requestForm, open]);

  useEffect(() => {
    // When user selects another ticket type, clear fields from the other form
    if (requestType === "Issue Report") {
      resetForm("Asset Request");
    } else {
      resetForm("Issue Report");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestType]);

  useEffect(() => {
    // Load user data within support ticket form when it is available
    if (userData) {
      requestForm.reset({ ...userData }, { keepValues: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const onSubmit = (data: RequestFormData) => {
    mutate({ ...data, createdBy: requestForm.getValues("employeeEmail") });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary">Create a Ticket</Button>
      </DialogTrigger>
      <DialogContent
        tabIndex={-1}
        className="min-w-full overflow-y-auto h-full bg-transparent justify-center flex border-none px-0 py-0 sm:py-16"
      >
        <div className="sm:max-w-[800px] bg-card h-fit  rounded-lg">
          <DialogHeader className="relative sm:p-5">
            <DialogClose className="absolute right-2 top-2 p-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogTitle className="text-xl font-semibold mt-0">
              Create Support Ticket
            </DialogTitle>
          </DialogHeader>
          <Form {...requestForm}>
            <form
              onSubmit={requestForm.handleSubmit(onSubmit)}
              className="p-3 sm:p-5 sm:pt-0 flex flex-col gap-3"
            >
              <h2 className="text-lg font-semibold">Employee Information</h2>
              <div className="sm:w-1/2 pr-2">
                <RequestorForm />
              </div>
              <Separator />
              <h2 className="text-lg font-semibold">Ticket Type</h2>
              <FormField
                control={requestForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RequestTypeOptions
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              {requestType === "Issue Report" && (
                <>
                  <h2 className="text-lg font-semibold">Report an Issue</h2>
                  <ReportIssueForm />
                </>
              )}
              {requestType === "Asset Request" && (
                <>
                  <h2 className="text-lg font-semibold">Report a New Asset</h2>
                  <RequestAssetForm />
                </>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-primary text-white" type="submit">
                  Submit Ticket
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestForm;
