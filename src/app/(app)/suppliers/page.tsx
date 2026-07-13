import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Fornecedores" };

export default function Page() {
  return (
    <div>
      <PageHeader title="Fornecedores" breadcrumbs={[{ label: "Fornecedores" }]} />
      <EmptyState
        title="Módulo em construção"
        description="Siga o módulo de Produtos como referência: feature em src/features, service em src/services e página fina no App Router."
      />
    </div>
  );
}
