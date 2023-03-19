import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { conversationRouter } from "./routers/conversation";
import fetch from "node-fetch";
if(!global.fetch) {
  (global.fetch as any) = fetch; 
}
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  conversation: conversationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
