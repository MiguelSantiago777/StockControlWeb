import { api } from "./api";
import type { PagedResult, QueryParams } from "@/types/api";
import type { Order } from "@/types/entities";

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customerId: string;
  items: CreateOrderItemPayload[];
}

export const ordersService = {
  async list(params: QueryParams) {
    const { data } = await api.get<PagedResult<Order>>("/orders", { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  },

  async create(payload: CreateOrderPayload) {
    const { data } = await api.post<Order>("/orders", payload);
    return data;
  },

  async startDelivery(id: string, driverId: string, vehicleId: string) {
    const { data } = await api.patch<Order>(`/orders/${id}/start-delivery`, { driverId, vehicleId });
    return data;
  },

  async finishDelivery(id: string) {
    const { data } = await api.patch<Order>(`/orders/${id}/finish-delivery`);
    return data;
  },

  async cancel(id: string) {
    const { data } = await api.patch<Order>(`/orders/${id}/cancel`);
    return data;
  },
};
