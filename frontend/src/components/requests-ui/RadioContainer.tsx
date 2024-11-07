import React from "react";
import { RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";

interface RadioContainerProps {
  id: string;
  value: string;
  selectedValue: string;
  className?: string;
  children: React.ReactNode;
}

const RadioContainer: React.FC<RadioContainerProps> = ({
  id,
  value,
  selectedValue,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        `flex flex-1 flex-row items-center p-4 pl-2 border rounded-lg cursor-pointer ${
          selectedValue === value
            ? "border-[#019C4E] bg-[#E6FAF0]"
            : "border-secondary bg-transparent"
        }`,
        className
      )}
    >
      <span className="flex w-[48px] h-[48px] justify-center items-center">
        <RadioGroupItem
          id={id}
          value={value}
          checked={selectedValue === value}
        />
      </span>
      <div className="gap-1 pl-2 items-center">{children}</div>
    </div>
  );
};

export default RadioContainer;
