import type { Metadata } from "next";
import { VehiclesPage } from "@/features/vehicles/components/vehicles-page";

export const metadata: Metadata = { title: "Veículos" };

export default function Page() {
  return <VehiclesPage />;
}
