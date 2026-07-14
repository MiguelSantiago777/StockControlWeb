"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { vehiclesService } from "@/services/vehicles";
import type { QueryParams } from "@/types/api";
import type { VehicleType } from "@/types/entities";

const KEY = ["vehicles"];

export interface VehiclePayload {
  plate: string;
  type: VehicleType;
  model?: string;
}

export function useVehicles(params: QueryParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => vehiclesService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VehiclePayload) => vehiclesService.create(payload),
    onSuccess: () => {
      toast.success("Veículo criado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Não foi possível criar o veículo";
      toast.error(message);
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VehiclePayload }) =>
      vehiclesService.update(id, payload),
    onSuccess: () => {
      toast.success("Veículo atualizado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Não foi possível atualizar o veículo";
      toast.error(message);
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehiclesService.remove(id),
    onSuccess: () => {
      toast.success("Veículo excluído");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
    onError: () => {
      toast.error("Não foi possível excluir o veículo");
    },
  });
}
