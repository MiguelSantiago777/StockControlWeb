import { api } from "./api";
import type { AuthResponse, AuthUser, LoginRequest } from "@/types/auth";

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async logout() {
    await api.post("/auth/logout");
  },

  async forgotPassword(email: string) {
    await api.post("/auth/forgot-password", { email });
  },

  async changePassword(currentPassword: string, newPassword: string) {
    await api.post("/auth/change-password", { currentPassword, newPassword });
  },

  async me() {
    const { data } = await api.get<AuthUser>("/auth/me");
    return data;
  },
};
