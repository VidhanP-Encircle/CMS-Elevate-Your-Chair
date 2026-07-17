import { createDirectus, rest, authentication } from "@directus/sdk";
import { Schema } from "./types";

const directus = createDirectus<Schema>("http://127.0.0.1:8055")
  .with(authentication("json"))
  .with(rest());

let tokenExpiresAt = 0;

export const getDirectus = async () => {
  const now = Date.now();
  // Directus tokens expire in 15 minutes by default.
  // We re-login if the token is expired or within 1 minute of expiring.
  if (now > tokenExpiresAt) {
    try {
      await directus.login({ email: 'admin@gmail.com', password: 'admin123' });
      tokenExpiresAt = now + 14 * 60 * 1000; // 14 minutes
    } catch (e) {
      console.error("Directus login failed:", e);
    }
  }
  return directus;
};

export default directus;
