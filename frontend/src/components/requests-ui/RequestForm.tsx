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
  FormMessage,
} from "../ui/form";
import RequestTypeOptions from "./RequestTypeOptions";
import { Separator } from "../ui/separator";

const RequestForm = () => {
  const [open, setOpen] = useState(false);
  const { showToast } = useAppContext();
  const { data: user } = useUserData();

  const requestForm = useForm<RequestFormData>({
    resolver: zodResolver(RequestFormSchema),
    defaultValues: {
      requestType: "Report an Issue",
    },
    mode: "onChange",
  });

  const reset = () => {
    if (user) {
      const userDetails = {
        fullName: user.firstName + " " + user.lastName,
        manager: "John Doe",
        contactInfo: user.email,
      };
      requestForm.reset(userDetails, { keepDefaultValues: true });
    } else {
      requestForm.reset();
    }
  };

  const requestType = requestForm.watch("requestType", "Report an Issue");

  useEffect(() => {
    if (open && user) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, requestForm, user]);

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
        className="min-w-full overflow-y-auto h-full bg-transparent justify-center flex border-none px-0 py-0 sm:py-16"
      >
        <div className="sm:max-w-[800px] bg-card h-fit  rounded-lg">
          <DialogHeader className="relative sm:p-5">
            <DialogClose className="absolute right-2 top-2 p-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              {/* <span> */}
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
              {/* </span> */}
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
                name="requestType"
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
              {requestType === "Report an Issue" && (
                <>
                  <h2 className="text-lg font-semibold">Report an Issue</h2>
                  {/* <div className="sm:w-1/2 pr-2"> */}
                  <ReportIssueForm />
                  {/* </div> */}
                </>
              )}
              {requestType === "Request a New Asset" && (
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
