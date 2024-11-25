import { Separator } from "@/components/ui/separator";
import {
  SupportTicketType,
  TicketStatus,
  TicketStatusType,
} from "@/types/ticket";
import * as imsService from "@/ims-service";
import { useQuery } from "@tanstack/react-query";
import SupportTickets from "@/components/requests-ui/SupportTickets";
import TicketsOverview from "@/components/requests-ui/TicketsOverview";
import { useMemo } from "react";

const CLOSED_STATUSES: TicketStatusType[] = [
  TicketStatus.Rejected,
  TicketStatus.Resolved,
];

const Tickets = () => {
  const { data } = useQuery({
    queryKey: ["getTickets"],
    queryFn: () => imsService.getTickets(),
  });

  const supportTickets: SupportTicketType[] = data?.data;
  const hasExistingTickets = !!supportTickets?.length;

  const { openTickets, closedTickets } = useMemo(() => {
    return (
      supportTickets?.reduce<{
        openTickets: SupportTicketType[];
        closedTickets: SupportTicketType[];
      }>(
        (acc, ticket) => {
          if (ticket.status && CLOSED_STATUSES.includes(ticket.status)) {
            acc.closedTickets.push(ticket);
          } else {
            acc.openTickets.push(ticket);
          }
          return acc;
        },
        { openTickets: [], closedTickets: [] }
      ) || { openTickets: undefined, closedTickets: undefined }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportTickets]);

  return (
    <section
      id="supportTickets"
      className="flex flex-col w-full px-6 pb-3 md:px-24 sm:pb-6 pt-3"
    >
      <div className="flex justify-between space-y-0.5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-muted-foreground">
            View and manage all support tickets from your team members or submit
            a new one.
          </p>
        </div>
        {data && hasExistingTickets ? (
          <TicketsOverview count={openTickets.length} />
        ) : null}
      </div>
      <Separator className="my-5" />
      <div>
        <SupportTickets
          openTickets={openTickets}
          closedTickets={closedTickets}
        />
      </div>
    </section>
  );
};

export default Tickets;
