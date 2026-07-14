import {
  Boxes,
  Car,
  LayoutDashboard,
  Map,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  UserCog,
  Users,
  Warehouse,
  FileBarChart,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

const ALL: Role[] = ["Administrador", "Estoquista", "Entregador", "Visualizador"];
const STOCK: Role[] = ["Administrador", "Estoquista"];
const ADMIN: Role[] = ["Administrador"];

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ALL },
  { label: "Produtos", href: "/products", icon: Package, roles: [...STOCK, "Visualizador"] },
  { label: "Categorias", href: "/categories", icon: Tags, roles: STOCK },
  { label: "Movimentações", href: "/reports", icon: Boxes, roles: [...STOCK, "Visualizador"] },
  { label: "Pedidos", href: "/orders", icon: ShoppingCart, roles: [...STOCK, "Entregador"] },
  { label: "Clientes", href: "/customers", icon: Users, roles: STOCK },
  { label: "Fornecedores", href: "/suppliers", icon: Warehouse, roles: STOCK },
  { label: "Entregadores", href: "/drivers", icon: Truck, roles: ADMIN },
  { label: "Veículos", href: "/vehicles", icon: Car, roles: STOCK },
  { label: "Mapa", href: "/map", icon: Map, roles: [...STOCK, "Entregador"] },
  { label: "Relatórios", href: "/reports", icon: FileBarChart, roles: [...STOCK, "Visualizador"] },
  { label: "Usuários", href: "/users", icon: UserCog, roles: ADMIN },
  { label: "Configurações", href: "/settings", icon: Settings, roles: ADMIN },
];
