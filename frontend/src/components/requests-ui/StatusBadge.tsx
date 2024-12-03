import { TicketStatusType, TicketStatus } from "@/types/ticket";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export const colors: Record<TicketStatus, string> = {
  [TicketStatus.PendingManager]:
    "dark:bg-[#54575A] dark:text-[#EEEEEF] bg-[#EEEEEF] text-[#3D3F41] border-none",
  [TicketStatus.Rejected]:
    "dark:bg-[#D02F2F] dark:text-[#FFFFFF] bg-[#FAEAEA] text-[#D44444] border-none",
  [TicketStatus.PendingIT]:
    "dark:bg-[#EBB505] dark:text-[#FFFFFF] bg-[#FDF8E6] text-[#675211] border-none",
  [TicketStatus.Resolved]:
    "dark:bg-[#019C4E] dark:text-[#FFFFFF] bg-[#E6F5ED] text-[#019C4E] border-none",
};

interface StatusBadgeProps {
  status: TicketStatusType;
  icon?: React.ReactNode;
}

const StatusBadge = ({ status, icon }: StatusBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn("px-3 text-sm font-semibold", colors[status])}
    >
      {status}
      {icon}
    </Badge>
  );
};

export default StatusBadge;
