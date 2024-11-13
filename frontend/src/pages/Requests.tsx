import RequestForm from "@/components/requests-ui/RequestForm";
import { Separator } from "@/components/ui/separator";
import useUserData from "@/hooks/useUserData";
import { Flag } from "lucide-react";

const Requests = () => {
  const { data: user } = useUserData();

  const userData = {
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    manager: "John Doe", // TODO: replace with actual data from Rocks
    contactInfo: user?.email || "",
  };

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
      <div className="flex justify-center py-3">
        <div className="h-max w-[363px] flex flex-col items-center justify-center gap-3">
          <Flag className="text-muted-foreground" strokeWidth={0.5} size={96} />
          <div className="text-center gap-3">
            <h1 className="font-semibold text-2xl">No support tickets found</h1>
            <span className="text-muted-foreground">
              Submit a ticket for yourself or an employee by clicking the button
              below.
            </span>
          </div>
          <RequestForm userData={userData} />
        </div>
      </div>
    </section>
  );
};

export default Requests;
