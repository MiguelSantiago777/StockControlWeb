"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { driversService } from "@/services/drivers";
import type { QueryParams } from "@/types/api";
import type { Driver } from "@/types/entities";

const KEY = ["drivers"];

export interface CreateDriverPayload {
  name: string;
  cpf: string;
  phone: string;
  userId: string;
}

export interface UpdateDriverPayload {
  name: string;
  phone: string;
}

export function useDrivers(params: QueryParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => driversService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useEligibleDriverUsers(enabled: boolean) {
  return useQuery({
    queryKey: ["drivers", "eligible-users"],
    queryFn: () => driversService.eligibleUsers(),
    enabled,
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDriverPayload) => driversService.create(payload),
    onSuccess: () => {
      toast.success("Entregador criado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDriverPayload }) =>
      driversService.update(id, payload),
    onSuccess: () => {
      toast.success("Entregador atualizado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Driver["status"] }) =>
      driversService.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Status atualizado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => driversService.remove(id),
    onSuccess: () => {
      toast.success("Entregador excluído");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
    onError: () => {
      toast.error("Não foi possível excluir o entregador");
    },
  });
}
