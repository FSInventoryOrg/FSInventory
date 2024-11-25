import { PriorityLevel } from "@/types/ticket";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export const colors: Record<PriorityLevel, string> = {
  Low: "bg-badge-neutral border-none text-badge-neutral-foreground",
  Medium: "bg-badge-yellow border-none text-badge-yellow-foreground",
  High: "bg-badge-destructive border-none text-badge-destructive-foreground",
};

interface PriorityBadgeProps {
  priority: PriorityLevel;
  icon?: React.ReactNode;
}

const PriorityBadge = ({ priority, icon }: PriorityBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn("px-3 text-sm font-semibold", colors[priority])}
    >
      {priority}
      {icon}
    </Badge>
  );
};

export default PriorityBadge;
