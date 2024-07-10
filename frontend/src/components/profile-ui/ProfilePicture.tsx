import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";
import { UserIcon } from "../icons/UserIcon";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState, useRef } from "react";

interface ProfilePictureProps {
  src: string;
  userId: string;
  onSave: () => null;
}

const ProfilePicture = ({ src, userId, onSave }: ProfilePictureProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [img, setImg] = useState(src);
  const { handleSubmit, register } = useForm();
  const { ref, ...rest } = register("firstName");
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImg(URL.createObjectURL(file));
    }
  };

  const onSubmit = () => {
    onSave();
  };

  const handleButtonClick = () => {
    if (fileInputRef.current != null) {
      fileInputRef.current.click();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center">
        <div className="relative h-64 w-64 bg-muted border-border border rounded-full justify-center items-center flex">
          <Avatar className="w-64 h-64">
            <AvatarImage src={img} />
            <AvatarFallback>
              <UserIcon
                size={220}
                className=" w-64 h-64 fill-current text-secondary"
              />
            </AvatarFallback>
          </Avatar>
          <input
            type="file"
            {...rest}
            style={{ display: "none" }}
            ref={(e) => {
              ref(e);
              fileInputRef.current = e; // you can still assign to ref
            }}
            accept="image/*"
            onChange={handleUpload}
          />

          <Button
            className="absolute rounded-full right-2 bottom-2 border-4 h-12 w-12 border-bg-accent items-center justify-center"
            size="icon"
            onClick={handleButtonClick}
          >
            <Camera size={24} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfilePicture;
