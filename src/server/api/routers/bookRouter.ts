import { sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const bookRouter = createTRPCRouter({
  getRecommendedBooks: publicProcedure.input(z.number()).query(async ({ input = 10 }) => {
    return await db.query.books.findMany({
      orderBy: sql`RANDOM()`,
      limit: input,
    });
  }),
});
