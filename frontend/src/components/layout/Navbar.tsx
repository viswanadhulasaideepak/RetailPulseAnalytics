import { AppBar, Box, Toolbar } from "@mui/material";

import SearchBar from "./SearchBar";
import NotificationBell
from "../common/NotificationBell";
import UserMenu from "./UserMenu";

const Navbar = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#0F172A",
        borderBottom: "1px solid rgba(255,255,255,.08)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        top: 0,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }}>

        <SearchBar />

        <Box sx={{ flexGrow: 1 }} />

       <NotificationBell />

        <Box sx={{ ml: 2 }} />

        <UserMenu />

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;