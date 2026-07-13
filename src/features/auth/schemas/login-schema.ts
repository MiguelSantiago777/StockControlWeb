import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
