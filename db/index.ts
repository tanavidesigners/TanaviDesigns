import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Ensure your environment has configured the D1 database binding `DB`."
    );
  }

  return drizzle(env.DB, { schema });
}
