import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Informe o nome da categoria").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
