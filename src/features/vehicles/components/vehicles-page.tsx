"use client";

import { Bike, Car, Plus, Pencil, Trash2, Truck } from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { usePermissions } from "@/hooks/use-permissions";
import { useDeleteVehicle, useVehicles } from "../hooks/use-vehicles";
import { VehicleFormModal } from "./vehicle-form-modal";
import type { Vehicle, VehicleType } from "@/types/entities";

const TYPE_LABEL: Record<VehicleType, string> = {
  Moto: "Moto",
  Carro: "Carro",
  CaminhaoVan: "Caminhão / Van",
};

const TYPE_ICON: Record<VehicleType, typeof Bike> = {
  Moto: Bike,
  Carro: Car,
  CaminhaoVan: Truck,
};

function formatPlate(plate: string) {
  return plate.length === 7 ? `${plate.slice(0, 3)}-${plate.slice(3)}` : plate;
}

export function VehiclesPage() {
  const { canManageStock } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | undefined>();
  const [deleting, setDeleting] = useState<Vehicle | undefined>();

  const query = useVehicles({ page, pageSize: 10, search: search || undefined });
  const deleteMutation = useDeleteVehicle();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const columns: Column<Vehicle>[] = [
    {
      key: "plate",
      header: "Placa",
      render: (vehicle) => <span className="font-medium tabular-nums">{formatPlate(vehicle.plate)}</span>,
    },
    {
      key: "type",
      header: "Tipo",
      render: (vehicle) => {
        const Icon = TYPE_ICON[vehicle.type];
        return (
          <span className="flex items-center gap-1.5">
            <Icon className="h-4 w-4 text-muted-foreground" /> {TYPE_LABEL[vehicle.type]}
          </span>
        );
      },
    },
    { key: "model", header: "Modelo", render: (vehicle) => vehicle.model || "—" },
    {
      key: "status",
      header: "Status",
      render: (vehicle) =>
        vehicle.isActive ? <Badge variant="success">Ativo</Badge> : <Badge variant="outline">Inativo</Badge>,
    },
    ...(canManageStock
      ? [
          {
            key: "actions",
            header: "",
            className: "w-24 text-right",
            render: (vehicle: Vehicle) => (
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(vehicle);
                    setFormOpen(true);
                  }}
                  aria-label={`Editar ${vehicle.plate}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleting(vehicle)}
                  aria-label={`Excluir ${vehicle.plate}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          } satisfies Column<Vehicle>,
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="Veículos"
        breadcrumbs={[{ label: "Veículos" }]}
        actions={
          canManageStock && (
            <Button
              onClick={() => {
                setEditing(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Novo veículo
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Pesquisar por placa ou modelo..." onSearch={handleSearch} className="sm:w-80" />
      </div>

      <DataTable
        columns={columns}
        data={query.data}
        isLoading={query.isLoading}
        isError={query.isError}
        page={page}
        onPageChange={setPage}
        onRetry={() => query.refetch()}
        emptyTitle="Nenhum veículo cadastrado"
        emptyDescription="Cadastre os veículos da empresa para atribuir aos entregadores nas rotas."
      />

      <VehicleFormModal open={formOpen} onOpenChange={setFormOpen} vehicle={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir veículo"
        description={`O veículo "${deleting ? formatPlate(deleting.plate) : ""}" será excluído. Esta ação não pode ser desfeita.`}
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleting) {
            deleteMutation.mutate(deleting.id, { onSuccess: () => setDeleting(undefined) });
          }
        }}
      />
    </div>
  );
}
