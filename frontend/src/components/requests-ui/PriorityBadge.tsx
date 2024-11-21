import { PriorityLevel } from "@/types/ticket";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const colors: Record<PriorityLevel, Record<string, string>> = {
  Low: {
    default: "bg-neutrals-20 text-[#565F5C]",
    active: "bg-neutrals-70 text-neutrals-20",
  },
  Medium: {
    default: "bg-yellow-20 text-[#675211]",
    active: "bg-yellow-80 text-yellow/20",
  },
  High: {
    default: "bg-red-20 text-destructive",
    active: "bg-red-80 text-red-20",
  },
};

interface PriorityBadgeProps {
  priority: PriorityLevel;
  icon?: React.ReactNode; // Optional icon
  active?: boolean;
}
const PriorityBadge = ({ priority, icon, active }: PriorityBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "px-3 font-normal",
        colors[priority][active ? "active" : "default"]
      )}
    >
      {priority}
      {icon}
    </Badge>
  );
};

export default PriorityBadge;
