import { PriorityLevel, SupportTicketType } from "@/types/ticket";
import PriorityDropdown from "./PrioritySelect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as imsService from "@/ims-service";
import useUserData from "@/hooks/useUserData";
import { useAppContext } from "@/hooks/useAppContext";

interface TicketPriorityProps {
  ticket: SupportTicketType;
}

const TicketPriority = ({ ticket }: TicketPriorityProps) => {
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useUserData();
  const { showToast } = useAppContext();
  const { mutate, isPending } = useMutation({
    mutationKey: ["updateTicketPriority"],
    mutationFn: imsService.updateTicketPriority,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["getTickets"] });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handlePriorityChange = (priority: PriorityLevel) => {
    mutate({ ticketId: ticket.ticketId, priority, updatedBy: user?.email });
  };

  return (
    <PriorityDropdown
      disabled={isUserLoading || isPending}
      priority={ticket.priority ?? "Low"}
      onChange={handlePriorityChange}
    />
  );
};

export default TicketPriority;
