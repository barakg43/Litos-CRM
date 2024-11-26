import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/redux/slices/authStore";

const PrivateRoutes = () => {
  const auth = useAuth();
  if (!auth.isAuthenticated) return <Navigate to='/login' />;
  return <Outlet />;
};

export default PrivateRoutes;
