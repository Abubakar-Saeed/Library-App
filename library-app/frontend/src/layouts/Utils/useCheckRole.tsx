import { useUser } from "@clerk/clerk-react";
import { Roles } from "../../../types/globals";

export const useCheckRole = (role: Roles) => {
  const { user } = useUser();

  if (!user) return false;

  // If you're storing role in publicMetadata or privateMetadata
  return user.publicMetadata?.role === role;
};
