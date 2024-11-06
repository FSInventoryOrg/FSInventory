import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { Dispatch, ReactNode, SetStateAction } from "react";

export const EmployeeDropdownMenu = ({
  children,
  open,
  setOpen,
}: {
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="">
        <Button className="w-fit h-[28px] p-0 m-0 bg-transparent hover:bg-transparent">
          <DotsThreeVertical size={32} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-[200px] dark:bg-[#141D1E] bg-white rounded-[4px]">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
