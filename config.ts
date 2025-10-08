const rawUrl =
  process.env.EXPO_PUBLIC_BACKEND_URL ??
  "https://aluehealth-backend-production.up.railway.app";

export const BACKEND_URL = rawUrl.replace(/\/$/, "");
