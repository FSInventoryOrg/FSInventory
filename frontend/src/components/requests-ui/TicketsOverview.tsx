import { ClockCountdown } from "@phosphor-icons/react";
import RequestForm from "./RequestForm";
import useUserData from "@/hooks/useUserData";

interface TicketsOverviewProps {
  count: number;
}
const TicketsOverview = ({ count }: TicketsOverviewProps) => {
  const { data: user } = useUserData();
  return (
    <div className="flex justify-between items-center w-80 border rounded-md bg-accent p-4">
      <div className="flex flex-row gap-2">
        <div className="flex items-center justify-center rounded-md bg-[#795E06] size-12 ">
          <ClockCountdown className="text-[#EBB505]" size={32} />
        </div>
        <div>
          <h3 className="text-accent-foreground font-semibold text-sm">
            Open Tickets
          </h3>
          <h2 className="text-foreground font-bold text-2xl">{count}</h2>
        </div>
      </div>

      <RequestForm user={user} />
    </div>
  );
};

export default TicketsOverview;
