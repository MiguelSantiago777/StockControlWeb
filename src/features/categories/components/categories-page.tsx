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
import { useCategories, useDeleteCategory } from "../hooks/use-categories";
import { CategoryFormModal } from "./category-form-modal";
import type { Category } from "@/types/entities";

export function CategoriesPage() {
  const { canManageStock } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();
  const [deleting, setDeleting] = useState<Category | undefined>();

  const query = useCategories({ page, pageSize: 10, search: search || undefined });
  const deleteMutation = useDeleteCategory();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const columns: Column<Category>[] = [
    { key: "name", header: "Nome", render: (category) => <span className="font-medium">{category.name}</span> },
    {
      key: "description",
      header: "Descrição",
      render: (category) => category.description || "—",
    },
    {
      key: "status",
      header: "Status",
      render: (category) =>
        category.isActive ? <Badge variant="success">Ativo</Badge> : <Badge variant="outline">Inativo</Badge>,
    },
    ...(canManageStock
      ? [
          {
            key: "actions",
            header: "",
            className: "w-24 text-right",
            render: (category: Category) => (
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(category);
                    setFormOpen(true);
                  }}
                  aria-label={`Editar ${category.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleting(category)}
                  aria-label={`Excluir ${category.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          } satisfies Column<Category>,
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="Categorias"
        breadcrumbs={[{ label: "Categorias" }]}
        actions={
          canManageStock && (
            <Button
              onClick={() => {
                setEditing(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Nova categoria
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Pesquisar por nome..." onSearch={handleSearch} className="sm:w-80" />
      </div>

      <DataTable
        columns={columns}
        data={query.data}
        isLoading={query.isLoading}
        isError={query.isError}
        page={page}
        onPageChange={setPage}
        onRetry={() => query.refetch()}
        emptyTitle="Nenhuma categoria cadastrada"
        emptyDescription="Cadastre a primeira categoria para organizar seus produtos."
      />

      <CategoryFormModal open={formOpen} onOpenChange={setFormOpen} category={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir categoria"
        description={`A categoria "${deleting?.name}" será excluída. Esta ação não pode ser desfeita.`}
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
