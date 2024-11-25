import { SupportTicketType } from "@/types/ticket";
import TicketsTable from "./TicketsTable";

interface TicketsTableProps {
  data: SupportTicketType[] | undefined;
}
const HIDDEN_COLUMNS = ["status"];
const OpenTicketsTable = ({ data }: TicketsTableProps) => {
  return (
    <TicketsTable
      id="open-tickets-table"
      title="Open Tickets"
      data={data}
      defaultHiddenColumns={HIDDEN_COLUMNS}
    />
  );
};

export default OpenTicketsTable;
