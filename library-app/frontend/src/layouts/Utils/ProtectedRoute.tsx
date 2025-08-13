// ProtectedRoute.tsx
import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { SpinnerLoading } from "./SpinnerLoading";

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isLoaded)
          return (
            <div>
              <SpinnerLoading />
            </div>
          );
        if (!isSignedIn) return <Redirect to="/login" />;
        return <Component {...props} />;
      }}
    />
  );
};
