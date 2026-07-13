import { api } from "./api";
import type { PagedResult, QueryParams } from "@/types/api";
import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "@/features/products/types";

export const productsService = {
  async list(params: QueryParams) {
    const { data } = await api.get<PagedResult<Product>>("/products", { params });
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  async create(payload: CreateProductPayload) {
    const { data } = await api.post<Product>("/products", payload);
    return data;
  },

  async update(id: string, payload: UpdateProductPayload) {
    const { data } = await api.put<Product>(`/products/${id}`, payload);
    return data;
  },

  async remove(id: string) {
    await api.delete(`/products/${id}`);
  },

  async uploadImage(id: string, file: File, onProgress?: (percent: number) => void) {
    const form = new FormData();
    form.append("file", file);

    const { data } = await api.post<{ url: string }>(`/products/${id}/image`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });
    return data;
  },
};
