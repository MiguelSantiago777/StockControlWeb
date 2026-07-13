import { z } from "zod";

export const supplierSchema = z.object({
  companyName: z.string().min(1, "Informe a razão social").max(200),
  tradeName: z.string().max(200).optional().or(z.literal("")),
  cnpj: z.string().regex(/^\d{14}$/, "CNPJ inválido (14 dígitos)"),
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

export type SupplierFormValues = z.infer<typeof supplierSchema>;
