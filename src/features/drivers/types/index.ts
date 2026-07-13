export type DriverStatus = "Disponivel" | "EmEntrega" | "Indisponivel";

export interface Driver {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  vehicle?: string;
  photoUrl?: string;
  status: DriverStatus;
  latitude?: number;
  longitude?: number;
  speed?: number;
  lastUpdateAt?: string;
  isActive: boolean;
}

export interface DriverPosition {
  entregadorId: string;
  latitude: number;
  longitude: number;
  speed?: number;
}
