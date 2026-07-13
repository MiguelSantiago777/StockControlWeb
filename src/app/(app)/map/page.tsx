import type { Metadata } from "next";
import { MapPage } from "@/features/drivers/components/map-page";

export const metadata: Metadata = { title: "Mapa" };

export default function Page() {
  return <MapPage />;
}
