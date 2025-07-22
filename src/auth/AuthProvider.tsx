"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authAPI } from "@/routes/auth";

interface User {
  userId: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  authenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const cookieToken = Cookies.get("token");

      if (!cookieToken) {
        setAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await authAPI.checkAuthStatus();

      if (response.user) {
        setUser(response.user);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
        Cookies.remove("token");
      }
    } catch (error) {
      setUser(null);
      setAuthenticated(false);
      Cookies.remove("token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string) => {
    Cookies.set("token", token, {
      secure: true,
      sameSite: "none",
      expires: 1,
    });

    checkAuth();
  };

  const logout = async () => {
    try {
      await authAPI.signout();
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      Cookies.remove("token", { path: "/", domain: undefined });
      setUser(null);
      setAuthenticated(false);
      router.push("/");
    }
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(() => {
      if (authenticated) {
        checkAuth();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
