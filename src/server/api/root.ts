import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { profileRouter } from "../../module/profile/profileRouter";
import { eventRouter } from "../../module/events/eventsRouter";
import { chatRouter } from "~/module/message/chatRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  profile: profileRouter,
  event: eventRouter,
  chat: chatRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
