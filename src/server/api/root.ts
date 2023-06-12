import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { conversationRouter } from "./routers/conversationRouter";
import fetch from "node-fetch";
import { profileRouter } from "./routers/profileRouter";
import { privateConversationRouter } from "./routers/privateConversationRouter";
import { circleRouter } from "./routers/circleRouter";
if (!global.fetch) {
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
  profile: profileRouter,
  privateConversation: privateConversationRouter,
  circle: circleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
