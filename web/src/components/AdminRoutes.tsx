import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

const AdminRoute = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};
export default AdminRoute;
