import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import SignOutButton from "./auth-ui/SignOutButton";
import { Settings, Wrench } from "lucide-react";
import AppearanceMode from "./AppearanceMode";
import { UserIcon } from "./icons/UserIcon";
import { prependHostIfMissing } from "@/lib/utils";
import { UserType } from "@/types/user";
import { useMemo } from "react";

type Props = {
  height?: number;
  width?: number;
  userInfo: UserType | undefined;
};
const UserAvatar = ({ height = 40, width = 40, userInfo }: Props) => {
  const name = useMemo(() => {
    if (!userInfo) return "";
    return `${userInfo?.lastName}, ${userInfo?.firstName}`;
  }, [userInfo]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="w-full flex rounded-full focus:outline outline-primary">
        <Avatar
          className="bg-secondary h-10 w-10 hover:opacity-80"
          style={{ height: height, width: width }}
        >
          <AvatarImage
            src={prependHostIfMissing(userInfo?.avatar)}
            alt="@user"
          />
          <AvatarFallback className="bg-muted">
            <UserIcon size={100} className="fill-current text-secondary" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuGroup>
          <div className="flex gap-3 px-2 py-1">
            <Avatar
              className="bg-secondary h-10 w-10 hover:opacity-80"
              style={{ height: 50, width: 50 }}
            >
              <AvatarImage
                src={prependHostIfMissing(userInfo?.avatar)}
                alt="@user"
              />
              <AvatarFallback className="bg-muted">
                <UserIcon size={100} className="fill-current text-secondary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-muted-foreground">{userInfo?.email}</p>
            </div>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-secondary" />
        <DropdownMenuGroup>
          <div className="text-md relative gap-2 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
            <AppearanceMode /> Dark Mode
          </div>
          <Link to="/settings">
            <DropdownMenuItem className="gap-2 text-md">
              <Settings /> Settings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="gap-2 text-md" disabled>
            <Wrench /> Support
          </DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
