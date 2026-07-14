import { z } from "zod";

export const vehicleSchema = z.object({
  plate: z.string().regex(/^[A-Za-z]{3}\d{4}$|^[A-Za-z]{3}\d[A-Za-z]\d{2}$/, "Placa inválida (ABC1234 ou ABC1D23)"),
  type: z.enum(["Moto", "Carro", "CaminhaoVan"], { message: "Selecione um tipo" }),
  model: z.string().max(100).optional().or(z.literal("")),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
