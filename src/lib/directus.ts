import { createDirectus, rest, authentication } from "@directus/sdk";
import { Schema } from "./types";

const directus = createDirectus<Schema>("http://127.0.0.1:8055")
  .with(authentication("json"))
  .with(rest());

let tokenExpiresAt = 0;
let loginPromise: Promise<void> | null = null;

export const getDirectus = async () => {
  const now = Date.now();
  
  if (now > tokenExpiresAt) {
    if (!loginPromise) {
      loginPromise = (async () => {
        try {
          await directus.login({ email: 'admin@gmail.com', password: 'admin123' });
          tokenExpiresAt = Date.now() + 14 * 60 * 1000; // 14 minutes
        } catch (e) {
          console.error("Directus login failed:", e);
          throw e; // Rethrow to prevent unauthenticated queries
        } finally {
          loginPromise = null;
        }
      })();
    }
    
    // Wait for the in-progress login
    await loginPromise;
  }
  
  return directus;
};

export default directus;
