import { Box } from "@mui/material";
import type { ReactNode } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6f9" }}>
      <Box sx={{ width: { xs: 0, md: 270 }, flexShrink: 0 }}>
        <Sidebar />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, overflow: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;