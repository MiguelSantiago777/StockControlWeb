"use client";

import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { usePermissions } from "@/hooks/use-permissions";
import { formatCpf, formatPhone } from "@/lib/utils";
import { useDeleteDriver, useDrivers, useUpdateDriverStatus } from "../hooks/use-drivers";
import { DriverFormModal } from "./driver-form-modal";
import { SetPositionModal } from "./set-position-modal";
import type { Driver, DriverStatus } from "@/types/entities";

const STATUS_LABEL: Record<DriverStatus, string> = {
  Disponivel: "Disponível",
  EmEntrega: "Em entrega",
  Indisponivel: "Indisponível",
};

const STATUS_VARIANT: Record<DriverStatus, "success" | "warning" | "outline"> = {
  Disponivel: "success",
  EmEntrega: "warning",
  Indisponivel: "outline",
};

export function DriversPage() {
  const { canManageStock } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Driver | undefined>();
  const [deleting, setDeleting] = useState<Driver | undefined>();
  const [settingPosition, setSettingPosition] = useState<Driver | undefined>();

  const query = useDrivers({ page, pageSize: 10, search: search || undefined });
  const deleteMutation = useDeleteDriver();
  const statusMutation = useUpdateDriverStatus();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const columns: Column<Driver>[] = [
    { key: "name", header: "Nome", render: (driver) => <span className="font-medium">{driver.name}</span> },
    { key: "cpf", header: "CPF", render: (driver) => formatCpf(driver.cpf) },
    { key: "phone", header: "Telefone", render: (driver) => formatPhone(driver.phone) },
    {
      key: "vehicle",
      header: "Veículo",
      render: (driver) => (driver.vehiclePlate ? `${driver.vehiclePlate} (${driver.vehicleModel ?? driver.vehicleType})` : "—"),
    },
    {
      key: "status",
      header: "Status",
      render: (driver) =>
        canManageStock ? (
          <select
            value={driver.status}
            onChange={(e) => statusMutation.mutate({ id: driver.id, status: e.target.value as DriverStatus })}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {(Object.keys(STATUS_LABEL) as DriverStatus[]).map((status) => (
              <option key={status} value={status}>{STATUS_LABEL[status]}</option>
            ))}
          </select>
        ) : (
          <Badge variant={STATUS_VARIANT[driver.status]}>{STATUS_LABEL[driver.status]}</Badge>
        ),
    },
    ...(canManageStock
      ? [
          {
            key: "actions",
            header: "",
            className: "w-32 text-right",
            render: (driver: Driver) => (
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSettingPosition(driver)}
                  aria-label={`Definir localização de ${driver.name}`}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(driver);
                    setFormOpen(true);
                  }}
                  aria-label={`Editar ${driver.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleting(driver)}
                  aria-label={`Excluir ${driver.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          } satisfies Column<Driver>,
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="Entregadores"
        breadcrumbs={[{ label: "Entregadores" }]}
        actions={
          canManageStock && (
            <Button
              onClick={() => {
                setEditing(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Novo entregador
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Pesquisar por nome ou CPF..." onSearch={handleSearch} className="sm:w-80" />
      </div>

      <DataTable
        columns={columns}
        data={query.data}
        isLoading={query.isLoading}
        isError={query.isError}
        page={page}
        onPageChange={setPage}
        onRetry={() => query.refetch()}
        emptyTitle="Nenhum entregador cadastrado"
        emptyDescription="Cadastre o primeiro entregador vinculando a um usuário com perfil Entregador."
      />

      <DriverFormModal open={formOpen} onOpenChange={setFormOpen} driver={editing} />

      <SetPositionModal
        open={Boolean(settingPosition)}
        driver={settingPosition}
        onOpenChange={(open) => !open && setSettingPosition(undefined)}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir entregador"
        description={`O entregador "${deleting?.name}" será excluído. Esta ação não pode ser desfeita.`}
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
