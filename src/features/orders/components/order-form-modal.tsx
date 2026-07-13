"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { customersService } from "@/services/customers";
import { productsService } from "@/services/products";
import { formatCurrency } from "@/lib/utils";
import { orderSchema, type OrderFormValues } from "../schemas/order-schema";
import { useCreateOrder } from "../hooks/use-orders";

interface OrderFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderFormModal({ open, onOpenChange }: OrderFormModalProps) {
  const createOrder = useCreateOrder();

  const { data: customers } = useQuery({
    queryKey: ["customers", "all"],
    queryFn: () => customersService.list({ pageSize: 100 }),
    enabled: open,
  });

  const { data: products } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productsService.list({ pageSize: 100 }),
    enabled: open,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { customerId: "", items: [{ productId: "", quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");

  useEffect(() => {
    if (!open) return;
    reset({ customerId: "", items: [{ productId: "", quantity: 1 }] });
  }, [open, reset]);

  const total = items?.reduce((sum, item) => {
    const product = products?.items.find((p) => p.id === item.productId);
    return sum + (product?.price ?? 0) * (item.quantity || 0);
  }, 0) ?? 0;

  const onSubmit = async (values: OrderFormValues) => {
    await createOrder.mutateAsync(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo pedido</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Cliente" htmlFor="customerId" error={errors.customerId?.message}>
            <select
              id="customerId"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("customerId")}
            >
              <option value="">Selecione...</option>
              {customers?.items.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </FormField>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Itens</p>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: "", quantity: 1 })}>
                <Plus className="h-3.5 w-3.5" /> Adicionar item
              </Button>
            </div>

            {errors.items?.root?.message && (
              <p className="text-xs text-destructive" role="alert">{errors.items.root.message}</p>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...register(`items.${index}.productId`)}
                  >
                    <option value="">Selecione um produto...</option>
                    {products?.items.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price)}</option>
                    ))}
                  </select>
                  {errors.items?.[index]?.productId && (
                    <p className="mt-1 text-xs text-destructive">{errors.items[index]?.productId?.message}</p>
                  )}
                </div>
                <div className="w-24">
                  <Input type="number" min="1" placeholder="Qtd." {...register(`items.${index}.quantity`)} />
                  {errors.items?.[index]?.quantity && (
                    <p className="mt-1 text-xs text-destructive">{errors.items[index]?.quantity?.message}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                  aria-label="Remover item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end border-t pt-3 text-sm">
            <span className="text-muted-foreground">Total:&nbsp;</span>
            <span className="font-medium tabular-nums">{formatCurrency(total)}</span>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createOrder.isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={createOrder.isPending}>
              Criar pedido
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
