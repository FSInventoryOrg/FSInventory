import { useContext } from "react"
import { ThemeProviderContext } from "../ThemeProvider"
import LoginForm from "./LoginForm"

export const LoginScreen = () => {
  const darkMode: boolean = useContext(ThemeProviderContext).theme === 'dark';

  return (
    <div className="flex w-screen h-screen bg-login-bg bg-cover">
      <div className={`w-[547px] ${darkMode ? 'bg-background-new' : 'bg-white'} py-[269px] px-[72px] text-black`}>
        <LoginForm />
      </div>
    </div>
  )
}