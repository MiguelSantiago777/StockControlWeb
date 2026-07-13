"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  movementsService,
  type CreateMovementPayload,
  type MovementFilters,
} from "@/services/movements";

const KEY = ["movements"];

export function useMovements(params: MovementFilters) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => movementsService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMovementPayload) => movementsService.create(payload),
    onSuccess: () => {
      toast.success("Movimentação registrada");
      void queryClient.invalidateQueries({ queryKey: KEY });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Não foi possível registrar a movimentação";
      toast.error(message);
    },
  });
}

export function useExportMovementsCsv() {
  return useMutation({
    mutationFn: (params?: MovementFilters) => movementsService.exportCsv(params),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `movimentacoes_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    },
    onError: () => {
      toast.error("Não foi possível exportar as movimentações");
    },
  });
}
