import type { Metadata } from "next";
import { ProductsPage } from "@/features/products/components/products-page";

export const metadata: Metadata = { title: "Produtos" };

export default function Page() {
  return <ProductsPage />;
}
