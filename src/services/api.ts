import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";
import type { AuthResponse } from "@/types/auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    const isAuthRoute = original.url?.includes("/auth/");

    if (error.response?.status === 401 && !original._retry && !isAuthRoute && refreshToken) {
      original._retry = true;

      try {
        refreshPromise ??= axios
          .post<AuthResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken },
            { withCredentials: true }
          )
          .then(({ data }) => {
            setTokens(data.accessToken, data.refreshToken);
            return data.accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });

        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
