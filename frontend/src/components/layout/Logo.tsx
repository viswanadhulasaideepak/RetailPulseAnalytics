import { Box, Typography } from "@mui/material";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";

const Logo = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 3,
        py: 3,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "14px",
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <StoreRoundedIcon />
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
          RetailPulse
        </Typography>

        <Typography sx={{ fontSize: 12 }} color="text.secondary">
          Analytics
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;