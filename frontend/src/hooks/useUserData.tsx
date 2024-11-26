import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context)
    throw new Error("useUser must be used within a UserContextProvider");

  return context;
};
