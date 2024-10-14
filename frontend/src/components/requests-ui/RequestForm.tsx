import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAppContext } from '@/hooks/useAppContext';
import * as imsService from '@/ims-service';
import RequestAssetForm from './RequestAssetForm';
import ReportIssueForm from './RerportIssueForm';

const RequestForm = () => {
  const { showToast } = useAppContext();
  const [requestType, setRequestType] = useState('Report an Issue');
//   const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  //   const [openRequestedDate, setOpenRequestedDate] = useState(false);
  //   const [requestedDate, setRequestedDate] = useState<Date | undefined>();

  //   function handleSubmit(
  //     onSubmit: any
  //   ): FormEventHandler<HTMLFormElement> | undefined {
  //     throw new Error('Function not implemented.');
  //   }

  const onSubmit = (data: any) => {
    console.log(data);
    mutate();
  };

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

  //   const RequestSchema =
  //     requestType === 'Report an Issue'
  //       ? ReportIssueSchema
  //       : RequestNewAssetSchema;

  //   const requestForm = useForm<z.infer<typeof RequestSchema>>({
  //     resolver: zodResolver(RequestSchema),
  //     defaultValues: {
  //       fullName: '',
  //       manager: '',
  //       contactInfo: '',
  //       issueCategory: '',
  //       problemDescription:'',
  //       requestType:'',
  //     },
  //     mode: 'onChange',
  //   });

  //   const requestType = requestForm.watch('requestType');

  //   const reportIssueForm = useForm<z.infer<typeof ReportIssueSchema>>({
  //     resolver: zodResolver(ReportIssueSchema),
  //     defaultValues: {},
  //     mode: 'onChange',
  //   });

  //   const requestAssetForm = useForm<z.infer<typeof RequestNewAssetSchema>>({
  //     resolver: zodResolver(RequestNewAssetSchema),
  //     defaultValues: {},
  //     mode: 'onChange',
  //   });

  //   useEffect(() => {
  //     // if (requestType === 'Report an Issue') {
  //     //   requestAssetForm.reset();
  //     // } else {
  //     //   reportIssueForm.reset();
  //     // }
  //     requestForm.reset();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [requestType]);

//   const handleFile = (file: File | undefined) => {
//     setUploadedFile(file);
//   };

  return (
    <div className="container mb-20">
      {/* <div className="flex w-7/12  mx-auto"> */}
      <div className="flex w-5/12  mx-auto">
        {/* {errors.requestType && <p className="text-red-500">{errors.requestType.message}</p>} */}
        {/* Conditional Fields for 'Report an Issue' */}
        {requestType === 'Report an Issue' && (
          <ReportIssueForm
            onSubmit={onSubmit}
            onChangeRequestType={setRequestType}
          />
        )}

        {/* Conditional Fields for 'Request a New Asset' */}
        {requestType === 'Request a New Asset' && (
          <RequestAssetForm
            onSubmit={onSubmit}
            onChangeRequestType={setRequestType}
          />
        )}
      </div>
    </div>
  );
};

export default RequestForm;
