"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { productsService } from "@/services/products";
import { movementSchema, type MovementFormValues } from "../schemas/movement-schema";
import { useCreateMovement } from "../hooks/use-movements";

interface MovementFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TYPE_LABEL: Record<MovementFormValues["type"], string> = {
  Entrada: "Entrada",
  Saida: "Saída",
  Ajuste: "Ajuste",
  Devolucao: "Devolução",
  Perda: "Perda",
};

export function MovementFormModal({ open, onOpenChange }: MovementFormModalProps) {
  const createMovement = useCreateMovement();

  const { data: products } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productsService.list({ pageSize: 100 }),
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MovementFormValues>({ resolver: zodResolver(movementSchema) });

  useEffect(() => {
    if (!open) return;
    reset({ productId: "", type: "Entrada", quantity: 1, note: "" });
  }, [open, reset]);

  const onSubmit = async (values: MovementFormValues) => {
    await createMovement.mutateAsync({ ...values, note: values.note || undefined });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova movimentação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Produto" htmlFor="productId" error={errors.productId?.message}>
            <select
              id="productId"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("productId")}
            >
              <option value="">Selecione...</option>
              {products?.items.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Tipo" htmlFor="type" error={errors.type?.message}>
            <select
              id="type"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("type")}
            >
              {(Object.keys(TYPE_LABEL) as MovementFormValues["type"][]).map((type) => (
                <option key={type} value={type}>{TYPE_LABEL[type]}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Quantidade" htmlFor="quantity" error={errors.quantity?.message}>
            <Input id="quantity" type="number" min="1" {...register("quantity")} />
          </FormField>

          <FormField label="Observação" htmlFor="note" error={errors.note?.message}>
            <textarea
              id="note"
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("note")}
            />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createMovement.isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={createMovement.isPending}>
              Registrar movimentação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
