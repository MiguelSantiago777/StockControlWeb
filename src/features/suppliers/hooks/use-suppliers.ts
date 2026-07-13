"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { suppliersService } from "@/services/suppliers";
import type { QueryParams } from "@/types/api";
import type { Address } from "@/types/entities";

const KEY = ["suppliers"];

export interface SupplierPayload {
  companyName: string;
  tradeName?: string;
  cnpj: string;
  email: string;
  phone: string;
  address: Address;
}

export function useSuppliers(params: QueryParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => suppliersService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupplierPayload) => suppliersService.create(payload),
    onSuccess: () => {
      toast.success("Fornecedor criado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SupplierPayload }) =>
      suppliersService.update(id, payload),
    onSuccess: () => {
      toast.success("Fornecedor atualizado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suppliersService.remove(id),
    onSuccess: () => {
      toast.success("Fornecedor excluído");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
    onError: () => {
      toast.error("Não foi possível excluir o fornecedor");
    },
  });
}
