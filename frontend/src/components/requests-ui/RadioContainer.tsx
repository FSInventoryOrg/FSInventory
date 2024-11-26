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

const RadioContainer = ({
  id,
  value,
  selectedValue,
  className,
  children,
}: RadioContainerProps) => {
  const isChecked = selectedValue === value;
  return (
    <label
      htmlFor={id}
      className={cn(
        `flex flex-1 flex-row items-center p-4 pl-2 border rounded-lg cursor-pointer ${
          selectedValue === value
            ? "border-[#019C4E] bg-[#E6FAF0] dark:bg-secondary dark:border-secondary"
            : "border-secondary bg-transparent"
        }`,
        className
      )}
    >
      <span className="flex w-[48px] h-[48px] justify-center items-center">
        <RadioGroupItem value={value} id={id} checked={isChecked} />
      </span>
      <div className="gap-1 pl-2 items-center">{children}</div>
    </label>
  );
};

export default RadioContainer;
