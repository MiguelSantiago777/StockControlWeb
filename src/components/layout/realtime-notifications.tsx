"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSignalREvent } from "@/hooks/use-signalr";
import { useNotificationsStore } from "@/store/notifications-store";

export function RealtimeNotifications() {
  const queryClient = useQueryClient();
  const add = useNotificationsStore((state) => state.add);

  useSignalREvent(
    "DashboardAtualizado",
    useCallback(() => {
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }, [queryClient])
  );

  useSignalREvent<{ productName: string }>(
    "NovaMovimentacao",
    useCallback(
      (payload) => {
        add({ title: "Nova movimentação", description: payload.productName });
        void queryClient.invalidateQueries({ queryKey: ["movements"] });
        void queryClient.invalidateQueries({ queryKey: ["products"] });
      },
      [add, queryClient]
    )
  );

  useSignalREvent<{ orderId: string }>(
    "EntregaIniciada",
    useCallback(
      () => {
        toast.info("Entrega iniciada");
        void queryClient.invalidateQueries({ queryKey: ["orders"] });
      },
      [queryClient]
    )
  );

  useSignalREvent<{ orderId: string }>(
    "EntregaFinalizada",
    useCallback(
      () => {
        toast.success("Entrega finalizada");
        void queryClient.invalidateQueries({ queryKey: ["orders"] });
        void queryClient.invalidateQueries({ queryKey: ["drivers"] });
      },
      [queryClient]
    )
  );

  return null;
}
