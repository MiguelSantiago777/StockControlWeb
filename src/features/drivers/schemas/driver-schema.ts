import { z } from "zod";

export function driverSchema(isEdit: boolean) {
  return z.object({
    name: z.string().min(1, "Informe o nome do entregador").max(200),
    cpf: isEdit
      ? z.string().optional().or(z.literal(""))
      : z.string().regex(/^\d{11}$/, "CPF inválido (11 dígitos)"),
    phone: z.string().regex(/^\d{10,11}$/, "Telefone inválido (DDD + número)"),
    userId: isEdit
      ? z.string().optional().or(z.literal(""))
      : z.string().uuid("Selecione o usuário vinculado"),
  });
}

export type DriverFormValues = z.infer<ReturnType<typeof driverSchema>>;
