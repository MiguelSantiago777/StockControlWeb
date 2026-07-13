import type { Metadata } from "next";
import { DriversPage } from "@/features/drivers/components/drivers-page";

export const metadata: Metadata = { title: "Entregadores" };

export default function Page() {
  return <DriversPage />;
}
