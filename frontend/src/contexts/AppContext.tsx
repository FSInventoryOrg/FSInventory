import React from 'react';
import { useToast } from "@/components/ui/use-toast"
import { useQuery } from '@tanstack/react-query';
import * as apiClient from '../auth-service'

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
}

export type AppContextType = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children } : { children: React.ReactNode }) => {
  const { toast } = useToast()

  const { isError, isLoading } = useQuery({ queryKey: ["validateToken"], queryFn: apiClient.validateToken, retry: false });

  return (
    <AppContext.Provider value={{
      showToast: (toastMessage) => {
        console.log(toastMessage)
        toast({
          title: toastMessage.type,
          description: toastMessage.message,
        })
      },
      isLoggedIn: (!isError && !isLoading),
      isLoading: isLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
};