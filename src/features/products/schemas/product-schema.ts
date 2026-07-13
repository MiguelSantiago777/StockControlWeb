import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Informe o nome do produto").max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
  code: z
    .string()
    .min(3, "O código deve ter pelo menos 3 caracteres")
    .max(30, "O código deve ter no máximo 30 caracteres"),
  barcode: z
    .string()
    .regex(/^\d{8}$|^\d{13}$|^\d{14}$/, "Código de barras inválido (EAN-8, EAN-13 ou ITF-14)")
    .optional()
    .or(z.literal("")),
  price: z.coerce.number().min(0, "O preço não pode ser negativo"),
  stock: z.coerce.number().int().min(0, "O estoque não pode ser negativo"),
  minStock: z.coerce.number().int().min(0, "O estoque mínimo não pode ser negativo"),
  categoryId: z.string().uuid("Selecione uma categoria"),
  supplierId: z.string().uuid().optional().or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof productSchema>;
