"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { productsService } from "@/services/products";
import type { QueryParams } from "@/types/api";
import type { CreateProductPayload, UpdateProductPayload } from "../types";

const KEY = ["products"];

export function useProducts(params: QueryParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => productsService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: [...KEY, id],
    queryFn: () => productsService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsService.create(payload),
    onSuccess: () => {
      toast.success("Produto criado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      productsService.update(id, payload),
    onSuccess: () => {
      toast.success("Produto atualizado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.remove(id),
    onSuccess: () => {
      toast.success("Produto excluído");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
    onError: () => {
      toast.error("Não foi possível excluir o produto");
    },
  });
}
