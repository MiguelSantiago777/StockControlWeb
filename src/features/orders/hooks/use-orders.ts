"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ordersService, type CreateOrderPayload } from "@/services/orders";
import type { QueryParams } from "@/types/api";

const KEY = ["orders"];

function errorMessage(error: unknown, fallback: string) {
  return (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? fallback;
}

export function useOrders(params: QueryParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => ordersService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersService.create(payload),
    onSuccess: () => {
      toast.success("Pedido criado");
      void queryClient.invalidateQueries({ queryKey: KEY });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => toast.error(errorMessage(error, "Não foi possível criar o pedido")),
  });
}

export function useStartDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, driverId, vehicleId }: { id: string; driverId: string; vehicleId: string }) =>
      ordersService.startDelivery(id, driverId, vehicleId),
    onSuccess: () => {
      toast.success("Entrega iniciada");
      void queryClient.invalidateQueries({ queryKey: KEY });
      void queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
    onError: (error) => toast.error(errorMessage(error, "Não foi possível iniciar a entrega")),
  });
}

export function useFinishDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersService.finishDelivery(id),
    onSuccess: () => {
      toast.success("Entrega finalizada");
      void queryClient.invalidateQueries({ queryKey: KEY });
      void queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
    onError: (error) => toast.error(errorMessage(error, "Não foi possível finalizar a entrega")),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersService.cancel(id),
    onSuccess: () => {
      toast.success("Pedido cancelado");
      void queryClient.invalidateQueries({ queryKey: KEY });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => toast.error(errorMessage(error, "Não foi possível cancelar o pedido")),
  });
}
