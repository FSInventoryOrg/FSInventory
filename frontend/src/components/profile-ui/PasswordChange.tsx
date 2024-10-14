import PasswordChangeModal from "./PasswordChangeModal";

const PasswordChange = () => {
  return (
    <>
      <div className="flex flex-row justify-between items-center gap-2">
        <div className="pb-2">
          <h1 className="font-bold">Password</h1>
          <h3 className="text-accent-foreground">
            Choose a strong password to keep your account secure.
          </h3>
        </div>
        <PasswordChangeModal disabled/>
      </div>
    </>
  );
};

export default PasswordChange;
