"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.summary,
  });
}

export function useOrdersByMonth() {
  return useQuery({
    queryKey: ["dashboard", "orders-by-month"],
    queryFn: dashboardService.ordersByMonth,
  });
}

export function useStockMovements() {
  return useQuery({
    queryKey: ["dashboard", "stock-movements"],
    queryFn: dashboardService.stockMovements,
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: ["dashboard", "top-products"],
    queryFn: dashboardService.topProducts,
  });
}
