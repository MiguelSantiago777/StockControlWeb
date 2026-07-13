"use client";

import {
  AlertTriangle,
  Boxes,
  Package,
  PackageX,
  ShoppingCart,
  Truck,
  UserCog,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  useDashboardSummary,
  useOrdersByMonth,
  useStockMovements,
  useTopProducts,
} from "../hooks/use-dashboard";
import { ChartCard } from "./charts";

export function DashboardPage() {
  const summary = useDashboardSummary();
  const ordersByMonth = useOrdersByMonth();
  const stockMovements = useStockMovements();
  const topProducts = useTopProducts();

  const data = summary.data;

  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Produtos" value={data?.totalProducts} icon={Package} isLoading={summary.isLoading} />
        <StatCard
          title="Estoque baixo"
          value={data?.lowStockProducts}
          icon={AlertTriangle}
          isLoading={summary.isLoading}
          tone="warning"
        />
        <StatCard
          title="Em falta"
          value={data?.outOfStockProducts}
          icon={PackageX}
          isLoading={summary.isLoading}
          tone="destructive"
        />
        <StatCard title="Clientes" value={data?.totalCustomers} icon={Users} isLoading={summary.isLoading} />
        <StatCard title="Pedidos" value={data?.totalOrders} icon={ShoppingCart} isLoading={summary.isLoading} />
        <StatCard title="Entregas ativas" value={data?.activeDeliveries} icon={Truck} isLoading={summary.isLoading} />
        <StatCard title="Usuários" value={data?.totalUsers} icon={UserCog} isLoading={summary.isLoading} />
        <StatCard title="Movimentações" value={data?.totalMovements} icon={Boxes} isLoading={summary.isLoading} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Pedidos por mês" data={ordersByMonth.data} isLoading={ordersByMonth.isLoading} type="line" />
        <ChartCard title="Entradas e saídas" data={stockMovements.data} isLoading={stockMovements.isLoading} />
        <ChartCard
          title="Produtos mais vendidos"
          data={
            topProducts.data && {
              labels: topProducts.data.labels,
              datasets: [{ label: "Vendidos", values: topProducts.data.values }],
            }
          }
          isLoading={topProducts.isLoading}
        />
      </div>
    </div>
  );
}
