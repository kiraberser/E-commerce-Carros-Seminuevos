/**
 * Module-level in-memory token store.
 * The access token never touches localStorage — it lives only in JS memory.
 * AuthContext calls setAccessToken after login/refresh.
 * The axios interceptor calls getAccessToken to attach it to requests.
 */

let _accessToken: string | null = null;

export function getAccessToken(): string | null {
  return _accessToken;
}

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}
