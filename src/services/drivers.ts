import { api } from "./api";
import { createCrudService } from "./crud-factory";
import type { Driver } from "@/types/entities";

export interface EligibleUser {
  id: string;
  name: string;
  email: string;
}

export const driversService = {
  ...createCrudService<Driver>("drivers"),

  async updateStatus(id: string, status: Driver["status"]) {
    const { data } = await api.patch<Driver>(`/drivers/${id}/status`, { status });
    return data;
  },

  async eligibleUsers() {
    const { data } = await api.get<EligibleUser[]>("/drivers/eligible-users");
    return data;
  },
};
