"use client";

import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { ensureConnected, stopConnection } from "@/lib/signalr";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationsStore } from "@/store/notifications-store";

export function SignalRProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const addNotification = useNotificationsStore((s) => s.add);

  useEffect(() => {
    if (!user) return;

    let active = true;

    ensureConnected()
      .then((hub) => {
        if (!active) return;

        hub.on("Notificacao", (payload: { title: string; message: string }) => {
          addNotification(payload);
          toast.info(payload.title, { description: payload.message });
        });
      })
      .catch(() => {
        // Reconexão automática já configurada no builder
      });

    return () => {
      active = false;
      void stopConnection();
    };
  }, [user, addNotification]);

  return children;
}
