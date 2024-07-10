import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";
import { UserIcon } from "../icons/UserIcon";

interface ProfilePictureProps {
  src: string;
  userId: string;
}

const ProfilePicture = ({ src, userId }: ProfilePictureProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-64 w-64 bg-muted border-border border rounded-full justify-center items-center flex">
        <Avatar className="w-64 h-64">
          <AvatarImage src={src} />
          <AvatarFallback>
            <UserIcon
              size={220}
              className=" w-64 h-64 fill-current text-secondary"
            />
          </AvatarFallback>
        </Avatar>
        <Button
          className="absolute rounded-full right-2 bottom-2 border-4 h-12 w-12 border-bg-accent items-center justify-center"
          size="icon"
        >
          <Camera size={24} />
        </Button>
      </div>
    </div>
  );
};

export default ProfilePicture;
