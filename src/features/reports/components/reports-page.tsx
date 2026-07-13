"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { usePermissions } from "@/hooks/use-permissions";
import type { Movement, MovementType } from "@/services/movements";
import { useExportMovementsCsv, useMovements } from "../hooks/use-movements";
import { MovementFormModal } from "./movement-form-modal";

const TYPE_LABEL: Record<MovementType, string> = {
  Entrada: "Entrada",
  Saida: "Saída",
  Ajuste: "Ajuste",
  Devolucao: "Devolução",
  Perda: "Perda",
};

const TYPE_VARIANT: Record<MovementType, "success" | "destructive" | "warning" | "outline"> = {
  Entrada: "success",
  Devolucao: "success",
  Saida: "outline",
  Ajuste: "warning",
  Perda: "destructive",
};

export function ReportsPage() {
  const { canManageStock } = usePermissions();
  const [page, setPage] = useState(1);
  const [type, setType] = useState<MovementType | "">("");
  const [formOpen, setFormOpen] = useState(false);

  const query = useMovements({ page, pageSize: 10, type: type || undefined });
  const exportCsv = useExportMovementsCsv();

  const columns: Column<Movement>[] = [
    {
      key: "createdAt",
      header: "Data",
      render: (m) => format(new Date(m.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    },
    { key: "productName", header: "Produto", render: (m) => m.productName },
    {
      key: "type",
      header: "Tipo",
      render: (m) => <Badge variant={TYPE_VARIANT[m.type]}>{TYPE_LABEL[m.type]}</Badge>,
    },
    { key: "quantity", header: "Quantidade", className: "text-right", render: (m) => m.quantity },
    { key: "userName", header: "Usuário", render: (m) => m.userName },
    { key: "note", header: "Observação", render: (m) => m.note || "—" },
  ];

  return (
    <div>
      <PageHeader
        title="Movimentações"
        breadcrumbs={[{ label: "Movimentações" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportCsv.mutate({ type: type || undefined })} loading={exportCsv.isPending}>
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>
            {canManageStock && (
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4" /> Nova movimentação
              </Button>
            )}
          </div>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as MovementType | "");
            setPage(1);
          }}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
        >
          <option value="">Todos os tipos</option>
          {(Object.keys(TYPE_LABEL) as MovementType[]).map((t) => (
            <option key={t} value={t}>{TYPE_LABEL[t]}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={query.data}
        isLoading={query.isLoading}
        isError={query.isError}
        page={page}
        onPageChange={setPage}
        onRetry={() => query.refetch()}
        emptyTitle="Nenhuma movimentação registrada"
        emptyDescription="Registre entradas, saídas e ajustes de estoque para acompanhar o histórico."
      />

      <MovementFormModal open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
