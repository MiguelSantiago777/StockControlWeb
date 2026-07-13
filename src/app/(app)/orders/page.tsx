import type { Metadata } from "next";
import { OrdersPage } from "@/features/orders/components/orders-page";

export const metadata: Metadata = { title: "Pedidos" };

export default function Page() {
  return <OrdersPage />;
}
