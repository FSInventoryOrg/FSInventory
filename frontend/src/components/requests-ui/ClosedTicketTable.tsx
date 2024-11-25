import { SupportTicketType } from "@/types/ticket";
import TicketsTable from "./TicketsTable";
interface TicketsTableProps {
  data?: SupportTicketType[] | undefined;
}
const HIDDEN_COLUMNS = ["priority", "actions"];
const ClosedTicketsTable = ({ data }: TicketsTableProps) => {
  return (
    <TicketsTable
      id="closed-tickets-table"
      title="Closed Tickets"
      data={data}
      defaultHiddenColumns={HIDDEN_COLUMNS}
    />
  );
};

export default ClosedTicketsTable;
