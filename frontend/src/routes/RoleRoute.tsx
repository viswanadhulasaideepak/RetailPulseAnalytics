import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface Props {
  roles: string[];
}

const RoleRoute = ({
  roles,
}: Props) => {
  const { user } = useAuth();

  if (!user)
    return <Navigate to="/" />;

  if (!roles.includes(user.role))
    return <Navigate to="/dashboard" />;

  return <Outlet />;
};

export default RoleRoute;