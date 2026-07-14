import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { refreshAccessToken } from "@/services/api";

let connection: HubConnection | null = null;

export function getHubConnection() {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(process.env.NEXT_PUBLIC_SIGNALR_URL ?? "", {
        // Always mints a fresh access token before (re)connecting instead of
        // reading the one cached in the auth store: that value only gets
        // updated when a REST call happens to 401, so after ~15min (JWT
        // lifetime) with no REST traffic it goes stale and every automatic
        // reconnect attempt would fail with 401 forever.
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
