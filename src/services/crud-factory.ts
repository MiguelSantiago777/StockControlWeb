import { api } from "./api";
import type { PagedResult, QueryParams } from "@/types/api";

export function createCrudService<T, TCreate = Partial<T>, TUpdate = TCreate>(resource: string) {
  return {
    async list(params: QueryParams) {
      const { data } = await api.get<PagedResult<T>>(`/${resource}`, { params });
      return data;
    },
    async getById(id: string) {
      const { data } = await api.get<T>(`/${resource}/${id}`);
      return data;
    },
    async create(payload: TCreate) {
      const { data } = await api.post<T>(`/${resource}`, payload);
      return data;
    },
    async update(id: string, payload: TUpdate) {
      const { data } = await api.put<T>(`/${resource}/${id}`, payload);
      return data;
    },
    async remove(id: string) {
      await api.delete(`/${resource}/${id}`);
    },
  };
}
