import type { Metadata } from "next";
import { SuppliersPage } from "@/features/suppliers/components/suppliers-page";

export const metadata: Metadata = { title: "Fornecedores" };

export default function Page() {
  return <SuppliersPage />;
}
