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
import { driverSchema, type DriverFormValues } from "../schemas/driver-schema";
import { useCreateDriver, useEligibleDriverUsers, useUpdateDriver } from "../hooks/use-drivers";
import type { Driver } from "@/types/entities";

interface DriverFormModalProps {
  open: boolean;
  driver?: Driver;
  onOpenChange: (open: boolean) => void;
}

export function DriverFormModal({ open, driver, onOpenChange }: DriverFormModalProps) {
  const isEdit = !!driver;
  const createDriver = useCreateDriver();
  const updateDriver = useUpdateDriver();
  const { data: eligibleUsers } = useEligibleDriverUsers(open && !isEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverFormValues>({ resolver: zodResolver(driverSchema(isEdit)) });

  useEffect(() => {
    if (!open) return;
    reset(
      driver
        ? { name: driver.name, cpf: "", phone: driver.phone, userId: "" }
        : { name: "", cpf: "", phone: "", userId: "" },
    );
  }, [open, driver, reset]);

  const onSubmit = async (values: DriverFormValues) => {
    if (isEdit) {
      await updateDriver.mutateAsync({ id: driver.id, payload: { name: values.name, phone: values.phone } });
    } else {
      await createDriver.mutateAsync({
        name: values.name,
        cpf: values.cpf ?? "",
        phone: values.phone,
        userId: values.userId ?? "",
      });
    }

    onOpenChange(false);
  };

  const isPending = createDriver.isPending || updateDriver.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar entregador" : "Novo entregador"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Nome" htmlFor="name" error={errors.name?.message}>
            <Input id="name" {...register("name")} />
          </FormField>

          {!isEdit && (
            <>
              <FormField label="CPF" htmlFor="cpf" error={errors.cpf?.message}>
                <Input id="cpf" inputMode="numeric" placeholder="Somente números" {...register("cpf")} />
              </FormField>

              <FormField label="Usuário vinculado" htmlFor="userId" error={errors.userId?.message}>
                <select
                  id="userId"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...register("userId")}
                >
                  <option value="">Selecione...</option>
                  {eligibleUsers?.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
                {eligibleUsers?.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Nenhum usuário com perfil Entregador disponível. Crie um em Usuários primeiro.
                  </p>
                )}
              </FormField>
            </>
          )}

          <FormField label="Telefone" htmlFor="phone" error={errors.phone?.message}>
            <Input id="phone" inputMode="numeric" placeholder="DDD + número" {...register("phone")} />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? "Salvar alterações" : "Criar entregador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
