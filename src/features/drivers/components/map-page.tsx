"use client";

import dynamic from "next/dynamic";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useDriversRealtime } from "../hooks/use-drivers-realtime";

const DriversMap = dynamic(() => import("./drivers-map"), {
  ssr: false,
  loading: () => <Skeleton className="min-h-[32rem] w-full" />,
});

export function MapPage() {
  const { drivers, isLoading, isError, refetch } = useDriversRealtime();

  return (
    <div>
      <PageHeader title="Rastreamento em tempo real" breadcrumbs={[{ label: "Mapa" }]} />
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <Skeleton className="min-h-[32rem] w-full" />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <DriversMap drivers={drivers} />
        </div>
      )}
    </div>
  );
}
