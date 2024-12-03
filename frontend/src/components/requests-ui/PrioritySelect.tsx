import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import PriorityBadge from "./PriorityBadge";
import { useState } from "react";
import { PRIORITY_LEVELS, PriorityLevel } from "@/types/ticket";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface PrioritySelectProps {
  priority: PriorityLevel;
  onChange: (priority: PriorityLevel) => void;
  disabled?: boolean;
}

const PriorityDropdown = ({
  priority,
  onChange,
  disabled,
}: PrioritySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePriorityChange = (priorityLvl: PriorityLevel) => {
    onChange(priorityLvl);
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="outline" className="h-8 border-0 bg-transparent">
          <PriorityBadge
            priority={priority}
            icon={
              <ChevronDown
                strokeWidth={2}
                className={cn(
                  "ml-2 transition-transform duration-200 size-3 rounded-full bg-inherit brightness-150",
                  isOpen && "rotate-180"
                )}
              />
            }
          ></PriorityBadge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {PRIORITY_LEVELS.map((level) => (
          <DropdownMenuItem
            key={level}
            onClick={() => handlePriorityChange(level)}
          >
            <PriorityBadge priority={level} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PriorityDropdown;
