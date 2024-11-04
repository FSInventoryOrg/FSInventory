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
} from "@/schemas/RequestFormSchema";

const RequestForm = () => {
  const { showToast } = useAppContext();
  const { data: user } = useUserData();
  const [requestType, setRequestType] = useState("Report an Issue");
  const [userData, setUserData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setUserData({
        ...userData,
        fullName: user.firstName + " " + user.lastName,
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
    <div className="container mb-20">
      <div className="flex w-5/12  mx-auto">
        {requestType === "Report an Issue" && (
          <ReportIssueForm
            userData={userData}
            setUserData={setUserData}
            onSubmit={onSubmit}
            onChangeRequestType={setRequestType}
          />
        )}
        {requestType === "Request a New Asset" && (
          <RequestAssetForm
            userData={userData}
            setUserData={setUserData}
            onSubmit={onSubmit}
            onChangeRequestType={setRequestType}
          />
        )}
      </div>
    </div>
  );
};

export default RequestForm;
