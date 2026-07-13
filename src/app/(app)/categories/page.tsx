import type { Metadata } from "next";
import { CategoriesPage } from "@/features/categories/components/categories-page";

export const metadata: Metadata = { title: "Categorias" };

export default function Page() {
  return <CategoriesPage />;
}
