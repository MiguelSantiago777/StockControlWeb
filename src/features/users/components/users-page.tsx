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
import { useDeleteUser, useUsers } from "../hooks/use-users";
import { UserFormModal } from "./user-form-modal";
import type { User } from "@/types/entities";

export function UsersPage() {
  const { isAdmin } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | undefined>();
  const [deleting, setDeleting] = useState<User | undefined>();

  const query = useUsers({ page, pageSize: 10, search: search || undefined });
  const deleteMutation = useDeleteUser();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const columns: Column<User>[] = [
    { key: "name", header: "Nome", render: (user) => <span className="font-medium">{user.name}</span> },
    { key: "email", header: "E-mail", render: (user) => user.email },
    { key: "role", header: "Perfil", render: (user) => <Badge variant="outline">{user.role}</Badge> },
    {
      key: "status",
      header: "Status",
      render: (user) =>
        user.isActive ? <Badge variant="success">Ativo</Badge> : <Badge variant="outline">Inativo</Badge>,
    },
    ...(isAdmin
      ? [
          {
            key: "actions",
            header: "",
            className: "w-24 text-right",
            render: (user: User) => (
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(user);
                    setFormOpen(true);
                  }}
                  aria-label={`Editar ${user.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleting(user)}
                  aria-label={`Excluir ${user.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          } satisfies Column<User>,
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="Usuários"
        breadcrumbs={[{ label: "Usuários" }]}
        actions={
          isAdmin && (
            <Button
              onClick={() => {
                setEditing(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Novo usuário
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Pesquisar por nome ou e-mail..." onSearch={handleSearch} className="sm:w-80" />
      </div>

      <DataTable
        columns={columns}
        data={query.data}
        isLoading={query.isLoading}
        isError={query.isError}
        page={page}
        onPageChange={setPage}
        onRetry={() => query.refetch()}
        emptyTitle="Nenhum usuário cadastrado"
        emptyDescription="Cadastre o primeiro usuário para dar acesso ao sistema."
      />

      <UserFormModal open={formOpen} onOpenChange={setFormOpen} user={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir usuário"
        description={`O usuário "${deleting?.name}" será excluído. Esta ação não pode ser desfeita.`}
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
