import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";
import type { AuthResponse } from "@/types/auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

/** Shared by the response interceptor below and by the SignalR client, so both refresh at most once concurrently. */
export function refreshAccessToken(): Promise<string> {
  const { refreshToken, setTokens, logout } = useAuthStore.getState();
  if (!refreshToken) {
    return Promise.reject(new Error("Sem refresh token."));
  }

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
    .catch((error) => {
      logout();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

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
    const isAuthRoute = original.url?.includes("/auth/");

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true;

      try {
        const newToken = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
