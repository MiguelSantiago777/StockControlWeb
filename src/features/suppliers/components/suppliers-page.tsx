"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { usePermissions } from "@/hooks/use-permissions";
import { formatCnpj, formatPhone } from "@/lib/utils";
import { useDeleteSupplier, useSuppliers } from "../hooks/use-suppliers";
import { SupplierFormModal } from "./supplier-form-modal";
import type { Supplier } from "@/types/entities";

export function SuppliersPage() {
  const { canManageStock } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | undefined>();
  const [deleting, setDeleting] = useState<Supplier | undefined>();

  const query = useSuppliers({ page, pageSize: 10, search: search || undefined });
  const deleteMutation = useDeleteSupplier();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const columns: Column<Supplier>[] = [
    {
      key: "companyName",
      header: "Fornecedor",
      render: (supplier) => (
        <div>
          <p className="font-medium">{supplier.tradeName ?? supplier.companyName}</p>
          {supplier.tradeName && <p className="text-xs text-muted-foreground">{supplier.companyName}</p>}
        </div>
      ),
    },
    { key: "cnpj", header: "CNPJ", render: (supplier) => formatCnpj(supplier.cnpj) },
    { key: "email", header: "E-mail", render: (supplier) => supplier.email },
    { key: "phone", header: "Telefone", render: (supplier) => formatPhone(supplier.phone) },
    {
      key: "status",
      header: "Status",
      render: (supplier) =>
        supplier.isActive ? <Badge variant="success">Ativo</Badge> : <Badge variant="outline">Inativo</Badge>,
    },
    ...(canManageStock
      ? [
          {
            key: "actions",
            header: "",
            className: "w-24 text-right",
            render: (supplier: Supplier) => (
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(supplier);
                    setFormOpen(true);
                  }}
                  aria-label={`Editar ${supplier.companyName}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleting(supplier)}
                  aria-label={`Excluir ${supplier.companyName}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          } satisfies Column<Supplier>,
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="Fornecedores"
        breadcrumbs={[{ label: "Fornecedores" }]}
        actions={
          canManageStock && (
            <Button
              onClick={() => {
                setEditing(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Novo fornecedor
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Pesquisar por razão social, nome fantasia ou CNPJ..." onSearch={handleSearch} className="sm:w-96" />
      </div>

      <DataTable
        columns={columns}
        data={query.data}
        isLoading={query.isLoading}
        isError={query.isError}
        page={page}
        onPageChange={setPage}
        onRetry={() => query.refetch()}
        emptyTitle="Nenhum fornecedor cadastrado"
        emptyDescription="Cadastre o primeiro fornecedor para vincular aos seus produtos."
      />

      <SupplierFormModal open={formOpen} onOpenChange={setFormOpen} supplier={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir fornecedor"
        description={`O fornecedor "${deleting?.companyName}" será excluído. Esta ação não pode ser desfeita.`}
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
