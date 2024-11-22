import ClosedTicketsTable from "@/components/requests-ui/ClosedTicketTable";
import OpenTicketsTable from "@/components/requests-ui/OpenTicketsTable";
import RequestForm from "@/components/requests-ui/RequestForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useUserData from "@/hooks/useUserData";
import { cn } from "@/lib/utils";
import {
  SupportTicketType,
  TicketStatus,
  TicketStatusType,
} from "@/types/ticket";
import { ClockCountdown } from "@phosphor-icons/react";
import { Flag } from "lucide-react";
import { useMemo, useState } from "react";

const TABS = ["All", "Open", "Closed"];
const CLOSED_STATUSES: TicketStatusType[] = [
  TicketStatus.Rejected,
  TicketStatus.Resolved,
];

const supportTickets: SupportTicketType[] = [
  {
    ticketId: "AR-123",
    employeeEmail: "apacada@fullscale.ph",
    employeeName: "Alpha Marie Pacada",
    managerName: "John Doe",
    createdBy: "apacada@fullscale.ph",
    created: new Date(),
    priority: "Low",
    type: "Asset Request",
    assetSpecsModel: "Headphones",
    justification: "worn out",
    assetType: "Hardware",
  },
  {
    ticketId: "AR-001",
    employeeEmail: "apacada@fullscale.ph",
    employeeName: "Alpha Marie Pacada",
    managerName: "John Doe",
    createdBy: "apacada@fullscale.ph",
    created: new Date(),
    priority: "Low",
    type: "Asset Request",
    assetSpecsModel:
      "Dell PowerEdge R940 Server with Intel Xeon Platinum 8280 Processors, 1.5TB DDR4 RAM",
    justification: "worn out",
    assetType: "Hardware",
  },
  {
    ticketId: "IR-001",
    employeeEmail: "apacada@fullscale.ph",
    employeeName: "Alpha Marie Pacada",
    managerName: "John Doe",
    createdBy: "apacada@fullscale.ph",
    created: new Date(),
    priority: "Medium",
    type: "Issue Report",
    assetAffected: "Monitor",
    issueCategory: "Hardware",
    issueDescription: "",
  },
  {
    ticketId: "IR-002",
    employeeEmail: "apacada@fullscale.ph",
    employeeName: "Xerxes Ondong",
    managerName: "Michael Paradela II",
    createdBy: "apacada@fullscale.ph",
    created: new Date(),
    priority: "Low",
    type: "Issue Report",
    issueCategory: "Hardware",
    issueDescription: "",
    status: "Rejected",
  },
  {
    ticketId: "IR-003",
    employeeEmail: "apacada@fullscale.ph",
    employeeName: "John Doe",
    managerName: "John Doe",
    createdBy: "apacada@fullscale.ph",
    created: new Date(),
    priority: "Low",
    type: "Issue Report",
    issueCategory: "Hardware",
    issueDescription: "",
    status: "Resolved",
  },
  {
    ticketId: "IR-004",
    employeeEmail: "rolazo@fullscale.ph",
    employeeName: "Richard Olazo",
    managerName: "Michael Paradela II",
    createdBy: "rolazo@fullscale.ph",
    created: new Date(),
    priority: "High",
    type: "Issue Report",
    issueCategory: "Hardware",
    issueDescription: "",
    status: "Resolved",
  },
  {
    ticketId: "IR-005",
    employeeEmail: "dmontecillo@fullscale.ph",
    employeeName: "David Montecillo",
    managerName: "Retchel Tapayan",
    createdBy: "dmontecillo@fullscale.ph",
    created: new Date(),
    priority: "High",
    type: "Issue Report",
    issueCategory: "Hardware",
    issueDescription: "",
    status: "Rejected",
  },
];

const Tickets = () => {
  const { data: user } = useUserData();
  const [selectedTab, setSelectedTab] = useState("All");

  const userData = {
    employeeName: user ? `${user.firstName} ${user.lastName}` : "",
    managerName: "John Doe", // TODO: replace with actual data from Rocks
    employeeEmail: user?.email || "",
  };

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
      ) || {}
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
        <div className="flex justify-between items-center w-80 border rounded-md bg-accent p-4">
          <div className="flex flex-row gap-2">
            <div className="flex items-center justify-center rounded-md bg-[#795E06] size-12 ">
              <ClockCountdown className="text-[#EBB505]" size={32} />
            </div>
            <div>
              <h3 className="text-accent-foreground font-semibold text-sm">
                Open Tickets
              </h3>
              <h2 className="text-foreground font-bold text-2xl">
                {openTickets.length}
              </h2>
            </div>
          </div>
          <RequestForm userData={userData} />
        </div>
      </div>
      <Separator className="my-5" />

      {supportTickets?.length > 0 ? (
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
      ) : (
        <div className="flex justify-center py-3">
          <div className="h-max w-[363px] flex flex-col items-center justify-center gap-3">
            <Flag
              className="text-muted-foreground"
              strokeWidth={0.5}
              size={96}
            />
            <div className="text-center gap-3">
              <h1 className="font-semibold text-2xl">
                No support tickets found
              </h1>
              <span className="text-muted-foreground">
                Submit a ticket for yourself or an employee by clicking the
                button below.
              </span>
            </div>
            <RequestForm userData={userData} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Tickets;
