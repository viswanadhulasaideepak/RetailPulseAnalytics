import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { registerCompany } from "../api/authApi";
import type { RegisterPayload } from "../api/authApi";

interface RegisterFormData extends RegisterPayload {}

const RegisterForm = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password");

  const mutation = useMutation({
    mutationFn: registerCompany,

    onSuccess: () => {
      navigate("/");
    },

    onError: (err: any) => {
      setError(
        err?.response?.data?.detail ??
          "Registration Failed"
      );
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setError("");

    mutation.mutate(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={2.5}>
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <TextField
          label="Company Name"
          {...register("company_name", {
            required: "Required",
          })}
          error={!!errors.company_name}
          helperText={errors.company_name?.message}
        />

        <TextField
          label="Industry"
          {...register("industry", {
            required: "Required",
          })}
          error={!!errors.industry}
          helperText={errors.industry?.message}
        />

        <TextField
          label="Company Email"
          {...register("company_email", {
  required: "Company email is required",
  pattern: {
    value: /^\S+@\S+\.\S+$/,
    message: "Enter a valid email",
  },
})}
          error={!!errors.company_email}
          helperText={errors.company_email?.message}
        />

        <TextField
          label="Company Address"
          {...register("company_address", {
            required: "Required",
          })}
          error={!!errors.company_address}
          helperText={
            errors.company_address?.message
          }
        />

        <TextField
          label="Company Phone"
          {...register("company_phone", {
            required: "Required",
          })}
          error={!!errors.company_phone}
          helperText={errors.company_phone?.message}
        />

        <TextField
          label="Owner Name"
          {...register("owner_name", {
            required: "Required",
          })}
          error={!!errors.owner_name}
          helperText={errors.owner_name?.message}
        />

        <TextField
          label="Owner Email"
          {...register("owner_email", {
            required: "Required",
          })}
          error={!!errors.owner_email}
          helperText={errors.owner_email?.message}
        />

        <TextField
          label="Password"
          type="password"
          {...register("password", {
            required: "Required",
            minLength: {
              value: 8,
              message:
                "Minimum 8 characters",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <TextField
          label="Confirm Password"
          type="password"
          {...register("confirm_password", {
            required: "Required",
            validate: (value) =>
              value === password ||
              "Passwords do not match",
          })}
          error={!!errors.confirm_password}
          helperText={
            errors.confirm_password?.message
          }
        />

        <Button
          variant="contained"
          type="submit"
          size="large"
          disabled={mutation.isPending}
          sx={{
            mt: 1,
            borderRadius: 3,
            height: 52,
            textTransform: "none",
          }}
        >
          {mutation.isPending ? (
            <CircularProgress
              color="inherit"
              size={22}
            />
          ) : (
            "Create Company"
          )}
        </Button>
      </Stack>
    </Box>
  );
};

export default RegisterForm;