import { useRef, useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { FileInput } from '@/components/ui/file-input';
import ErrorAlert from '../ErrorAlert'

interface FileUploaderProps {
  handleFile: (file: File | undefined) => void;
  uploadedFile: File | undefined;
  accept: string;
  maxFileSize?: number 
}

const FileUploader: React.FC<FileUploaderProps> = ({ handleFile, uploadedFile, accept, maxFileSize }) => {
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

  const supportedTypes: string[] = accept.split(',')

  const supportedExtensions: string = supportedTypes
    .filter((type: string) => type[0] === '.')
    .join(', ');
  
  const wildCardTypes: string[] = supportedTypes.filter((type)=> type.endsWith('/*'))
  const isTypeInWildCard = (type: string)=> wildCardTypes.some((wildCardType)=> type.startsWith(wildCardType.slice(0,-1)))

  const checkFileType = (file: File) => {
    const { type, name } = file;
    const extension = '.'.concat(name.split('.')[1]);
    const typeIsValid = supportedTypes.includes(type) || (wildCardTypes.length && isTypeInWildCard(type));
    const extensionIsValid = supportedTypes.includes(extension);

    if (!typeIsValid && !extensionIsValid) throw Error(`Invalid file type. Supported types are: ${accept.replace(/,/g, ', ')}`);
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
            Supported file types: {`${accept.replace(/,/g, ', ')}`}
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