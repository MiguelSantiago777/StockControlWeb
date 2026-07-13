"use client";

import { useEffect } from "react";
import { ensureConnected, getHubConnection } from "@/lib/signalr";
import { useAuthStore } from "@/store/auth-store";

export function useSignalREvent<T = unknown>(event: string, handler: (payload: T) => void) {
  const isAuthenticated = useAuthStore((state) => Boolean(state.accessToken));

  useEffect(() => {
    if (!isAuthenticated) return;

    const hub = getHubConnection();
    hub.on(event, handler);
    void ensureConnected();

    return () => {
      hub.off(event, handler);
    };
  }, [event, handler, isAuthenticated]);
}
