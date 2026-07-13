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
import { categorySchema, type CategoryFormValues } from "../schemas/category-schema";
import { useCreateCategory, useUpdateCategory } from "../hooks/use-categories";
import type { Category } from "@/types/entities";

interface CategoryFormModalProps {
  open: boolean;
  category?: Category;
  onOpenChange: (open: boolean) => void;
}

export function CategoryFormModal({ open, category, onOpenChange }: CategoryFormModalProps) {
  const isEdit = !!category;
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  useEffect(() => {
    if (!open) return;
    reset(
      category
        ? { name: category.name, description: category.description ?? "" }
        : { name: "", description: "" },
    );
  }, [open, category, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    const payload = { ...values, description: values.description || undefined };

    if (isEdit) {
      await updateCategory.mutateAsync({ id: category.id, payload });
    } else {
      await createCategory.mutateAsync(payload);
    }

    onOpenChange(false);
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Nome" htmlFor="name" error={errors.name?.message}>
            <Input id="name" {...register("name")} />
          </FormField>

          <FormField label="Descrição" htmlFor="description" error={errors.description?.message}>
            <textarea
              id="description"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("description")}
            />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? "Salvar alterações" : "Criar categoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
