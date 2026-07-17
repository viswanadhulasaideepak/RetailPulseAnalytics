import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import Products from "../pages/products/Products";
import Categories from "../pages/categories/Categories";
import Sales from "../pages/sales/Sales";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import AuditLogs from "../pages/auditlogs/AuditLogs";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/profile" element={<Profile />} />

     {/* Company Admin + Super Admin */}

      <Route element={
      <RoleRoute
        roles={[
          "Company Admin",
          "Super Admin",
        ]}/>
        }>
      <Route path="/audit-logs" element={<AuditLogs />}/>
      </Route>

      {/* Company Admin + Analyst + Super Admin */}

      <Route element={
      <RoleRoute
        roles={[
          "Company Admin",
          "Analyst",
          "Super Admin",
        ]}/>
        }>
     <Route path="/products" element={<Products />}/>

     <Route path="/categories" element={<Categories />}/>

     <Route path="/sales" element={<Sales />}/>

  </Route>

  </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;