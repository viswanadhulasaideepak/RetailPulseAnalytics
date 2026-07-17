import {
  Box,
  Divider,
  List,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import HistoryIcon from "@mui/icons-material/History";
import PointOfSaleRoundedIcon from "@mui/icons-material/PointOfSaleRounded";

import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        width: 270,
        height: "100vh",
        position: "sticky",
        top: 0,
        bgcolor: "#0F172A",
        color: "#fff",
        borderRight: "1px solid #1E293B",
        overflowY: "auto",
        pb: 4,
      }}
    >
      <Logo />

      <Divider sx={{ borderColor: "#334155" }} />

      <List>

        <SidebarItem
          title="Dashboard"
          path="/dashboard"
          icon={<DashboardRoundedIcon />}
        />

        {[
          "Company Admin",
          "Super Admin",
          "Analyst",
        ].includes(user?.role ?? "") && (
        <>
        <SidebarItem
         title="Products"
         path="/products"
         icon={<InventoryRoundedIcon />}
        />

        <SidebarItem
         title="Categories"
         path="/categories"
         icon={<CategoryRoundedIcon />}
        />

        <SidebarItem
         title="Sales"
         path="/sales"
         icon={<PointOfSaleRoundedIcon />}
        />
        </>
        )}

        {[
          "Company Admin",
          "Super Admin",
          "Analyst",
        ].includes(user?.role ?? "") && (
        
          <SidebarItem
           title="Inventory"
           path="/inventory"
           icon={<ShoppingCartRoundedIcon />}
          />
          )}

        {[
          "Company Admin",
          "Super Admin",
          "Analyst",
        ].includes(user?.role ?? "") && (
          <SidebarItem
             title="Analytics"
             path="/analytics"
             icon={<AnalyticsRoundedIcon />}
          />
          )}

        {[
          "Company Admin",
          "Super Admin",
          "Analyst",
        ].includes(user?.role ?? "") && (
          <SidebarItem
             title="Reports"
             path="/reports"
             icon={<AssessmentRoundedIcon />}
          />
          )}

        {[
          "Company Admin",
          "Super Admin",].includes(user?.role ?? "") && (
          <>
          <SidebarItem
             title="Users"
             path="/users"
             icon={<PeopleRoundedIcon />}
          />

          <SidebarItem
           title="Company"
           path="/company"
           icon={<BusinessRoundedIcon />}
          />
           </>
        )}

        {[
          "Company Admin",
          "Super Admin",
        ].includes(user?.role ?? "") && (
        <SidebarItem
           title="Audit Logs"
           path="/audit-logs"
           icon={<HistoryIcon />}
        />
        )}

        <SidebarItem
          title="Profile"
          path="/profile"
          icon={<PersonRoundedIcon />}
        />

        <SidebarItem
          title="Settings"
          path="/settings"
          icon={<SettingsRoundedIcon />}
        />

      </List>
    </Box>
  );
};

export default Sidebar;