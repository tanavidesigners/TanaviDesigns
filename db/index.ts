import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  let dbBinding: any = (globalThis as any).DB || (process as any).env?.DB;

  if (!dbBinding && typeof globalThis !== "undefined") {
    dbBinding = (globalThis as any).__env__?.DB || (globalThis as any).env?.DB;
  }

  if (!dbBinding) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Ensure your environment has configured the D1 database binding `DB`."
    );
  }

  return drizzle(dbBinding, { schema });
}
