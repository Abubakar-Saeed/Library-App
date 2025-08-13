import { SignUp } from "@clerk/clerk-react";

export const Register = () => {
  return (
    <div className="d-flex justify-content-center">
      <SignUp signInUrl="/login" forceRedirectUrl="/home" />
    </div>
  );
};
