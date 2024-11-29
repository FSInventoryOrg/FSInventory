import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppContextProvider } from "@/contexts/AppContext";
import { UserContextProvider } from "@/contexts/UserContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <UserContextProvider>{children}</UserContextProvider>
          </ThemeProvider>
        </AppContextProvider>
      </QueryClientProvider>
    </>
  );
}
