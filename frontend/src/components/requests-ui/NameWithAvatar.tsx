import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface NameWithAvatarProps {
  fullName: string;
  src?: string;
}
const NameWithAvatar = ({ fullName, src }: NameWithAvatarProps) => {
  const nameParts = fullName.split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];

  const initials = useMemo(() => {
    const firstInitial = firstName?.[0]?.toUpperCase() || "";
    const lastInitial = lastName?.[0]?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  }, [firstName, lastName]);

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
