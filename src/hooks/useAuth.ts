import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";

/**
 * Reusable hook to access Firebase authentication context.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
