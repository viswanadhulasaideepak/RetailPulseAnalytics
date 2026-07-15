export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  company_id: number;
  status: string;
  last_login: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}