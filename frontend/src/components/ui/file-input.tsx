import { forwardRef, ForwardedRef, ChangeEventHandler } from 'react';
import { Input } from '@/components/ui/input';

interface FileInputProps {
  onError: (errorMessage: Error) => void;
  onChange: ChangeEventHandler<HTMLInputElement>;
  accept: string;
}

const FileInput = forwardRef(function FileInput(props: FileInputProps, ref: ForwardedRef<HTMLInputElement>) {
  const { onChange, accept, onError } = props;  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files!![0];
    try {
      checkFileType(fileUploaded!!);
      onChange(event);
    } catch (err: any) {
      onError(err);
    }
  };

  const supportedTypes: string[] = accept.split(',')

  const supportedExtensions: string = supportedTypes.join(', ');

  const checkFileType = (file: File) => {
    const { type, name } = file;
    const extension = '.'.concat(name.split('.')[1]);
    const typeIsValid = supportedTypes.includes(type);
    const extensionIsValid = supportedTypes.includes(extension);

    if (!typeIsValid || !extensionIsValid) throw Error(`Invalid file type. Supported types are: ${supportedExtensions}`);
  }


  return (
    <Input 
      type="file"
      ref={ref}
      onChange={handleChange}
      style={{ display: 'none' }}
      accept={accept}
    />
  )
});
  
export { FileInput };