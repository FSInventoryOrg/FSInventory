import Alert, { Props } from "@/components/Alert";
import AppearanceMode from "@/components/AppearanceMode";
import PasswordChangedSuccess from "@/components/auth-ui/PasswordChangedSuccess";
import ResetPassword from "@/components/auth-ui/ResetPassword";
import { default as ForgotGraphic } from "@/components/graphics/Forgot";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [showSuccessSplash, setShowSuccessSplash] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const navigate = useNavigate();

  const onResetSuccess = ()=> {
    setAlert({ type: "", message: "" })
    setShowSuccessSplash(true)
  }
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
            <div className="mx-auto grid w-[350px] gap-3">
              {showSuccessSplash ? (
                <PasswordChangedSuccess
                  redirectPath={{ name: "dashboard", path: "/dashboard" }}
                  skipWait={true}
                  delay={5000}
                  onComplete={() => navigate("/dashboard")}
                />
              ) : (
                <>
                  {alert.message && (
                    <Alert
                      type={alert.type as Props["type"]}
                      message={alert.message}
                    />
                  )}
                  <ResetPassword
                    onError={(errorMessage) =>
                      setAlert({
                        type: "error",
                        message: errorMessage as string,
                      })
                    }
                    onSuccess={onResetSuccess}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ResetPasswordPage;
