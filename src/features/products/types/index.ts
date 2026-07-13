export interface Product {
  id: string;
  name: string;
  description?: string;
  code: string;
  barcode?: string;
  price: number;
  stock: number;
  minStock: number;
  categoryId: string;
  categoryName?: string;
  supplierId?: string;
  supplierName?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  code: string;
  barcode?: string;
  price: number;
  stock: number;
  minStock: number;
  categoryId: string;
  supplierId?: string;
}

export type UpdateProductPayload = CreateProductPayload;
