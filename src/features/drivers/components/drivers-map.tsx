"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Badge } from "@/components/ui/badge";
import type { Driver } from "@/types/entities";

const DEFAULT_CENTER: [number, number] = [-22.9068, -43.1729];

const TRUCK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
  <path d="M15 18H9"/>
  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
  <circle cx="17" cy="18" r="2"/>
  <circle cx="7" cy="18" r="2"/>
</svg>`;

function driverIconFor(status: Driver["status"]) {
  const background = status === "EmEntrega" ? "hsl(38 92% 50%)" : "hsl(221 70% 45%)";
  return L.divIcon({
    className: "",
    html: `<div style="background:${background};width:28px;height:28px;border-radius:9999px;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center">${TRUCK_SVG}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

const centerIcon = L.divIcon({
  className: "",
  html: '<div style="background:hsl(152 60% 36%);width:16px;height:16px;border-radius:4px;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const STATUS_LABEL: Record<Driver["status"], string> = {
  Disponivel: "Disponível",
  EmEntrega: "Em entrega",
  Indisponivel: "Indisponível",
};

interface DriversMapProps {
  drivers: Driver[];
  distributionCenter?: { latitude: number; longitude: number; name: string };
}

export default function DriversMap({ drivers, distributionCenter }: DriversMapProps) {
  const center: [number, number] = distributionCenter
    ? [distributionCenter.latitude, distributionCenter.longitude]
    : DEFAULT_CENTER;

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className="min-h-[32rem]">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {distributionCenter && (
        <Marker position={[distributionCenter.latitude, distributionCenter.longitude]} icon={centerIcon}>
          <Popup>{distributionCenter.name}</Popup>
        </Marker>
      )}

      {drivers
        .filter((driver) => driver.lastPosition)
        .map((driver) => (
          <Marker
            key={driver.id}
            position={[driver.lastPosition!.latitude, driver.lastPosition!.longitude]}
            icon={driverIconFor(driver.status)}
          >
            <Popup>
              <div className="min-w-40 space-y-1">
                <p className="font-medium">{driver.name}</p>
                <p className="text-xs">{driver.phone}</p>
                <Badge variant={driver.status === "EmEntrega" ? "warning" : "success"}>
                  {STATUS_LABEL[driver.status]}
                </Badge>
                {driver.speed !== undefined && <p className="text-xs">{Math.round(driver.speed)} km/h</p>}
                {driver.positionUpdatedAt && (
                  <p className="text-xs text-muted-foreground">
                    Atualizado{" "}
                    {formatDistanceToNow(new Date(driver.positionUpdatedAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
