export type Role = "Administrador" | "Estoquista" | "Entregador" | "Visualizador";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RefreshRequest {
  refreshToken: string;
}
