import { forwardRef, ForwardedRef } from 'react';
import { Input } from '@/components/ui/input';

interface FileInputProps {
  onError: (errorMessage: Error) => void;
  onChange: (file: File) => void;
  accept: string;
  maxFileSize?: number;
  wildcard?: string;
}

const FileInput = forwardRef(function FileInput(props: FileInputProps, ref: ForwardedRef<HTMLInputElement>) {
  const { onChange, accept, onError, maxFileSize, wildcard } = props;  

  const handleChange = (file: File) => {
    try {
      checkFileType(file);
      checkFileSize(file);
      onChange(file);
    } catch (err: any) {
      onError(err);
    }
  };

  const supportedTypes: string[] = accept.split(',')

  const supportedExtensions: string = supportedTypes.join(', ');

  const checkFileType = (file: File) => {
    const { type, name } = file;
    const extension = '.'.concat(name.split('.')[1]);
    const typeMatchesWildcard = wildcard && type.includes(wildcard)
    const typeIsValid =  typeMatchesWildcard ? true : supportedTypes.includes(type);
    const extensionIsValid = supportedTypes.includes(extension);

    if (!typeIsValid || !extensionIsValid) throw Error(`Invalid file type. Supported types are: ${supportedExtensions}`);
  }

  const checkFileSize = (file: File) => {
    if (maxFileSize && file.size > maxFileSize) {
      throw Error(`File size exceeds ${maxFileSize} MB`);
    }
  }

  return (
      <Input 
        type="file"
        ref={ref}
        onChange={(file) => handleChange(file.target.files!![0])}
        style={{ display: 'none' }}
        accept={accept}
        onDragOver={(event) => event.preventDefault()}
      />
  )
});
  
export { FileInput };