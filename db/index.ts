import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  let dbBinding: any = (globalThis as any).DB || (process as any).env?.DB;

  if (!dbBinding) {
    try {
      // @ts-ignore
      const cf = typeof require !== "undefined" ? require("cloudflare:workers") : null;
      dbBinding = cf?.env?.DB;
    } catch {}
  }

  if (!dbBinding) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Ensure your environment has configured the D1 database binding `DB`."
    );
  }

  return drizzle(dbBinding, { schema });
}
