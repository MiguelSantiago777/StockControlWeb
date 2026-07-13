export interface DashboardSummary {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalCustomers: number;
  totalOrders: number;
  activeDeliveries: number;
  totalUsers: number;
  totalMovements: number;
}

export interface MonthlySeries {
  labels: string[];
  datasets: { label: string; values: number[] }[];
}
