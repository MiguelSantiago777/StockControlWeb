"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/shared/form-field";
import { UploadImage } from "@/components/shared/upload-image";
import { categoriesService } from "@/services/categories";
import { productsService } from "@/services/products";
import { productSchema, type ProductFormValues } from "../schemas/product-schema";
import { useCreateProduct, useUpdateProduct } from "../hooks/use-products";
import type { Product } from "../types";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
}

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const isEditing = Boolean(product);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { data: categories } = useQuery({
    queryKey: ["categories", { page: 1, pageSize: 100 }],
    queryFn: () => categoriesService.list({ page: 1, pageSize: 100 }),
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { price: 0, stock: 0, minStock: 0 },
  });

  useEffect(() => {
    if (open) {
      reset(
        product
          ? {
              name: product.name,
              description: product.description ?? "",
              code: product.code,
              barcode: product.barcode ?? "",
              price: product.price,
              stock: product.stock,
              minStock: product.minStock,
              categoryId: product.categoryId,
              supplierId: product.supplierId ?? "",
            }
          : { name: "", description: "", code: "", barcode: "", price: 0, stock: 0, minStock: 0, categoryId: "", supplierId: "" }
      );
      setImageFile(null);
      setUploadProgress(undefined);
    }
  }, [open, product, reset]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: ProductFormValues) {
    const payload = {
      ...values,
      description: values.description || undefined,
      barcode: values.barcode || undefined,
      supplierId: values.supplierId || undefined,
    };

    const saved = isEditing
      ? await updateMutation.mutateAsync({ id: product!.id, payload })
      : await createMutation.mutateAsync(payload);

    if (imageFile) {
      await productsService.uploadImage(saved.id, imageFile, setUploadProgress);
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar produto" : "Novo produto"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do produto."
              : "Preencha os dados para cadastrar um novo produto."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <UploadImage
              value={product?.imageUrl}
              progress={uploadProgress}
              onSelect={setImageFile}
              onClear={() => setImageFile(null)}
            />
            <div className="flex-1 space-y-4">
              <FormField label="Nome" htmlFor="name" error={errors.name?.message}>
                <Input id="name" {...register("name")} autoFocus />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Código" htmlFor="code" error={errors.code?.message}>
                  <Input id="code" {...register("code")} />
                </FormField>
                <FormField label="Código de barras" htmlFor="barcode" error={errors.barcode?.message}>
                  <Input id="barcode" inputMode="numeric" {...register("barcode")} />
                </FormField>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Preço (R$)" htmlFor="price" error={errors.price?.message}>
              <Input id="price" type="number" step="0.01" min="0" {...register("price")} />
            </FormField>
            <FormField label="Estoque" htmlFor="stock" error={errors.stock?.message}>
              <Input id="stock" type="number" min="0" {...register("stock")} />
            </FormField>
            <FormField label="Estoque mínimo" htmlFor="minStock" error={errors.minStock?.message}>
              <Input id="minStock" type="number" min="0" {...register("minStock")} />
            </FormField>
          </div>

          <FormField label="Categoria" htmlFor="categoryId" error={errors.categoryId?.message}>
            <Select
              value={watch("categoryId")}
              onValueChange={(value) => setValue("categoryId", value, { shouldValidate: true })}
            >
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories?.items.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              {isEditing ? "Salvar alterações" : "Criar produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
