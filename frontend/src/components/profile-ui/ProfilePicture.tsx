import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";
import { UserIcon } from "../icons/UserIcon";
import { ChangeEvent, useRef } from "react";
import { UploadImage } from "@/types/user";

interface ProfilePictureProps {
  src: string | undefined;
  userId: string;
  onSave: (data: UploadImage) => void;
  onError: (message: string) => void;
}

const ERROR_TYPES = {
  NO_FILE: "NO_FILE",
  INVALID_TYPE: "INVALID_TYPE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
};

const ProfilePicture = ({
  src,
  userId,
  onSave,
  onError,
}: ProfilePictureProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateFile = (file?: File) => {
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (!file)
      return {
        isValid: false,
        type: ERROR_TYPES.NO_FILE,
        message: "No file selected",
      };
    if (file.size > maxFileSize) {
      return {
        isValid: false,
        type: ERROR_TYPES.FILE_TOO_LARGE,
        message: `File size exceeds 5MB`,
      };
    }
    return { isValid: true };
  };

  const resetFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    const { isValid, type, message } = validateFile(file);

    if (file && isValid) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const payload = {
          src: base64String as string,
          filename: file.name,
          userId,
        };
        onSave(payload);
      };
      reader.readAsDataURL(file);
    } else {
      if (type === ERROR_TYPES.FILE_TOO_LARGE) {
        resetFile();
        onError(message);
      }
    }
  };

  const handleButtonClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (fileInputRef.current != null) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 md:w-64 md:h-64 bg-muted border-border border rounded-full justify-center items-center flex">
        <Avatar className="w-32 h-32 md:w-64 md:h-64">
          <AvatarImage src={src} />
          <AvatarFallback>
            <UserIcon
              size={220}
              className=" w-64 h-64 fill-current text-secondary"
            />
          </AvatarFallback>
        </Avatar>
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          accept="image/*"
          onChange={handleUpload}
        />
        <Button
          className="absolute rounded-full right-0 bottom-0 md:right-2 md:bottom-2 border-4 h-10 w-10 md:h-12 md:w-12 border-bg-accent items-center justify-center"
          size="icon"
          onClick={handleButtonClick}
        >
          <Camera size={24} />
        </Button>
      </div>
    </div>
  );
};

export default ProfilePicture;
