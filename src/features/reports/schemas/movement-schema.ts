import { z } from "zod";

export const movementSchema = z.object({
  productId: z.string().uuid("Selecione um produto"),
  type: z.enum(["Entrada", "Saida", "Ajuste", "Devolucao", "Perda"], { message: "Selecione um tipo" }),
  quantity: z.coerce.number().int().min(1, "A quantidade deve ser maior que zero"),
  note: z.string().max(500).optional().or(z.literal("")),
});

export type MovementFormValues = z.infer<typeof movementSchema>;
