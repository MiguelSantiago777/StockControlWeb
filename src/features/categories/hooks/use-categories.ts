"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { categoriesService } from "@/services/categories";
import type { QueryParams } from "@/types/api";

const KEY = ["categories"];

export interface CategoryPayload {
  name: string;
  description?: string;
}

export function useCategories(params: QueryParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => categoriesService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryPayload) => categoriesService.create(payload),
    onSuccess: () => {
      toast.success("Categoria criada");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryPayload }) =>
      categoriesService.update(id, payload),
    onSuccess: () => {
      toast.success("Categoria atualizada");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.remove(id),
    onSuccess: () => {
      toast.success("Categoria excluída");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
    onError: () => {
      toast.error("Não foi possível excluir a categoria");
    },
  });
}
