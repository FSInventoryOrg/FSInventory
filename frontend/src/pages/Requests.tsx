import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Flag } from "lucide-react";

const Requests = () => {
  return (
    <section
      id="settings"
      className="flex flex-col w-full px-6 pb-3 md:px-24 sm:pb-6 pt-3"
    >
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your settings and preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex justify-center">
        <div className="h-max w-[363px] flex flex-col items-center justify-center gap-2">
          <Flag className="text-muted-foreground" strokeWidth={0.5} size={96} />
          <div className="text-center gap-2">
            <h1 className="font-semibold text-2xl">No support tickets found</h1>
            <span className="text-muted-foreground">
              Submit a ticket for yourself or an employee by clicking the button
              below.
            </span>
          </div>
          <Button className="bg-primary">Create a Ticket</Button>
        </div>
      </div>
    </section>
  );
};

export default Requests;
