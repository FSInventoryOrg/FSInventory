/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Accept, FileRejection, useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import ErrorAlert from "../ErrorAlert";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface FileUploaderProps {
  handleFiles: (files: File[]) => void;
  uploadedFiles: File[];
  accept: Accept;
  maxFileSize?: number;
  wildcard?: string;
  multiple?: boolean;
  uploadText?: React.ReactNode;
  borderStyle?: string;
  maxFiles?: number;
}

enum FileErrorType {
  TOO_MANY_FILES = "too-many-files",
  FILE_TOO_LARGE = "file-too-large",
  UNSUPPORTED_FILE_TYPE = "file-invalid-type",
}

const FileUploader: React.FC<FileUploaderProps> = ({
  handleFiles,
  uploadedFiles = [],
  accept,
  maxFileSize,
  wildcard,
  multiple = false,
  uploadText,
  borderStyle,
  maxFiles = 5,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const supportedExtensions = Object.values(accept).flat().join(", ");
  const supportedTypes = Object.entries(accept)
    .flatMap(([mimeType, extensions]) => [mimeType, ...extensions])
    .join(", ");

  const getFileExtension = (name: string) => ".".concat(name.split(".")[1]);

  const sizeInMB = (fileSize: number) => {
    return fileSize / (1024 * 1024);
  };

  const handleUploadError = (errorMessage: Error): void => {
    setErrorMessage(errorMessage.message);
  };

  const handleFileRemove = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    handleFiles(updatedFiles);
  };

  const handleChange = (newFiles: File[]) => {
    setErrorMessage("");
    setFiles((prevFiles) => {
      const filesWithPreviews = newFiles.map((file) =>
        Object.assign(file, { preview: getThumbnailSrc(file) })
      );
      const updatedFiles = [...prevFiles, ...filesWithPreviews];
      return updatedFiles;
    });
    handleFiles([...uploadedFiles, ...newFiles]);
  };

  const getThumbnailSrc = (file: File) => {
    const { name } = file;
    const extension = getFileExtension(name);
    if (extension === ".pdf") return "/src/assets/pdf.png";
    if (extension === ".doc" || extension === ".docx")
      return "/src/assets/doc.png";
    return URL.createObjectURL(file);
  };

  const checkFileType = (file: File) => {
    const { type, name } = file;
    const extension = getFileExtension(name);
    const typeIsValid =
      supportedTypes.includes(type.toLowerCase()) ||
      (wildcard && type.toLowerCase().includes(wildcard));
    const extensionIsValid = supportedTypes.includes(extension.toLowerCase());

    if (!typeIsValid || !extensionIsValid)
      throw Error(
        `Invalid file type for ${file.name}. Supported types are: ${supportedTypes}`
      );
  };

  const checkFileSize = (file: File) => {
    const totalFilesSize =
      files.reduce((total, f) => total + f.size, 0) + file.size;
    if (maxFileSize && totalFilesSize > maxFileSize) {
      const maxFileSizeInMB = sizeInMB(maxFileSize);
      throw Error(`File size exceeds ${maxFileSizeInMB} MB`);
    }
  };

  const checkTooManyFiles = (uploadedFiles: File[]) => {
    if (uploadedFiles?.length + files.length > maxFiles) {
      throw Error(
        `You can only upload up to ${maxFiles} file${maxFiles > 1 ? "s" : ""}`
      );
    }
  };

  const handleRejectedFile = (rejectedFile: FileRejection) => {
    const error = rejectedFile.errors[0];
    let errorMessage;
    /* eslint-disable indent */
    switch (error.code) {
      case FileErrorType.TOO_MANY_FILES:
        errorMessage = `You can only upload up to ${maxFiles} file${maxFiles > 1 ? "s" : ""}`;
        break;
      case FileErrorType.UNSUPPORTED_FILE_TYPE:
        errorMessage = `Invalid file type for ${rejectedFile.file.name}. Supported types are: ${supportedTypes}`;
        break;
      case FileErrorType.FILE_TOO_LARGE:
        errorMessage = `File size exceeds ${sizeInMB(maxFileSize!)} MB`;
        break;
      default:
        errorMessage = error.message;
    }
    /* eslint-enable indent */
    handleUploadError(new Error(errorMessage));
  };

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // Check for rejected files
    if (rejectedFiles.length) {
      const rejectedFile = rejectedFiles[0];
      handleRejectedFile(rejectedFile);
      return;
    }

    try {
      if (maxFiles) {
        checkTooManyFiles(acceptedFiles);
      }
      acceptedFiles.forEach((file) => {
        checkFileType(file);
        checkFileSize(file);
      });

      handleChange(acceptedFiles);
    } catch (err: any) {
      handleUploadError(err);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    multiple,
    maxSize: maxFileSize,
    onDrop,
    maxFiles,
  });

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const isSingleUpload = !multiple && uploadedFiles?.length === 1;
  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "w-full flex flex-col items-center  rounded p-4 border-[1px]",
          borderStyle,
          isHovered &&
            "border-brandgreen dark:border-secondary-foreground/50 bg-brandgreen/7 transition duration-150 ease-in-out dark:bg-secondary"
        )}
      >
        <div
          className="w-full flex flex-col cursor-pointer items-center gap-y-2"
          {...getRootProps()}
        >
          {errorMessage ? <ErrorAlert errorMessage={errorMessage} /> : null}
          {isSingleUpload ? (
            <>
              <FileSpreadsheet />
              File selected: {`${uploadedFiles[0].name}`}
            </>
          ) : (
            <>
              <Upload
                className={cn(
                  isHovered &&
                    "dark:text-secondary-foreground text-brandgreen transition duration-150"
                )}
              />
              <h2
                className={cn(
                  "font-semibold text-accent-foreground",
                  isHovered &&
                    "dark:text-secondary-foreground text-brandgreen transition duration-150"
                )}
              >
                {uploadText ?? "Upload a file"}
              </h2>
            </>
          )}
          <p className="text-sm text-muted-foreground">
            Supported file types: {supportedExtensions}
          </p>
          {maxFileSize && (
            <p className="text-sm text-muted-foreground">
              Max. file size: {sizeInMB(maxFileSize)} MB
            </p>
          )}
          <Input {...getInputProps()} />
        </div>
      </div>
      {!isSingleUpload && (
        <div className="mt-4">
          {files.map((file, index) => (
            <div
              key={file.name}
              className="flex w-full items-center mb-2 border-[1px] p-2 px-4 rounded-lg text-accent-foreground"
            >
              <img
                src={getThumbnailSrc(file)}
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
      )}
    </>
  );
};

export { FileUploader };
