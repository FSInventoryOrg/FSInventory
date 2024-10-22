import { useRef, useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { FileInput } from '@/components/ui/file-input';
import ErrorAlert from '../ErrorAlert'

interface FileUploaderProps {
  handleFile: (file: File | undefined) => void;
  uploadedFile: File | undefined;
  accept: string;
  maxFileSize?: number
  wildcard?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ handleFile, uploadedFile, accept, maxFileSize, wildcard }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null); 

  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = () => {
    hiddenFileInput.current?.click();   
  };

  const handleChange = (file: File) => {
    setErrorMessage('');
    handleFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const fileUploaded = event.dataTransfer.files[0];
    if (fileUploaded) {
      try {
        checkFileType(fileUploaded);
        checkFileSize(fileUploaded)
        handleChange(fileUploaded);
      } catch (err: any) {
        handleUploadError(err);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };


  const handleUploadError = (errorMessage: Error): void => {
    setErrorMessage(errorMessage.message);
  }

  const supportedTypes: string[] = accept.toLowerCase().split(',')

  const supportedExtensions: string = supportedTypes
    .filter((type: string) => type[0] === '.').join(', ')

  const checkFileType = (file: File) => {
    const { type, name } = file;
    const extension = '.'.concat(name.split('.')[1]);
    const typeMatchesWildcard = wildcard && type.toLowerCase().includes(wildcard)
    const typeIsValid =  typeMatchesWildcard ? true : supportedTypes.includes(type.toLowerCase());
    const extensionIsValid = supportedTypes.includes(extension);

    if (!typeIsValid || !extensionIsValid) throw Error(`Invalid file type. Supported types are: ${supportedExtensions}`);
  }

  const checkFileSize = (file: File) => {
    if (maxFileSize && file.size > maxFileSize) {
      throw Error(`File size exceeds ${maxFileSize} MB`);
    }
  }
  
  return (
    <>
      <div className="w-full flex flex-col items-center border-[1px] rounded p-4">
        <div className="w-full flex flex-col cursor-pointer items-center gap-y-2" onClick={handleClick} onDrop={handleDrop} onDragOver={handleDragOver}>
          {errorMessage ? <ErrorAlert errorMessage={errorMessage}/> : null}
          {uploadedFile ?
            <>
              <FileSpreadsheet />
              File selected: {`${uploadedFile.name}`}
            </> :
            <>
              <Upload />
              Upload a file
            </>
          }
          <p className="text-sm text-muted-foreground">
            Supported file types: {supportedExtensions}
          </p>
          <FileInput  
            ref={hiddenFileInput}
            onChange={handleChange}
            accept={accept}
            onError={handleUploadError}
            wildcard={wildcard}
          />
        </div>
      </div>
    </>
  );
};

export { FileUploader };