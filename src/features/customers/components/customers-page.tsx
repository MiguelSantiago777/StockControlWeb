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
import { formatCpf, formatPhone } from "@/lib/utils";
import { useCustomers, useDeleteCustomer } from "../hooks/use-customers";
import { CustomerFormModal } from "./customer-form-modal";
import type { Customer } from "@/types/entities";

export function CustomersPage() {
  const { canManageStock } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | undefined>();
  const [deleting, setDeleting] = useState<Customer | undefined>();

  const query = useCustomers({ page, pageSize: 10, search: search || undefined });
  const deleteMutation = useDeleteCustomer();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const columns: Column<Customer>[] = [
    { key: "name", header: "Cliente", render: (customer) => <span className="font-medium">{customer.name}</span> },
    { key: "cpf", header: "CPF", render: (customer) => formatCpf(customer.cpf) },
    { key: "email", header: "E-mail", render: (customer) => customer.email },
    { key: "phone", header: "Telefone", render: (customer) => formatPhone(customer.phone) },
    { key: "city", header: "Cidade", render: (customer) => customer.address.city },
    {
      key: "status",
      header: "Status",
      render: (customer) =>
        customer.isActive ? <Badge variant="success">Ativo</Badge> : <Badge variant="outline">Inativo</Badge>,
    },
    ...(canManageStock
      ? [
          {
            key: "actions",
            header: "",
            className: "w-24 text-right",
            render: (customer: Customer) => (
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(customer);
                    setFormOpen(true);
                  }}
                  aria-label={`Editar ${customer.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleting(customer)}
                  aria-label={`Excluir ${customer.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          } satisfies Column<Customer>,
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="Clientes"
        breadcrumbs={[{ label: "Clientes" }]}
        actions={
          canManageStock && (
            <Button
              onClick={() => {
                setEditing(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Novo cliente
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Pesquisar por nome, CPF ou e-mail..." onSearch={handleSearch} className="sm:w-96" />
      </div>

      <DataTable
        columns={columns}
        data={query.data}
        isLoading={query.isLoading}
        isError={query.isError}
        page={page}
        onPageChange={setPage}
        onRetry={() => query.refetch()}
        emptyTitle="Nenhum cliente cadastrado"
        emptyDescription="Cadastre o primeiro cliente para começar a registrar pedidos."
      />

      <CustomerFormModal open={formOpen} onOpenChange={setFormOpen} customer={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir cliente"
        description={`O cliente "${deleting?.name}" será excluído. Esta ação não pode ser desfeita.`}
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
