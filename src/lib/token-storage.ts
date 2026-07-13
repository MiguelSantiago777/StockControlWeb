const ACCESS_TOKEN_KEY = "sc_access_token";

/**
 * Access token em memória (não persiste em localStorage por segurança).
 * O refresh token é gerenciado pelo backend via cookie HttpOnly ("sc_refresh").
 * Fallback em sessionStorage apenas para sobreviver a hard refresh dentro da aba.
 */
let accessToken: string | null = null;

export const tokenStorage = {
  get(): string | null {
    if (accessToken) return accessToken;
    if (typeof window !== "undefined") {
      accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return accessToken;
  },
  set(token: string) {
    accessToken = token;
    if (typeof window !== "undefined") sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clear() {
    accessToken = null;
    if (typeof window !== "undefined") sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
