import AppearanceMode from "@/components/AppearanceMode";
import ResetPassword from "@/components/auth-ui/ResetPassword";
import { default as ForgotGraphic } from "@/components/graphics/Forgot";

const ResetPasswordPage = () => {
  return (
    <>
      <div className="absolute top-2 right-2 drop-shadow-md">
        <AppearanceMode />
      </div>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="hidden bg-muted lg:block">
          <div className="flex items-center justify-center mx-auto h-full">
            <ForgotGraphic height={600} width={600} />
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <ResetPassword/>
           
          </div>
        </div>
      </div>
    </>
  );
};
export default ResetPasswordPage;
