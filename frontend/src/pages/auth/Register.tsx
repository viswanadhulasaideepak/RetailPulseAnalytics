import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Alert, Box, Grid, Typography } from "@mui/material";

import AuthLayout from "../../layouts/AuthLayout";
import InputField from "../../components/common/InputField";
import PasswordField from "../../components/common/PasswordField";
import SubmitButton from "../../components/common/SubmitButton";

import { registerCompany } from "../../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company_name: "",
    industry: "",
    company_email: "",
    company_address: "",
    company_phone: "",
    owner_name: "",
    owner_email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerCompany(form);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center" }}>
        Company Registration
      </Typography>

      <Typography color="text.secondary" sx={{ textAlign: "center", mb: 4 }}>
        Create your RetailPulse workspace
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <InputField
              name="company_name"
              label="Company Name"
              value={form.company_name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <InputField
              name="industry"
              label="Industry"
              value={form.industry}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <InputField
              name="company_email"
              label="Company Email"
              value={form.company_email}
              onChange={handleChange}
              type="email"
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <InputField
              name="company_address"
              label="Company Address"
              value={form.company_address}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <InputField
              name="company_phone"
              label="Company Phone"
              value={form.company_phone}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <InputField
              name="owner_name"
              label="Company Admin Name"
              value={form.owner_name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <InputField
              name="owner_email"
              label="Company Admin Email"
              value={form.owner_email}
              onChange={handleChange}
              type="email"
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <PasswordField
              name="password"
              label="Password"
              value={form.password}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <PasswordField
              name="confirm_password"
              label="Confirm Password"
              value={form.confirm_password}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <SubmitButton text="Register Company" loading={loading} />
      </Box>

      <Typography sx={{ mt: 3, textAlign: "center" }}>
        Already have an account? <Link to="/">Login</Link>
      </Typography>
    </AuthLayout>
  );
};

export default Register;