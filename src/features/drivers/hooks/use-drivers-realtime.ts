"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { driversService } from "@/services/drivers";
import { useSignalREvent } from "@/hooks/use-signalr";
import type { Driver } from "@/types/entities";

interface PositionEvent {
  entregadorId: string;
  latitude: number;
  longitude: number;
  speed?: number;
}

export function useDriversRealtime() {
  const [livePositions, setLivePositions] = useState<Record<string, PositionEvent>>({});

  const query = useQuery({
    queryKey: ["drivers", { page: 1, pageSize: 100 }],
    queryFn: () => driversService.list({ page: 1, pageSize: 100 }),
  });

  useSignalREvent<PositionEvent>(
    "PosicaoEntregador",
    useCallback((payload) => {
      setLivePositions((prev) => ({ ...prev, [payload.entregadorId]: payload }));
    }, [])
  );

  const drivers: Driver[] = (query.data?.items ?? []).map((driver) => {
    const live = livePositions[driver.id];
    return live
      ? {
          ...driver,
          lastPosition: { latitude: live.latitude, longitude: live.longitude },
          positionUpdatedAt: new Date().toISOString(),
          speed: live.speed,
        }
      : driver;
  });

  return { drivers, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}
