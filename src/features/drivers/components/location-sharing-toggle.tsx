"use client";

import { MapPin, MapPinOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { useMyDriver, useUpdateDriverPosition } from "../hooks/use-drivers";

const MIN_INTERVAL_MS = 10_000;

export function LocationSharingToggle() {
  const { role } = usePermissions();
  const isDriver = role === "Entregador";

  const { data: myDriver } = useMyDriver(isDriver);
  const updatePosition = useUpdateDriverPosition();

  const [sharing, setSharing] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const lastSentRef = useRef(0);

  const stop = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setSharing(false);
  };

  const start = () => {
    if (!myDriver) return;

    if (!("geolocation" in navigator)) {
      toast.error("Este navegador não suporta geolocalização.");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        if (now - lastSentRef.current < MIN_INTERVAL_MS) return;
        lastSentRef.current = now;

        updatePosition.mutate({
          id: myDriver.id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        toast.error(
          error.code === error.PERMISSION_DENIED
            ? "Permissão de localização negada. Habilite nas configurações do navegador."
            : "Não foi possível obter sua localização."
        );
        stop();
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 20_000 }
    );

    setSharing(true);
    toast.success("Compartilhando sua localização");
  };

  useEffect(() => stop, []);

  if (!isDriver || !myDriver) return null;

  return (
    <Button
      variant={sharing ? "default" : "ghost"}
      size="icon"
      onClick={() => (sharing ? stop() : start())}
      aria-label={sharing ? "Parar de compartilhar localização" : "Compartilhar localização"}
      title={sharing ? "Compartilhando localização — clique para parar" : "Compartilhar minha localização"}
    >
      {sharing ? <MapPin className="h-4 w-4 animate-pulse" /> : <MapPinOff className="h-4 w-4" />}
    </Button>
  );
}
