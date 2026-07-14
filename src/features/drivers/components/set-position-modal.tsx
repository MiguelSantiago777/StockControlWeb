"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateDriverPosition } from "../hooks/use-drivers";
import type { Driver } from "@/types/entities";

const SetPositionMap = dynamic(() => import("./set-position-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full" />,
});

interface SetPositionModalProps {
  open: boolean;
  driver?: Driver;
  onOpenChange: (open: boolean) => void;
}

export function SetPositionModal({ open, driver, onOpenChange }: SetPositionModalProps) {
  const [position, setPosition] = useState<{ latitude: number; longitude: number } | undefined>();
  const updatePosition = useUpdateDriverPosition();

  useEffect(() => {
    if (!open) return;
    setPosition(driver?.lastPosition);
  }, [open, driver]);

  const handleSave = async () => {
    if (!driver || !position) return;
    await updatePosition.mutateAsync({ id: driver.id, latitude: position.latitude, longitude: position.longitude });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Definir localização de {driver?.name}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Clique no mapa para marcar onde esse entregador deve aparecer. É só um dado de exemplo — não é rastreamento em tempo real.
        </p>

        <div className="overflow-hidden rounded-lg border">
          <SetPositionMap position={position} onPick={(latitude, longitude) => setPosition({ latitude, longitude })} />
        </div>

        {position && (
          <p className="text-xs text-muted-foreground">
            {position.latitude.toFixed(5)}, {position.longitude.toFixed(5)}
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updatePosition.isPending}>
            Cancelar
          </Button>
          <Button type="button" disabled={!position} loading={updatePosition.isPending} onClick={handleSave}>
            Salvar localização
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
