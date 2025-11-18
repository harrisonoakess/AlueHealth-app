import { BACKEND_URL } from "../config";

let inflight: Promise<void> | null = null;

export function warmBackend() {
  if (inflight) return inflight;

  inflight = fetch(BACKEND_URL)
    .then(() => undefined)
    .catch(() => undefined)
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
