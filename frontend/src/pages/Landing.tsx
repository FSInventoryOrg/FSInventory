import { LoginScreen } from "@/components/landing-ui/LoginScreen";
import { Toaster } from "@/components/ui/toaster";

const Landing = () => {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <LoginScreen />
      <Toaster />
    </div>
  );
};

export default Landing;
