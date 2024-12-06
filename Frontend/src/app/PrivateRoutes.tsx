import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRetrieveUserQuery } from "../services/redux/api/apiAuth";
import { useAuthStore } from "../services/redux/slices/useAuthStore";

const PrivateRoutes = () => {
  const login = useAuthStore((state) => state.login);
  const { data: user, isLoading } = useRetrieveUserQuery(undefined, {
    refetchInterval: false,
    retry: false,
  });
  const isAlreadyAuthenticated = user != undefined;
  useEffect(() => {
    if (user) login(user);
  }, [user]);
  if (isLoading) return <LoadingSpinner />;
  return isAlreadyAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoutes;
