import { z } from "zod";

const ROLES = ["Administrador", "Estoquista", "Entregador", "Visualizador"] as const;

export function userSchema(isEdit: boolean) {
  return z.object({
    name: z.string().min(1, "Informe o nome").max(200),
    email: z.string().email("E-mail inválido"),
    password: isEdit
      ? z.string().optional().or(z.literal(""))
      : z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    role: z.enum(ROLES, { message: "Selecione um perfil" }),
  });
}

export type UserFormValues = z.infer<ReturnType<typeof userSchema>>;
