"use client";

import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { Pagination } from "./pagination";
import type { PagedResult } from "@/types/api";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data?: PagedResult<T>;
  isLoading: boolean;
  isError: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading,
  isError,
  page,
  onPageChange,
  onRetry,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-11 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (!data || data.items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        page={page}
        totalPages={data.totalPages}
        totalCount={data.totalCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}
