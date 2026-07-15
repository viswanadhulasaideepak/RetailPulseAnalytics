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

import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

interface LoginInputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const mutation = useMutation({
    mutationFn: loginUser,

    onSuccess: async (data) => {
      await login(
        data.access_token,
        data.refresh_token
      );

      navigate("/dashboard");
    },

    onError: () => {
      setError("Invalid Email or Password");
    },
  });

  const onSubmit = (values: LoginInputs) => {
    setError("");

    mutation.mutate(values);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={3}>
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          fullWidth
          {...register("email", {
            required: "Email is required",
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          {...register("password", {
            required: "Password is required",
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button
          variant="contained"
          size="large"
          type="submit"
          disabled={mutation.isPending}
          sx={{
            borderRadius: 3,
            height: 52,
            textTransform: "none",
            fontSize: 16,
          }}
        >
          {mutation.isPending ? (
            <CircularProgress
              color="inherit"
              size={22}
            />
          ) : (
            "Login"
          )}
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginForm;