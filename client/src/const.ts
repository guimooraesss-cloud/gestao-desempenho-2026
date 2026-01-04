export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  // --- AJUSTE MANUAL (HARDCODE) ---
  // Estamos forçando o endereço aqui para não depender do arquivo .env por enquanto
  const oauthPortalUrl = "http://localhost:3000";
  const appId = "local-dev-app"; 
  // --------------------------------

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  // Agora o URL() vai receber um endereço válido e não vai mais travar
  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};