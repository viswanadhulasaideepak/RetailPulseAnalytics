import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <AuthLayout
      title="RetailPulse Analytics"
      subtitle="Sign in to your account"
    >
      <LoginForm />

      <Typography
        sx={{
          mt: 3,
          textAlign: "center",
        }}
      >
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </Typography>
    </AuthLayout>
  );
};

export default Login;