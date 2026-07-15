import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        bgcolor: "#0F172A",
      }}
    >
      <CircularProgress size={55} />

      <Typography
        sx={{ mt: 3 }}
        color="white"
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;