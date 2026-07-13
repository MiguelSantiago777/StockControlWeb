"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/form-field";
import { driversService } from "@/services/drivers";
import { useStartDelivery } from "../hooks/use-orders";

interface StartDeliveryModalProps {
  open: boolean;
  orderId?: string;
  onOpenChange: (open: boolean) => void;
}

export function StartDeliveryModal({ open, orderId, onOpenChange }: StartDeliveryModalProps) {
  const [driverId, setDriverId] = useState("");
  const startDelivery = useStartDelivery();

  const { data: drivers } = useQuery({
    queryKey: ["drivers", "available"],
    queryFn: () => driversService.list({ pageSize: 100 }),
    enabled: open,
  });

  const available = drivers?.items.filter((d) => d.status === "Disponivel") ?? [];

  const handleConfirm = async () => {
    if (!orderId || !driverId) return;
    await startDelivery.mutateAsync({ id: orderId, driverId });
    setDriverId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Iniciar entrega</DialogTitle>
        </DialogHeader>

        <FormField label="Entregador" htmlFor="driverId">
          <select
            id="driverId"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Selecione...</option>
            {available.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {available.length === 0 && (
            <p className="text-xs text-muted-foreground">Nenhum entregador disponível no momento.</p>
          )}
        </FormField>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={startDelivery.isPending}>
            Cancelar
          </Button>
          <Button type="button" disabled={!driverId} loading={startDelivery.isPending} onClick={handleConfirm}>
            Iniciar entrega
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
