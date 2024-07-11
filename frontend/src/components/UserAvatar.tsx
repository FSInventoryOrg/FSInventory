import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"
import SignOutButton from "./auth-ui/SignOutButton";
import { CircleUserRound, Settings, Wrench } from 'lucide-react';
import AppearanceMode from "./AppearanceMode";
import { UserIcon } from "./icons/UserIcon";

const UserAvatar = ({ height=40, width=40 }: { height?: number, width?: number }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="w-full flex rounded-full font-medium focus:outline outline-primary">
        <Avatar className="bg-secondary h-10 w-10 hover:opacity-80" style={{ height: height, width: width }} >
          <AvatarImage alt="@user" />
          <AvatarFallback className="bg-muted"><UserIcon size={100} className="fill-current text-secondary" /></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuLabel >My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/profile"><DropdownMenuItem className="gap-2 font-medium text-md"><CircleUserRound/> Profile</DropdownMenuItem></Link>
          <DropdownMenuItem className="gap-2 font-medium text-md" disabled><Settings /> Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="font-medium text-md relative gap-2 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full"><AppearanceMode /> Appearance</div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2 font-medium text-md" disabled><Wrench /> Support</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAvatar;