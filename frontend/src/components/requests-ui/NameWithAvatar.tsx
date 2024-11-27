import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

interface NameWithAvatarProps {
  fullName: string;
  src?: string;
}
const NameWithAvatar = ({ fullName, src }: NameWithAvatarProps) => {
  const initials = useMemo(() => {
    return getInitials(fullName);
  }, [fullName]);

  return (
    <span className="flex items-center gap-2">
      <Avatar className="w-6 h-6">
        <AvatarImage src={src} />
        <AvatarFallback className="bg-[#7E1111] text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      {fullName}
    </span>
  );
};

export default NameWithAvatar;
