import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { cn } from "@/lib/utils";

export const EmployeeDropdownMenu = ({
  children,
  open,
  setOpen,
  dropdownMenuContentClassName,
}: {
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  dropdownMenuContentClassName: string;
}) => {
  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="">
        <Button className="w-fit h-[28px] p-0 m-0 bg-transparent hover:bg-transparent">
          <DotsThreeVertical size={32} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          "dark:bg-[#141D1E] bg-white rounded-[4px] mr-[40px]",
          dropdownMenuContentClassName
        )}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
