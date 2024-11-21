import ClosedTicketsTable from "@/components/requests-ui/ClosedTicketTable";
import OpenTicketsTable from "@/components/requests-ui/OpenTicketsTable";
import RequestForm from "@/components/requests-ui/RequestForm";
import SidebarNav from "@/components/setttings-ui/SidebarNav";
import { Separator } from "@/components/ui/separator";
import useUserData from "@/hooks/useUserData";
import { SupportTicketType } from "@/types/ticket";
import { Flag } from "lucide-react";

const Tickets = () => {
  const { data: user } = useUserData();

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
      ticketId: "IR-001",
      employeeEmail: "apacada@fullscale.ph",
      employeeName: "Alpha Marie Pacada",
      managerName: "John Doe",
      createdBy: "apacada@fullscale.ph",
      created: new Date(),
      priority: "Medium",
      type: "Issue Report",
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

  const userData = {
    employeeName: user ? `${user.firstName} ${user.lastName}` : "",
    managerName: "John Doe", // TODO: replace with actual data from Rocks
    employeeEmail: user?.email || "",
  };

  const settingsNavItems = [
    {
      title: "All",
      href: "/tickets/assetcontrol",
    },
    {
      title: "Open",
      href: "/tickets/notifications",
    },
    {
      title: "Closed",
      href: "/tickets/inventory",
    },
  ];

  return (
    <section
      id="supportTickets"
      className="flex flex-col w-full px-6 pb-3 md:px-24 sm:pb-6 pt-3"
    >
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Support Tickets</h2>
        <p className="text-muted-foreground">
          View and manage all support tickets from your team members or submit a
          new one.
        </p>
      </div>
      <Separator className="my-6" />

      {supportTickets?.length > 0 ? (
        <div className="flex flex-col space-y-2 gap-8 lg:flex-row lg:space-y-0">
          <aside className="h-100 mx-0 w-[200px]">
            <SidebarNav items={settingsNavItems} />
          </aside>

          <div
            id="tickets-content"
            className="flex flex-col flex-1 justify-center py-3 gap-12"
          >
            <OpenTicketsTable data={supportTickets} />
            <ClosedTicketsTable data={supportTickets} />
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
