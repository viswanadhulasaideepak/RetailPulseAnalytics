import api from "./axios";

export interface RegisterPayload {
  company_name: string;
  industry: string;
  company_email: string;
  company_address: string;
  company_phone: string;

  owner_name: string;
  owner_email: string;

  password: string;
  confirm_password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerCompany = async (
  data: RegisterPayload
) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};

export const login = async (
  data: LoginPayload
) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUser = async (
  refreshToken: string
) => {
  const response = await api.post(
    "/auth/logout",
    {
      refresh_token: refreshToken,
    }
  );

  return response.data;
};