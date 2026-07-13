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
import { customerSchema, type CustomerFormValues } from "../schemas/customer-schema";
import { useCreateCustomer, useUpdateCustomer } from "../hooks/use-customers";
import type { Customer } from "@/types/entities";

interface CustomerFormModalProps {
  open: boolean;
  customer?: Customer;
  onOpenChange: (open: boolean) => void;
}

export function CustomerFormModal({ open, customer, onOpenChange }: CustomerFormModalProps) {
  const isEdit = !!customer;
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({ resolver: zodResolver(customerSchema) });

  useEffect(() => {
    if (!open) return;
    reset(
      customer
        ? {
            name: customer.name,
            cpf: customer.cpf,
            email: customer.email,
            phone: customer.phone,
            address: {
              street: customer.address.street,
              number: customer.address.number,
              complement: customer.address.complement ?? "",
              neighborhood: customer.address.neighborhood,
              city: customer.address.city,
              state: customer.address.state,
              zipCode: customer.address.zipCode,
            },
          }
        : {
            name: "",
            cpf: "",
            email: "",
            phone: "",
            address: { street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "" },
          },
    );
  }, [open, customer, reset]);

  const onSubmit = async (values: CustomerFormValues) => {
    const payload = {
      ...values,
      address: { ...values.address, complement: values.address.complement || undefined },
    };

    if (isEdit) {
      await updateCustomer.mutateAsync({ id: customer.id, payload });
    } else {
      await createCustomer.mutateAsync(payload);
    }

    onOpenChange(false);
  };

  const isPending = createCustomer.isPending || updateCustomer.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar cliente" : "Novo cliente"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nome" htmlFor="name" error={errors.name?.message}>
              <Input id="name" {...register("name")} />
            </FormField>
            <FormField label="CPF" htmlFor="cpf" error={errors.cpf?.message}>
              <Input id="cpf" inputMode="numeric" placeholder="Somente números" {...register("cpf")} />
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
              {isEdit ? "Salvar alterações" : "Criar cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
