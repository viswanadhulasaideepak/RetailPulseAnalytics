import {
  Box,
  Paper,
} from "@mui/material";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({
  children,
}: Props) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#312E81,#1E293B)",
      }}
    >
      <Paper
  elevation={8}
  sx={{
    width: {
      xs: "95%",
      sm: 600,
      md: 720,
    },
    maxWidth: 720,
    borderRadius: 5,
    p: 5,
  }}
>
  {children}
</Paper>
    </Box>
  );
};

export default AuthLayout;