import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import type { ReactNode } from "react";

import {
  login as loginApi,
  getCurrentUser,
} from "../api/authApi";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  company_id: number;
  company_name?: string;
  status: string;
  last_login?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const storedToken = localStorage.getItem("accessToken");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const profile = await getCurrentUser();

      setUser(profile);

      setToken(storedToken);
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setUser(null);
      setToken(null);
    }

    setLoading(false);
  };

  const login = async (data: LoginData) => {
    const response = await loginApi(data);

    localStorage.setItem(
      "accessToken",
      response.access_token
    );

    localStorage.setItem(
      "refreshToken",
      response.refresh_token
    );

    setToken(response.access_token);

    const profile = await getCurrentUser();

    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);