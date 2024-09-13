import { useRef, useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { FileInput } from '@/components/ui/file-input';
import ErrorAlert from '../ErrorAlert'

interface FileUploaderProps {
  handleFile: (file: File | undefined) => void;
  uploadedFile: string;
  accept: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ handleFile, uploadedFile, accept }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null); 

  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = () => {
    hiddenFileInput.current?.click();   
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files?.[0];
    setErrorMessage('');
    handleFile(fileUploaded);
  };

  const handleUploadError = (errorMessage: Error): void => {
    setErrorMessage(errorMessage.message);
  }

  const supportedTypes: string[] = accept.split(',')

  const supportedExtensions: string = supportedTypes
    .filter((type: string) => type[0] === '.')
    .join(', ');
  
  return (
    <>
      <div className="w-full flex flex-col items-center border-[1px] rounded p-4">
        <div className="w-full flex flex-col cursor-pointer items-center gap-y-2" onClick={handleClick}>
          {errorMessage ? <ErrorAlert errorMessage={errorMessage}/> : null}
          {uploadedFile.length ?
            <>
              <FileSpreadsheet />
              File selected: {`${uploadedFile}`}
            </> :
            <>
              <Upload />
              Upload a file
            </>
          }
          <p className="text-sm text-muted-foreground">
            Supported file types: {`${supportedExtensions}`}
          </p>
          <FileInput  
            ref={hiddenFileInput}
            onChange={handleChange}
            accept={accept}
            onError={handleUploadError}
          />
        </div>
      </div>
    </>
  );
};

export { FileUploader };