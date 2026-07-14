"use client";

import { Plus, Truck, X, CheckCheck, Route } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { useMyDriver } from "@/features/drivers/hooks/use-drivers";
import { usePermissions } from "@/hooks/use-permissions";
import { formatCurrency } from "@/lib/utils";
import { useCancelOrder, useFinishDelivery, useOrders } from "../hooks/use-orders";
import { OrderFormModal } from "./order-form-modal";
import { StartDeliveryModal } from "./start-delivery-modal";
import { StartRouteModal } from "./start-route-modal";
import type { Order, OrderStatus } from "@/types/entities";

const STARTABLE_STATUSES: OrderStatus[] = ["Criado", "EmSeparacao", "AguardandoEntrega"];

const STATUS_LABEL: Record<OrderStatus, string> = {
  Criado: "Criado",
  EmSeparacao: "Em separação",
  AguardandoEntrega: "Aguardando entrega",
  EmEntrega: "Em entrega",
  Finalizado: "Finalizado",
  Cancelado: "Cancelado",
};

const STATUS_VARIANT: Record<OrderStatus, "default" | "success" | "warning" | "destructive" | "outline"> = {
  Criado: "default",
  EmSeparacao: "warning",
  AguardandoEntrega: "warning",
  EmEntrega: "warning",
  Finalizado: "success",
  Cancelado: "destructive",
};

export function OrdersPage() {
  const { canManageStock, canDeliver, role } = usePermissions();
  const isDriver = role === "Entregador";

  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [startingDelivery, setStartingDelivery] = useState<Order | undefined>();
  const [startingRoute, setStartingRoute] = useState(false);
  const [cancelling, setCancelling] = useState<Order | undefined>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const query = useOrders({ page, pageSize: 10 });
  const { data: myDriver } = useMyDriver(isDriver);
  const finishDelivery = useFinishDelivery();
  const cancelOrder = useCancelOrder();

  const isStartable = (order: Order) => !order.driverId && STARTABLE_STATUSES.includes(order.status);

  const toggleSelected = (orderId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const columns: Column<Order>[] = [
    ...(isDriver
      ? [
          {
            key: "select",
            header: "",
            className: "w-10",
            render: (order: Order) =>
              isStartable(order) ? (
                <Checkbox
                  checked={selectedIds.has(order.id)}
                  onCheckedChange={() => toggleSelected(order.id)}
                  aria-label={`Selecionar pedido de ${order.customerName} para a rota`}
                />
              ) : null,
          } satisfies Column<Order>,
        ]
      : []),
    {
      key: "customerName",
      header: "Cliente",
      render: (order) => (
        <div>
          <p className="font-medium">{order.customerName}</p>
          <p className="text-xs text-muted-foreground">{order.items.length} item(ns)</p>
        </div>
      ),
    },
    { key: "driverName", header: "Entregador", render: (order) => order.driverName ?? "—" },
    {
      key: "total",
      header: "Total",
      className: "text-right",
      render: (order) => <span className="tabular-nums">{formatCurrency(order.total)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (order) => <Badge variant={STATUS_VARIANT[order.status]}>{STATUS_LABEL[order.status]}</Badge>,
    },
    {
      key: "actions",
      header: "",
      className: "w-40 text-right",
      render: (order) => (
        <div className="flex justify-end gap-1">
          {order.status === "Criado" && canManageStock && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStartingDelivery(order)}
                aria-label={`Iniciar entrega do pedido de ${order.customerName}`}
              >
                <Truck className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => setCancelling(order)}
                aria-label={`Cancelar pedido de ${order.customerName}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          {order.status === "EmEntrega" && canDeliver && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => finishDelivery.mutate(order.id)}
              aria-label={`Finalizar entrega do pedido de ${order.customerName}`}
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Pedidos"
        breadcrumbs={[{ label: "Pedidos" }]}
        actions={
          <div className="flex items-center gap-2">
            {isDriver && selectedIds.size > 0 && (
              <Button onClick={() => setStartingRoute(true)} disabled={!myDriver}>
                <Route className="h-4 w-4" /> Iniciar rota ({selectedIds.size})
              </Button>
            )}
            {canManageStock && (
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4" /> Novo pedido
              </Button>
            )}
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={query.data}
        isLoading={query.isLoading}
        isError={query.isError}
        page={page}
        onPageChange={setPage}
        onRetry={() => query.refetch()}
        emptyTitle="Nenhum pedido registrado"
        emptyDescription="Crie o primeiro pedido para começar a vender."
      />

      <OrderFormModal open={formOpen} onOpenChange={setFormOpen} />

      <StartDeliveryModal
        open={Boolean(startingDelivery)}
        orderId={startingDelivery?.id}
        onOpenChange={(open) => !open && setStartingDelivery(undefined)}
      />

      <StartRouteModal
        open={startingRoute}
        driverId={myDriver?.id}
        orderIds={Array.from(selectedIds)}
        onOpenChange={setStartingRoute}
        onDone={() => setSelectedIds(new Set())}
      />

      <ConfirmDialog
        open={Boolean(cancelling)}
        onOpenChange={(open) => !open && setCancelling(undefined)}
        title="Cancelar pedido"
        description={`O pedido de "${cancelling?.customerName}" será cancelado e o estoque será reposto. Esta ação não pode ser desfeita.`}
        confirmLabel="Cancelar pedido"
        loading={cancelOrder.isPending}
        onConfirm={() => {
          if (cancelling) {
            cancelOrder.mutate(cancelling.id, { onSuccess: () => setCancelling(undefined) });
          }
        }}
      />
    </div>
  );
}
