import { z } from "zod";

export const orderSchema = z.object({
  customerId: z.string().uuid("Selecione um cliente"),
  items: z
    .array(
      z.object({
        productId: z.string().uuid("Selecione um produto"),
        quantity: z.coerce.number().int().min(1, "Quantidade mínima é 1"),
      }),
    )
    .min(1, "Adicione ao menos um item"),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
