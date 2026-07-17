import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
 const { token, loading } = useAuth();

if (loading)
    return null;

if (!token)
    return <Navigate to="/" replace />;

return <Outlet />;
};

export default ProtectedRoute;