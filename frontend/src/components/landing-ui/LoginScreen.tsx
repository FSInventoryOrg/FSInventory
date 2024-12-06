import LoginForm from "./LoginForm";
import { useUserContext } from "@/hooks/useUserData";
import { useEffect } from "react";

export const LoginScreen = () => {
  const { setUser } = useUserContext();
  useEffect(() => {
    setUser(undefined);
  });
  return (
    <div className="flex w-screen h-screen tablet:bg-login-bg tablet:bg-cover">
      <div
        className={`flex flex-col justify-center bg-white dark:bg-background-new w-full 
      tablet:w-[547px] tablet:py-[269px] tablet:px-[72px] mobile-lg:px-[160px] px-6 text-black`}
      >
        <LoginForm />
      </div>
    </div>
  );
};
