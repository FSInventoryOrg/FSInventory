import { useQuery } from "@tanstack/react-query";
import { UserType } from "@/types/user";
import * as imsService from "@/ims-service";

const useUserData = () => {
  const { data, isLoading } = useQuery<UserType>({
    queryKey: ["fetchUserData"],
    queryFn: () => imsService.fetchUserData(),
  });
  return { data, isLoading };
};

export default useUserData;
