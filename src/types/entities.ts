import type { Role } from "./auth";

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Customer {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: Address;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  companyName: string;
  tradeName?: string;
  cnpj: string;
  email: string;
  phone: string;
  address: Address;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  isActive: boolean;
}

export type OrderStatus =
  | "Criado"
  | "EmSeparacao"
  | "AguardandoEntrega"
  | "EmEntrega"
  | "Finalizado"
  | "Cancelado";

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  driverId?: string;
  driverName?: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

export type DriverStatus = "Disponivel" | "EmEntrega" | "Indisponivel";

export interface Driver {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  userId: string;
  vehicle?: string;
  photoUrl?: string;
  status: DriverStatus;
  lastPosition?: { latitude: number; longitude: number };
  positionUpdatedAt?: string;
  speed?: number;
  isActive: boolean;
}

export type MovementType = "Entrada" | "Saida" | "Ajuste" | "Devolucao" | "Perda";

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  userName: string;
  createdAt: string;
}
