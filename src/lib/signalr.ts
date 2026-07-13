import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { refreshAccessToken } from "./api";

let connection: HubConnection | null = null;

export function getHubConnection() {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(process.env.NEXT_PUBLIC_SIGNALR_URL ?? "", {
        // Sempre busca um token fresco (não usa o do Zustand, que só é setado
        // no login e nunca mais é atualizado — ficaria expirado após ~15min
        // e toda reconexão automática do SignalR falharia com 401 pra sempre).
        accessTokenFactory: () => refreshAccessToken(),
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();
  }
  return connection;
}

export async function ensureConnected() {
  const hub = getHubConnection();
  if (hub.state === HubConnectionState.Disconnected) {
    await hub.start();
  }
  return hub;
}

export async function stopConnection() {
  if (connection && connection.state !== HubConnectionState.Disconnected) {
    await connection.stop();
  }
}
