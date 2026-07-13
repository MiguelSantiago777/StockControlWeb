"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { UploadImage } from "@/components/shared/upload-image";
import { categoriesService } from "@/services/categories";
import { suppliersService } from "@/services/suppliers";
import { productsService } from "@/services/products";
import { productSchema, type ProductFormValues } from "../schemas/product-schema";
import { useCreateProduct, useUpdateProduct } from "../hooks/use-products";
import type { Product } from "../types";

interface ProductFormModalProps {
  open: boolean;
  product?: Product;
  onOpenChange: (open: boolean) => void;
}

export function ProductFormModal({ open, product, onOpenChange }: ProductFormModalProps) {
  const isEdit = !!product;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: categories } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: () => categoriesService.list({ pageSize: 100 }),
    enabled: open,
  });

  const { data: suppliers } = useQuery({
    queryKey: ["suppliers", "all"],
    queryFn: () => suppliersService.list({ pageSize: 100 }),
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({ resolver: zodResolver(productSchema) });

  useEffect(() => {
    if (!open) return;
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
        : { name: "", description: "", code: "", barcode: "", price: 0, stock: 0, minStock: 0, categoryId: "", supplierId: "" },
    );
    setImageFile(null);
    setUploadProgress(0);
  }, [open, product, reset]);

  const onSubmit = async (values: ProductFormValues) => {
    const payload = {
      ...values,
      description: values.description || undefined,
      barcode: values.barcode || undefined,
      supplierId: values.supplierId || undefined,
    };

    const saved = isEdit
      ? await updateProduct.mutateAsync({ id: product.id, payload })
      : await createProduct.mutateAsync(payload);

    if (imageFile) {
      await productsService.uploadImage(saved.id, imageFile, setUploadProgress);
    }

    onOpenChange(false);
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar produto" : "Novo produto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nome" htmlFor="name" error={errors.name?.message}>
              <Input id="name" {...register("name")} />
            </FormField>
            <FormField label="Código" htmlFor="code" error={errors.code?.message}>
              <Input id="code" {...register("code")} />
            </FormField>
            <FormField label="Código de barras" htmlFor="barcode" error={errors.barcode?.message}>
              <Input id="barcode" inputMode="numeric" {...register("barcode")} />
            </FormField>
            <FormField label="Preço (R$)" htmlFor="price" error={errors.price?.message}>
              <Input id="price" type="number" step="0.01" min="0" {...register("price")} />
            </FormField>
            <FormField label="Estoque" htmlFor="stock" error={errors.stock?.message}>
              <Input id="stock" type="number" min="0" {...register("stock")} />
            </FormField>
            <FormField label="Estoque mínimo" htmlFor="minStock" error={errors.minStock?.message}>
              <Input id="minStock" type="number" min="0" {...register("minStock")} />
            </FormField>
            <FormField label="Categoria" htmlFor="categoryId" error={errors.categoryId?.message}>
              <select
                id="categoryId"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("categoryId")}
              >
                <option value="">Selecione...</option>
                {categories?.items.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Fornecedor" htmlFor="supplierId" error={errors.supplierId?.message}>
              <select
                id="supplierId"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("supplierId")}
              >
                <option value="">Nenhum</option>
                {suppliers?.items.map((s) => (
                  <option key={s.id} value={s.id}>{s.tradeName ?? s.companyName}</option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Descrição" htmlFor="description" error={errors.description?.message}>
            <textarea
              id="description"
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("description")}
            />
          </FormField>

          <FormField label="Imagem" htmlFor="image">
            <UploadImage currentUrl={product?.imageUrl} progress={uploadProgress} onSelect={setImageFile} />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? "Salvar alterações" : "Criar produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
