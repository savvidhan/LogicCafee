import { Navigate } from "react-router-dom";
import { useApp } from "./providers/AppProvider";

/** Redirects to /login if user is not logged in */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
