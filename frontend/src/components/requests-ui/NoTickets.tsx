import { Flag } from "lucide-react";
import RequestForm from "./RequestForm";
import useUserData from "@/hooks/useUserData";

const NoTickets = () => {
  const { data: user } = useUserData();
  return (
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
        <RequestForm user={user} />
      </div>
    </div>
  );
};

export default NoTickets;
