import { CalendarPlus, Mail } from "lucide-react";
import { format } from "date-fns";
import { UserType } from "@/types/user";

interface UserProfileProps {
  userData: UserType;
}

const ProfileCardDetails = ({ userData }: UserProfileProps) => {
  return (
    <>
      <div className="w-full flex flex-col text-center ">
        <h1 className="text-lg font-bold">{`${userData.firstName} ${userData.lastName}`}</h1>
        {userData.role === "ADMIN" && (
          <h3 className=" text-lg font-semibold leading-6 text-muted-foreground">
            Administrator
          </h3>
        )}
      </div>
      <div className="flex flex-col text-sm mx-auto text-secondary-foreground">
        <div className="flex flex-row">
          {userData.joinDate && (
            <span className="flex py-2 font-semibold">
              <CalendarPlus size={20} className="mr-2 text-primary" />
              <p>{`Joined on ${format(userData.joinDate, "PPP")}`}</p>
            </span>
          )}
        </div>
        {userData.email && (
          <div className="flex flex-row">
            <span className="flex py-2 font-semibold">
              <Mail size={20} className="mr-2 text-primary" />
              <p>{userData.email}</p>
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileCardDetails;
