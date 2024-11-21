import { SupportTicketType } from "@/types/ticket";
import TicketsTable from "./TicketsTable";

interface TicketsTableProps {
  data: SupportTicketType[];
}
const HIDDEN_COLUMNS = ["priority", "actions"];
const ClosedTicketsTable = ({ data }: TicketsTableProps) => {
  return <TicketsTable data={data} defaultHiddenColumns={HIDDEN_COLUMNS} />;
};

export default ClosedTicketsTable;
