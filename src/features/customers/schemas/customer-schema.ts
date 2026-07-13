import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Informe o nome do cliente").max(200),
  cpf: z.string().regex(/^\d{11}$/, "CPF inválido (11 dígitos)"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().regex(/^\d{10,11}$/, "Telefone inválido (DDD + número)"),
  address: z.object({
    street: z.string().min(1, "Informe o logradouro"),
    number: z.string().min(1, "Informe o número"),
    complement: z.string().optional().or(z.literal("")),
    neighborhood: z.string().min(1, "Informe o bairro"),
    city: z.string().min(1, "Informe a cidade"),
    state: z.string().length(2, "UF inválida (2 letras)"),
    zipCode: z.string().regex(/^\d{8}$/, "CEP inválido (8 dígitos)"),
  }),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
