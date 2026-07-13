import { api } from "./api";
import type { DashboardSummary, MonthlySeries } from "@/features/dashboard/types";

export const dashboardService = {
  async summary() {
    const { data } = await api.get<DashboardSummary>("/dashboard/summary");
    return data;
  },

  async ordersByMonth() {
    const { data } = await api.get<MonthlySeries>("/dashboard/orders-by-month");
    return data;
  },

  async stockMovements() {
    const { data } = await api.get<MonthlySeries>("/dashboard/stock-movements");
    return data;
  },

  async topProducts() {
    const { data } = await api.get<{ labels: string[]; values: number[] }>(
      "/dashboard/top-products"
    );
    return data;
  },
};
