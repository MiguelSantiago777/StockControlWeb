import { api } from "./api";
import type { PagedResult, QueryParams } from "@/types/api";

export type MovementType = "Entrada" | "Saida" | "Ajuste" | "Devolucao" | "Perda";

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  userName: string;
  note?: string;
  createdAt: string;
}

export interface MovementFilters extends QueryParams {
  type?: MovementType;
  productId?: string;
  from?: string;
  to?: string;
}

export interface CreateMovementPayload {
  productId: string;
  type: MovementType;
  quantity: number;
  note?: string;
}

export const movementsService = {
  async list(params?: MovementFilters): Promise<PagedResult<Movement>> {
    const { data } = await api.get<PagedResult<Movement>>("/movements", { params });
    return data;
  },

  async create(payload: CreateMovementPayload): Promise<Movement> {
    const { data } = await api.post<Movement>("/movements", payload);
    return data;
  },

  async exportCsv(params?: MovementFilters): Promise<Blob> {
    const { data } = await api.get("/movements/export", { params, responseType: "blob" });
    return data;
  },
};
