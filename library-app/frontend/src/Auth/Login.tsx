import { SignIn } from "@clerk/clerk-react";

export const Login = () => {
  return (
    <div className="d-flex justify-content-center">
      <SignIn signUpUrl="signup" forceRedirectUrl="/home" />
    </div>
  );
};
