"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { customersService } from "@/services/customers";
import type { QueryParams } from "@/types/api";
import type { Address } from "@/types/entities";

const KEY = ["customers"];

export interface CustomerPayload {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: Address;
}

export function useCustomers(params: QueryParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => customersService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CustomerPayload) => customersService.create(payload),
    onSuccess: () => {
      toast.success("Cliente criado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CustomerPayload }) =>
      customersService.update(id, payload),
    onSuccess: () => {
      toast.success("Cliente atualizado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customersService.remove(id),
    onSuccess: () => {
      toast.success("Cliente excluído");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
    onError: () => {
      toast.error("Não foi possível excluir o cliente");
    },
  });
}
