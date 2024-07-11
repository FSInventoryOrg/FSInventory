import * as imsService from "@/ims-service";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/Spinner";
import UserProfile from "@/components/profile-ui/UserProfile";
import { UserType } from "@/types/user";

const Profile = () => {
  const { data: userData } = useQuery<UserType>({
    queryKey: ["fetchUserData"],
    queryFn: () => imsService.fetchUserData(),
  });

  if (!userData) {
    return (
      <div
        className="w-full flex justify-center items-center"
        style={{ height: "calc(100vh - 89px)" }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <section className="container mx-auto w-full max-w-5xl py-6 px-6">
      <UserProfile userData={userData} />
    </section>
  );
};

export default Profile;
