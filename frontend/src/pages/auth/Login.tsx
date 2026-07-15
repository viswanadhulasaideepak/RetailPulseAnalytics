import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Alert, Box, Typography } from "@mui/material";

import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import PasswordField from "../../components/common/PasswordField";
import SubmitButton from "../../components/common/SubmitButton";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center" }}>
        Welcome Back
      </Typography>

      <Typography color="text.secondary" sx={{ textAlign: "center", mb: 4 }}>
        Login to RetailPulse Analytics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <InputField
          label="Email"
          value={form.email}
          onChange={handleChange}
          required
          type="email"
          name="email"
        />

        <PasswordField
          label="Password"
          value={form.password}
          onChange={handleChange}
          name="password"
        />

        <SubmitButton text="Login" loading={loading} />
      </Box>

      <Typography sx={{ textAlign: "center", mt: 3 }}>
        Don't have an account? <Link to="/register">Register</Link>
      </Typography>
    </AuthLayout>
  );
};

export default Login;