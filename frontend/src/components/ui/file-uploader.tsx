/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { FileInput } from "@/components/ui/file-input";
import ErrorAlert from "../ErrorAlert";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  handleFiles: (files: File[]) => void;
  uploadedFiles: File[];
  accept: string;
  maxFileSize?: number;
  wildcard?: string;
  multiple?: boolean;
  uploadText?: React.ReactNode;
  borderStyle?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  handleFiles,
  uploadedFiles,
  accept,
  maxFileSize,
  wildcard,
  multiple = false,
  uploadText,
  borderStyle,
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [files, setFiles] = useState(uploadedFiles || []);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  // const handleFileAdd = (newFile: File) => {
  // setErrorMessage("");
  // setFiles((addedFiles) => [...addedFiles, newFile]);
  // handleFiles([...files, newFile]);
  // };

  const handleFileRemove = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
  };

  const handleChange = (file: File) => {
    setErrorMessage("");
    setFiles((addedFiles) => [...addedFiles, file]);
    handleFiles([...files, file]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const fileUploaded = event.dataTransfer.files[0];
    if (fileUploaded) {
      try {
        checkFileType(fileUploaded);
        checkFileSize(fileUploaded);
        handleChange(fileUploaded);
        // handleFileAdd(fileUploaded);
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
  };

  const supportedTypes: string[] = accept.toLowerCase().split(",");

  const supportedExtensions: string = supportedTypes
    .filter((type: string) => type[0] === ".")
    .join(", ");

  const checkFileType = (file: File) => {
    const { type, name } = file;
    const extension = ".".concat(name.split(".")[1]);
    const typeMatchesWildcard =
      wildcard && type.toLowerCase().includes(wildcard);
    const typeIsValid = typeMatchesWildcard
      ? true
      : supportedTypes.includes(type.toLowerCase());
    const extensionIsValid = supportedTypes.includes(extension);

    if (!typeIsValid || !extensionIsValid)
      throw Error(
        `Invalid file type. Supported types are: ${supportedExtensions}`
      );
  };

  const sizeInMB = (fileSize: number) => {
    return fileSize / (1024 * 1024);
  };
  const checkFileSize = (file: File) => {
    console.log(file);
    const totalFilesSize = files.reduce((total, f) => total + f.size, 0);
    if (maxFileSize && totalFilesSize > maxFileSize) {
      const maxFileSizeInMB = sizeInMB(maxFileSize);
      throw Error(`File size exceeds ${maxFileSizeInMB} MB`);
    }
  };

  const isSingleUpload = !multiple && uploadedFiles?.length === 1;
  return (
    <>
      <div
        className={cn(
          "w-full flex flex-col items-center  rounded p-4 border-[1px]",
          borderStyle
        )}
      >
        <div
          className="w-full flex flex-col cursor-pointer items-center gap-y-2"
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {errorMessage ? <ErrorAlert errorMessage={errorMessage} /> : null}
          {isSingleUpload ? (
            <>
              <FileSpreadsheet />
              File selected: {`${uploadedFiles[0].name}`}
            </>
          ) : (
            <>
              <Upload />
              {uploadText ?? "Upload a file"}
            </>
          )}
          <p className="text-sm text-muted-foreground">
            Supported file types: {supportedExtensions}
          </p>
          <FileInput
            ref={hiddenFileInput}
            onChange={handleChange}
            accept={accept}
            onError={handleUploadError}
            wildcard={wildcard}
            maxFileSize={maxFileSize}
          />
        </div>
      </div>
      <div className="mt-4">
        {files.map((file, index) => (
          <div
            key={file.name}
            className="flex w-full items-center  mb-2  border-[1px] p-2 px-4 rounded-lg"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-12 h-12 object-cover mr-2"
            />
            <div className="flex flex-grow flex-col">
              <span className="font-semibold">{file.name}</span>
              <span className="text-sm text-muted-foreground">
                {sizeInMB(file.size).toFixed(2)} MB
              </span>
            </div>
            <button
              onClick={() => handleFileRemove(index)}
              className="ml-2 text-red-500"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export { FileUploader };
