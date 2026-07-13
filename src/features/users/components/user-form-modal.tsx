"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { userSchema, type UserFormValues } from "../schemas/user-schema";
import { useCreateUser, useUpdateUser } from "../hooks/use-users";
import type { User } from "@/types/entities";

interface UserFormModalProps {
  open: boolean;
  user?: User;
  onOpenChange: (open: boolean) => void;
}

export function UserFormModal({ open, user, onOpenChange }: UserFormModalProps) {
  const isEdit = !!user;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({ resolver: zodResolver(userSchema(isEdit)) });

  useEffect(() => {
    if (!open) return;
    reset(
      user
        ? { name: user.name, email: user.email, password: "", role: user.role }
        : { name: "", email: "", password: "", role: "Visualizador" },
    );
  }, [open, user, reset]);

  const onSubmit = async (values: UserFormValues) => {
    if (isEdit) {
      await updateUser.mutateAsync({
        id: user.id,
        payload: { name: values.name, email: values.email, role: values.role },
      });
    } else {
      await createUser.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password ?? "",
        role: values.role,
      });
    }

    onOpenChange(false);
  };

  const isPending = createUser.isPending || updateUser.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar usuário" : "Novo usuário"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Nome" htmlFor="name" error={errors.name?.message}>
            <Input id="name" {...register("name")} />
          </FormField>

          <FormField label="E-mail" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register("email")} />
          </FormField>

          {!isEdit && (
            <FormField label="Senha" htmlFor="password" error={errors.password?.message}>
              <Input id="password" type="password" {...register("password")} />
            </FormField>
          )}

          <FormField label="Perfil" htmlFor="role" error={errors.role?.message}>
            <select
              id="role"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("role")}
            >
              <option value="Administrador">Administrador</option>
              <option value="Estoquista">Estoquista</option>
              <option value="Entregador">Entregador</option>
              <option value="Visualizador">Visualizador</option>
            </select>
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? "Salvar alterações" : "Criar usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
