"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/form-field";
import { vehiclesService } from "@/services/vehicles";
import { ordersService } from "@/services/orders";

interface StartRouteModalProps {
  open: boolean;
  driverId?: string;
  orderIds: string[];
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}

export function StartRouteModal({ open, driverId, orderIds, onOpenChange, onDone }: StartRouteModalProps) {
  const [vehicleId, setVehicleId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: vehicles } = useQuery({
    queryKey: ["vehicles", "all"],
    queryFn: () => vehiclesService.list({ pageSize: 100 }),
    enabled: open,
  });

  const handleConfirm = async () => {
    if (!driverId || !vehicleId || orderIds.length === 0) return;

    setSubmitting(true);
    let successCount = 0;
    for (const orderId of orderIds) {
      try {
        await ordersService.startDelivery(orderId, driverId, vehicleId);
        successCount += 1;
      } catch {
        toast.error("Não foi possível iniciar uma das entregas. A rota foi interrompida.");
        break;
      }
    }
    setSubmitting(false);
    setVehicleId("");

    void queryClient.invalidateQueries({ queryKey: ["orders"] });
    void queryClient.invalidateQueries({ queryKey: ["drivers"] });

    onOpenChange(false);
    onDone();

    if (successCount > 0) {
      toast.success(`Rota iniciada com ${successCount} entrega${successCount > 1 ? "s" : ""}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Iniciar rota</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          {orderIds.length} entrega{orderIds.length > 1 ? "s" : ""} selecionada{orderIds.length > 1 ? "s" : ""} será
          {orderIds.length > 1 ? "ão" : ""} iniciada{orderIds.length > 1 ? "s" : ""} com você como entregador.
        </p>

        <FormField label="Veículo" htmlFor="routeVehicleId">
          <select
            id="routeVehicleId"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Selecione...</option>
            {vehicles?.items.map((v) => (
              <option key={v.id} value={v.id}>{v.plate} {v.model ? `— ${v.model}` : ""}</option>
            ))}
          </select>
          {vehicles?.items.length === 0 && (
            <p className="text-xs text-muted-foreground">Nenhum veículo cadastrado. Cadastre em Veículos primeiro.</p>
          )}
        </FormField>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="button" disabled={!vehicleId || orderIds.length === 0} loading={submitting} onClick={handleConfirm}>
            Iniciar rota
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
