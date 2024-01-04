import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw "Missing DATABASE_URL in .env";
}
if (!process.env.DATABASE_AUTH_TOKEN) {
  throw "Missing DATABASE_AUTH_TOKEN in .env";
}

export const dbCredentials = {
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
};

export const tursoClient = createClient(dbCredentials);
export const db = drizzle(tursoClient, { schema });

export type DBSchema = typeof schema;
