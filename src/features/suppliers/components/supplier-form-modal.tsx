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
import { supplierSchema, type SupplierFormValues } from "../schemas/supplier-schema";
import { useCreateSupplier, useUpdateSupplier } from "../hooks/use-suppliers";
import type { Supplier } from "@/types/entities";

interface SupplierFormModalProps {
  open: boolean;
  supplier?: Supplier;
  onOpenChange: (open: boolean) => void;
}

export function SupplierFormModal({ open, supplier, onOpenChange }: SupplierFormModalProps) {
  const isEdit = !!supplier;
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({ resolver: zodResolver(supplierSchema) });

  useEffect(() => {
    if (!open) return;
    reset(
      supplier
        ? {
            companyName: supplier.companyName,
            tradeName: supplier.tradeName ?? "",
            cnpj: supplier.cnpj,
            email: supplier.email,
            phone: supplier.phone,
            address: {
              street: supplier.address.street,
              number: supplier.address.number,
              complement: supplier.address.complement ?? "",
              neighborhood: supplier.address.neighborhood,
              city: supplier.address.city,
              state: supplier.address.state,
              zipCode: supplier.address.zipCode,
            },
          }
        : {
            companyName: "",
            tradeName: "",
            cnpj: "",
            email: "",
            phone: "",
            address: { street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "" },
          },
    );
  }, [open, supplier, reset]);

  const onSubmit = async (values: SupplierFormValues) => {
    const payload = {
      ...values,
      tradeName: values.tradeName || undefined,
      address: { ...values.address, complement: values.address.complement || undefined },
    };

    if (isEdit) {
      await updateSupplier.mutateAsync({ id: supplier.id, payload });
    } else {
      await createSupplier.mutateAsync(payload);
    }

    onOpenChange(false);
  };

  const isPending = createSupplier.isPending || updateSupplier.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar fornecedor" : "Novo fornecedor"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Razão social" htmlFor="companyName" error={errors.companyName?.message}>
              <Input id="companyName" {...register("companyName")} />
            </FormField>
            <FormField label="Nome fantasia" htmlFor="tradeName" error={errors.tradeName?.message}>
              <Input id="tradeName" {...register("tradeName")} />
            </FormField>
            <FormField label="CNPJ" htmlFor="cnpj" error={errors.cnpj?.message}>
              <Input id="cnpj" inputMode="numeric" placeholder="Somente números" {...register("cnpj")} />
            </FormField>
            <FormField label="Telefone" htmlFor="phone" error={errors.phone?.message}>
              <Input id="phone" inputMode="numeric" placeholder="DDD + número" {...register("phone")} />
            </FormField>
            <FormField label="E-mail" htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" {...register("email")} />
            </FormField>
          </div>

          <div className="border-t pt-4">
            <p className="mb-3 text-sm font-medium">Endereço</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Logradouro" htmlFor="address.street" error={errors.address?.street?.message}>
                <Input id="address.street" {...register("address.street")} />
              </FormField>
              <FormField label="Número" htmlFor="address.number" error={errors.address?.number?.message}>
                <Input id="address.number" {...register("address.number")} />
              </FormField>
              <FormField label="Complemento" htmlFor="address.complement" error={errors.address?.complement?.message}>
                <Input id="address.complement" {...register("address.complement")} />
              </FormField>
              <FormField label="Bairro" htmlFor="address.neighborhood" error={errors.address?.neighborhood?.message}>
                <Input id="address.neighborhood" {...register("address.neighborhood")} />
              </FormField>
              <FormField label="Cidade" htmlFor="address.city" error={errors.address?.city?.message}>
                <Input id="address.city" {...register("address.city")} />
              </FormField>
              <FormField label="UF" htmlFor="address.state" error={errors.address?.state?.message}>
                <Input id="address.state" maxLength={2} className="uppercase" {...register("address.state")} />
              </FormField>
              <FormField label="CEP" htmlFor="address.zipCode" error={errors.address?.zipCode?.message}>
                <Input id="address.zipCode" inputMode="numeric" placeholder="Somente números" {...register("address.zipCode")} />
              </FormField>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? "Salvar alterações" : "Criar fornecedor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
