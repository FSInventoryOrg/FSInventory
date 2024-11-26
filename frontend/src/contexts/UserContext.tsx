import { createContext, useState } from "react";

type User = {
  id?: number;
  role: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
};

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

  const value: UserContextType = {
    setUser: (user: User | undefined) => {
      setUser(user);
    },
    user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
