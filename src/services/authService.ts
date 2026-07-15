import axiosClient from "../configs/axiosClient";
import type { User } from "../types/auth";

interface AuthResponse {
  user: User;
  accessToken: string;
}

interface RegisterResponse {
  message: string;
  user: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await axiosClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data.user;
    }
    throw new Error("Đăng nhập thất bại!");
  },

  loginWithGoogle: async (accessToken: string): Promise<User> => {
    const response = await axiosClient.post<AuthResponse>(
      "/auth/google-login",
      {
        accessToken,
      },
    );
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data.user;
    }
    throw new Error("Đăng nhập Google thất bại!");
  },

  loginWithFacebook: async (accessToken: string): Promise<User> => {
    const response = await axiosClient.post<AuthResponse>(
      "/auth/facebook-login",
      {
        accessToken,
      },
    );
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data.user;
    }
    throw new Error("Đăng nhập Facebook thất bại!");
  },

  register: async (
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResponse> => {
    const response = await axiosClient.post<RegisterResponse>(
      "/auth/register",
      {
        name,
        email,
        password,
      },
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axiosClient.post("/auth/logout");
    } catch {
      // Ke ca khi request loi, van clear localStorage phia client
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  },
};
