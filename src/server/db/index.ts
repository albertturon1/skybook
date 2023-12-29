import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

export const dbCredentials = {
  url: env.DATABASE_URL,
  authToken:
    env.DATABASE_AUTH_TOKEN
};

import * as schema from "./schema";
import { env } from "~/env";

export const tursoClient = createClient(dbCredentials);
export const db = drizzle(tursoClient, { schema });
