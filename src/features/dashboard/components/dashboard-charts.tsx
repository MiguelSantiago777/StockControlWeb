"use client";

import {
  ArcElement, BarElement, CategoryScale, Chart as ChartJS,
  Legend, LinearScale, LineElement, PointElement, Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardCharts } from "../hooks/use-dashboard";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

const PRIMARY = "hsl(199 84% 40%)";
const ACCENT = "hsl(173 58% 39%)";
const DESTRUCTIVE = "hsl(0 72% 50%)";

export function DashboardCharts() {
  const { data, isLoading } = useDashboardCharts();

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Produtos mais vendidos</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <Bar
            data={{
              labels: data.topSellingProducts.map((p) => p.label),
              datasets: [{ label: "Vendas", data: data.topSellingProducts.map((p) => p.value), backgroundColor: PRIMARY }],
            }}
            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entradas e saídas</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <Line
            data={{
              labels: data.stockIn.map((p) => p.label),
              datasets: [
                { label: "Entradas", data: data.stockIn.map((p) => p.value), borderColor: ACCENT, backgroundColor: ACCENT, tension: 0.3 },
                { label: "Saídas", data: data.stockOut.map((p) => p.value), borderColor: DESTRUCTIVE, backgroundColor: DESTRUCTIVE, tension: 0.3 },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Pedidos por mês</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <Bar
            data={{
              labels: data.ordersByMonth.map((p) => p.label),
              datasets: [{ label: "Pedidos", data: data.ordersByMonth.map((p) => p.value), backgroundColor: ACCENT }],
            }}
            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
