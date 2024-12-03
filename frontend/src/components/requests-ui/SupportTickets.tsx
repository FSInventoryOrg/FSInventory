import { SupportTicketType } from "@/types/ticket";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import OpenTicketsTable from "./OpenTicketsTable";
import ClosedTicketsTable from "./ClosedTicketTable";
import NoTickets from "./NoTickets";

interface SupportTicketsProps {
  openTickets: SupportTicketType[] | undefined;
  closedTickets: SupportTicketType[] | undefined;
}

const TABS = ["All", "Open", "Closed"];

const SupportTickets = ({
  openTickets,
  closedTickets,
}: SupportTicketsProps) => {
  const [selectedTab, setSelectedTab] = useState("All");

  if (openTickets?.length === 0 && closedTickets?.length === 0) {
    return <NoTickets />;
  }

  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:space-y-0">
      <aside className="h-100 mx-0 w-[200px]">
        <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 gap-2">
          {TABS.map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              className={cn(
                "flex w-full font-semibold items-center rounded-md px-4 py-2 hover:underline justify-start",
                selectedTab === tab && "bg-secondary"
              )}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </aside>
      <div
        id="tickets-content"
        className="flex flex-col flex-1 justify-center gap-12"
      >
        {(selectedTab === "All" || selectedTab === "Open") && (
          <OpenTicketsTable data={openTickets} />
        )}
        {(selectedTab === "All" || selectedTab === "Closed") && (
          <ClosedTicketsTable data={closedTickets} />
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
