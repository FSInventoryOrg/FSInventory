import { useState } from 'react';
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

const SystemBackup = () => {
  const form = useForm({
    defaultValues: {
      file: ''
    }
  });

  const [uploadedFile, setUploadedFile] = useState<string>('');

  const acceptedFileTypes: string = '.xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'

  const handleFile = (file: File | undefined) => {
    console.log(file);
    setUploadedFile(file!!.name);
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
            <Button
              type="submit"
              disabled={!uploadedFile.length}
              className="w-[125px]"
            >
              {/* {isSavePending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" size={18} /> Loading...
                </>
              ) : (
                'Load file'
              )} */}
              Load file
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SystemBackup;