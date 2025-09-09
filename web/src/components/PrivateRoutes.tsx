import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

const PrivateRoute = () => {
	const { userInfo } = useAppSelector((state) => state.auth);
	return userInfo && userInfo._id ? (
		<Outlet />
	) : (
		<Navigate to="/login" replace />
	);
};
export default PrivateRoute;
