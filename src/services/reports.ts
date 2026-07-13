import { api } from "./api";
import type { QueryParams } from "@/types/api";

export const reportsService = {
  async exportMovements(params: QueryParams) {
    const { data } = await api.get<Blob>("/reports/movements/export", {
      params,
      responseType: "blob",
    });
    return data;
  },
};
