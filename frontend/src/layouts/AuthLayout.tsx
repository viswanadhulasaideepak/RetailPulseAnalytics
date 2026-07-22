import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthLayout = ({
  title,
  subtitle,
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
        <Typography variant="h4"
          sx={{fontWeight : 700}}
          align="center"
          gutterBottom
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          {subtitle}
        </Typography>

        {children}
      </Paper>
    </Box>
  );
};

export default AuthLayout;