import { KeyIcon } from "lucide-react";

const AccountManagement = () => {
  return (
    <div className="flex w-full flex-col gap-1 border-t mt-4 ">
      <h1 className=" text-xl font-semibold static -translate-y-3 bg-card px-1 text-secondary-foreground flex items-center gap-1.5 w-fit">
        <KeyIcon size={16} className="text-primary" />
        Account Management
      </h1>
    </div>
  );
};

export default AccountManagement;
