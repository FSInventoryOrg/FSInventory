import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';
import { FileUploader } from '@/components/ui/file-uploader';
import { BackupValidationModal } from './BackupValidationModal';
import { validateBackupFile } from '@/ims-service';

export type ValidationResult = {
  message: string,
  outdated?: boolean,
  values?: {
    [index: string]: {
      current: Array<Object>,
      backup: Array<Object>
    }
  }
}

const SystemBackup = () => {
  const form = useForm({
    defaultValues: {
      file: ''
    }
  });

  const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  const [fileAsBase64, setFileAsBase64] = useState<{ src: string }>({ src: '' });
  const [validationResult, setValidationResult] = useState<ValidationResult>({ message: '' });
  const [validationComplete, setValidationComplete] = useState<boolean | null>(null);

  const acceptedFileTypes: string = '.zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed'

  const handleFile = (file: File | undefined) => {
    setUploadedFile(file);
    
    if (file !== undefined) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const plainText = base64String!!.split(',')[1]
        const backendExpected = "data:application/zip;base64," + plainText
        const payload = {
          src: backendExpected,
        };
        setFileAsBase64(payload);
        try {
          setValidationComplete(false)
          const validation: ValidationResult = await validateBackupFile(payload);
          setValidationResult(validation);
          setValidationComplete(true);
        } catch (err) {
          throw err;
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFileAsBase64({ src: '' })
    }
  }

  return (
    <div className="flex flex-col md:w-5/6 max-w-4xl">
      <div className="pb-2">
        <h1 className="text-xl font-semibold">Load System Backup File</h1>
        <h3 className="text-accent-foreground">
          Load data from a backup file.
        </h3>
      </div>
      <Form {...form}>
        <form
          className="w-full flex flex-col"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="pb-4">
                <FormControl className="pb-4">
                  <FileUploader
                    handleFile={handleFile}
                    uploadedFile={uploadedFile}
                    accept={acceptedFileTypes}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Drag a file or select one from your computer.
                </FormDescription>
              </FormItem>
            )}
          />
          <Separator className="my-4" />
          <div className="flex flex-row justify-end gap-4">
            <BackupValidationModal result={validationResult} validationComplete={validationComplete} />
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SystemBackup;