import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { bookRouter } from "~/server/api/routers/bookRouter";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  book: bookRouter,
  bookNew: bookRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

type RouterName = keyof RouterOutput;
export type Procedures = {
  [P in keyof RouterOutput[RouterName]]: RouterOutput[RouterName][P];
};
