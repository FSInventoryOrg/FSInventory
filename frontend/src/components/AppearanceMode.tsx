import { Root as SwitchRoot, Thumb as SwitchThumb } from "@radix-ui/react-switch";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

const AppearanceMode = () => {
  const [mode, setMode] = useState(false);

  const { setTheme, theme } = useTheme()

  useEffect(() => {
    // Set the initial mode state based on the currently stored theme
    setMode(theme === "dark");
  }, [theme]);

  const handleModeToggle = () => {
    // Toggle mode and set the theme accordingly
    setMode(!mode);
    setTheme(mode ? "light" : "dark");
  }

  return (
    <>
      <SwitchRoot
        className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
        checked={mode}
        onCheckedChange={handleModeToggle}
      >
        <SwitchThumb
          className="justify-center items-center flex pointer-events-none h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        >
          {mode ? <MoonIcon size={16} /> : <SunIcon size={16} />}
        </SwitchThumb>
      </SwitchRoot>
    </>
  )
}

export default AppearanceMode;