import { Button } from "../ui/button";
import { NotebookPenIcon } from "lucide-react";
import { SupportTicketType } from "@/types/ticket";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface TicketIDProps {
  ticket: SupportTicketType;
}

const TicketID = ({ ticket }: TicketIDProps) => {
  return (
    <div className="flex items-center gap-1">
      <div className="text-xs font-normal px-2 py-0 w-fit overflow-hidden text-ellipsis whitespace-nowrap hover:underline">
        {ticket.ticketId}
      </div>

      {ticket.type === "Issue Report" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2 py-0">
                <span>
                  <span className="sr-only">View Remarks</span>
                  <NotebookPenIcon size={16} className="cursor-pointer" />
                </span>
                <TooltipContent side="right">
                  <p className="text-xs">View Remarks</p>
                </TooltipContent>
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default TicketID;
