"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const DEFAULT_CENTER: [number, number] = [-22.9068, -43.1729];

const pinIcon = L.divIcon({
  className: "",
  html: '<div style="background:hsl(221 70% 45%);width:20px;height:20px;border-radius:9999px;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface ClickHandlerProps {
  onPick: (latitude: number, longitude: number) => void;
}

function ClickHandler({ onPick }: ClickHandlerProps) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

interface SetPositionMapProps {
  position?: { latitude: number; longitude: number };
  onPick: (latitude: number, longitude: number) => void;
}

export default function SetPositionMap({ position, onPick }: SetPositionMapProps) {
  const center: [number, number] = position ? [position.latitude, position.longitude] : DEFAULT_CENTER;

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className="h-80 w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onPick={onPick} />
      {position && <Marker position={[position.latitude, position.longitude]} icon={pinIcon} />}
    </MapContainer>
  );
}
