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
import { formatCurrency } from "@/lib/utils";
import { useDeleteProduct, useProducts } from "../hooks/use-products";
import { ProductFormDialog } from "./product-form-dialog";
import type { Product } from "../types";

export function ProductsPage() {
  const { canManageStock } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();
  const [deleting, setDeleting] = useState<Product | undefined>();

  const query = useProducts({ page, pageSize: 10, search: search || undefined });
  const deleteMutation = useDeleteProduct();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Produto",
      render: (product) => (
        <div>
          <p className="font-medium">{product.name}</p>
          <p className="text-xs text-muted-foreground">{product.code}</p>
        </div>
      ),
    },
    { key: "category", header: "Categoria", render: (product) => product.categoryName ?? "—" },
    {
      key: "price",
      header: "Preço",
      className: "text-right",
      render: (product) => <span className="tabular-nums">{formatCurrency(product.price)}</span>,
    },
    {
      key: "stock",
      header: "Estoque",
      className: "text-right",
      render: (product) => (
        <div className="flex items-center justify-end gap-2">
          <span className="tabular-nums">{product.stock}</span>
          {product.stock === 0 ? (
            <Badge variant="destructive">Em falta</Badge>
          ) : product.stock < product.minStock ? (
            <Badge variant="warning">Baixo</Badge>
          ) : null}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (product) =>
        product.isActive ? <Badge variant="success">Ativo</Badge> : <Badge variant="outline">Inativo</Badge>,
    },
    ...(canManageStock
      ? [
          {
            key: "actions",
            header: "",
            className: "w-24 text-right",
            render: (product: Product) => (
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(product);
                    setFormOpen(true);
                  }}
                  aria-label={`Editar ${product.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleting(product)}
                  aria-label={`Excluir ${product.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          } satisfies Column<Product>,
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="Produtos"
        breadcrumbs={[{ label: "Produtos" }]}
        actions={
          canManageStock && (
            <Button
              onClick={() => {
                setEditing(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Novo produto
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Pesquisar por nome ou código..." onSearch={handleSearch} className="sm:w-80" />
      </div>

      <DataTable
        columns={columns}
        data={query.data}
        isLoading={query.isLoading}
        isError={query.isError}
        page={page}
        onPageChange={setPage}
        onRetry={() => query.refetch()}
        emptyTitle="Nenhum produto cadastrado"
        emptyDescription="Cadastre o primeiro produto para começar a controlar o estoque."
      />

      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} product={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir produto"
        description={`O produto "${deleting?.name}" será excluído. Esta ação não pode ser desfeita.`}
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
