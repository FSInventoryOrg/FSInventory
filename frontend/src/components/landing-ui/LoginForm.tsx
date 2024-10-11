import { useContext, useState } from "react";
import { FullScaleITIcon } from "../icons/FullScaleITIcon"
import SignInForm from "@/components/auth-ui/SignInForm";
import { ThemeProviderContext } from "../ThemeProvider";

const LoginForm = () => {
  const darkMode: boolean = useContext(ThemeProviderContext).theme === 'dark'

  return (
    <div className={`flex flex-col gap-8 font-poppins text-body dark:text-muted-new`}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-3 items-center align-middle">
          <FullScaleITIcon />
          <span className={`text-3xl dark:text-white`}>IT Portal</span>
        </div>
        <span className="text-sm mobile-lg:text-base">Make equipment requests or manage your inventory - all in one place.</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className={`text-xl mobile-lg:text-2xl text-black dark:text-white font-semibold`}>Sign in</span>
        <span className="text-sm">Use your Rocks credentials</span>
      </div>
      <SignInForm onError={() => { }} />
    </div>
  )
}

export default LoginForm