"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { authService } from "@/services/auth";
import { refreshAccessToken } from "@/services/api";
import { useAuthStore } from "@/store/auth-store";
import { FullPageLoading } from "@/components/shared/loading";

/**
 * useState(false) + a bare useEffect only tells you "we're past first mount",
 * not "zustand/persist finished reading localStorage" — those can resolve in
 * either order, and when the effect wins the race, accessToken reads back
 * null even though a valid session exists, which sent people to /login for
 * no reason. This waits for persist's own hydration signal instead.
 */
function useAuthHydrated() {
  // persist's own hydration API only exists client-side (it reads
  // localStorage); this component still gets server-rendered for the first
  // paint, where `.persist` isn't available at all — reading it there would
  // crash the SSR pass with a 500 rather than just showing the loading state.
  const [hydrated, setHydrated] = useState(
    () => typeof window !== "undefined" && useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!hydrated) return;

    if (accessToken) {
      setChecking(false);
      return;
    }

    // No access token in the persisted store (cleared, expired, or never set
    // on this device) — try to recover the session before giving up. Refresh
    // explicitly first: the response interceptor deliberately never retries
    // "/auth/*" routes (to avoid recursing after a failed login/refresh), so
    // calling /auth/me straight away would just 401 once and stop, even if a
    // valid refreshToken could have gotten it a new access token.
    let active = true;
    refreshAccessToken()
      .then(() => authService.me())
      .then((user) => {
        if (active) setUser(user);
      })
      .catch(() => {
        if (active) router.replace("/login");
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [hydrated, accessToken, router, setUser]);

  if (!hydrated || checking || !accessToken) {
    return <FullPageLoading />;
  }

  return <>{children}</>;
}
