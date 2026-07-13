"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MonthlySeries } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const PALETTE = ["hsl(221 70% 50%)", "hsl(152 60% 40%)", "hsl(38 92% 50%)", "hsl(0 72% 52%)"];

interface ChartCardProps {
  title: string;
  data?: MonthlySeries;
  isLoading: boolean;
  type?: "bar" | "line";
}

export function ChartCard({ title, data, isLoading, type = "bar" }: ChartCardProps) {
  const chartData = data && {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.values,
      backgroundColor: PALETTE[index % PALETTE.length],
      borderColor: PALETTE[index % PALETTE.length],
      borderRadius: 4,
      tension: 0.3,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: (data?.datasets.length ?? 0) > 1 } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {isLoading || !chartData ? (
            <Skeleton className="h-full w-full" />
          ) : type === "line" ? (
            <Line data={chartData} options={options} />
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
