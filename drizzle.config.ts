import { type Config } from "drizzle-kit";
import { dbCredentials } from "~/server/db";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "turso",
  dbCredentials,
} satisfies Config;
