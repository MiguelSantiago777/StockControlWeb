"use client";

import { useAuthStore } from "@/store/auth-store";
import type { Role } from "@/types/auth";

export function usePermissions() {
  const role = useAuthStore((state) => state.user?.role);

  const hasRole = (...roles: Role[]) => (role ? roles.includes(role) : false);

  return {
    role,
    hasRole,
    isAdmin: role === "Administrador",
    canManageStock: hasRole("Administrador", "Estoquista"),
    canDeliver: hasRole("Administrador", "Entregador"),
    canView: hasRole("Administrador", "Estoquista", "Entregador", "Visualizador"),
  };
}
