import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#7C3AED",
    },

    secondary: {
      main: "#A855F7",
    },

    background: {
      default: "#0F172A",
      paper: "#1E293B",
    },
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default theme;