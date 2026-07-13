"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";
import { tokenStorage } from "@/lib/token-storage";

const PUBLIC_ROUTES = ["/login", "/forgot-password"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    if (user || PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
      setLoading(false);
      return;
    }

    authService
      .me()
      .then(setUser)
      .catch(() => {
        tokenStorage.clear();
        setUser(null);
      });
  }, [user, pathname, setUser, setLoading]);

  return children;
}
