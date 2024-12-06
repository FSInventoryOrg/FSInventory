import { createContext, useState, useEffect } from "react";
import { UserType as User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import * as imsService from "@/ims-service";

type UserContextType = {
  user?: User;
  setUser: (user: User | undefined) => void;
};

const initialState: UserContextType = {
  user: undefined,
  setUser: () => null,
};

export const UserContext = createContext<UserContextType>(initialState);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const { mutate: getCookieUser } = useMutation({
    mutationFn: imsService.getCookieUser,
    onSuccess: async (data: { user: User; isLoggedIn: boolean }) => {
      const { user, isLoggedIn } = data;
      setLoggedIn(isLoggedIn);
      setUser(user);
    },
  });

  const { mutate: validateToken } = useMutation({
    mutationFn: imsService.validateToken,
    onSuccess: async (data: boolean) => {
      setLoggedIn(data);
    },
  });

  useEffect(() => {
    if (!loggedIn) {
      validateToken();
    }
    if (loggedIn && !user) {
      getCookieUser();
    }
  }, [user, getCookieUser, validateToken, loggedIn]);

  const value: UserContextType = {
    setUser: (user: User | undefined) => {
      setUser(user);
    },
    user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
