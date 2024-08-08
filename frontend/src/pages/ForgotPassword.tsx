import Alert, { Props } from "@/components/Alert";
import AppearanceMode from "@/components/AppearanceMode";
import ForgotPasswordForm from "@/components/auth-ui/ForgotPasswordForm";
import { default as ForgotGraphic } from "@/components/graphics/Forgot";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [alert, setAlert] = useState({ type: "", message: "" });
  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="absolute top-2 right-2 drop-shadow-md">
        <AppearanceMode />
      </div>
      <section className="flex w-full justify-center">
        <div className="flex w-full min-h-screen lg:grid lg:grid-cols-2">
          <div className="hidden bg-muted lg:block">
            <div className="flex items-center justify-center mx-auto h-full">
              <ForgotGraphic height={600} width={600} />
            </div>
          </div>
          <div className="flex grow items-center justify-center pt-20 md:py-12 h-full">
            <div className="mx-auto grid w-[350px]">
              {alert.message && (
                <Alert
                  type={alert.type as Props["type"]}
                  message={alert.message}
                />
              )}
              <ForgotPasswordForm
                onError={(errorMessage) =>
                  setAlert({ type: "error", message: errorMessage as string })
                }
              />
              <Link className="text-sm pt-6 hover:underline" to="/">
                <ArrowLeft className="inline-block" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ForgotPassword;
