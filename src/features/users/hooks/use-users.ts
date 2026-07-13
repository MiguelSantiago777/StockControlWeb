"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { usersService } from "@/services/users";
import type { QueryParams } from "@/types/api";
import type { Role } from "@/types/auth";

const KEY = ["users"];

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserPayload {
  name: string;
  email: string;
  role: Role;
}

export function useUsers(params: QueryParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => usersService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersService.create(payload),
    onSuccess: () => {
      toast.success("Usuário criado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      usersService.update(id, payload),
    onSuccess: () => {
      toast.success("Usuário atualizado");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      toast.success("Usuário excluído");
      void queryClient.invalidateQueries({ queryKey: KEY });
    },
    onError: () => {
      toast.error("Não foi possível excluir o usuário");
    },
  });
}
