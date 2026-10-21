import { Navigate } from "react-router-dom";
import { useApp } from "./providers/AppProvider";

/** Redirects to /patterns if user is already logged in */
const GuestRoute = ({ children }) => {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? <Navigate to="/patterns" replace /> : children;
};

export default GuestRoute;
