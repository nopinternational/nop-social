import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { persistChatMessage } from "./messageFirebase";

import { type AChatMessage } from "~/module/message/messageFirebase";
export const chatRouter = createTRPCRouter({
  sendChatMessage: protectedProcedure
    .input(
      z.object({
        chatConvoId: z.string(),
        fromUserId: z.string(),
        chatMessage: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const aChatMessage: AChatMessage = {
        chatConvoId: input.chatConvoId,
        fromUserId: input.fromUserId,
        chatMessage: input.chatMessage,
      };
      console.log("------------sendChatMessage.input", input);
      console.log("ctx", ctx);
      console.log("ctx.session", ctx.session);
      console.log("ctx.session.user.", ctx.session.user);
      console.log("ctx.session.user.name", ctx.session.user.name);
      return await persistChatMessage(aChatMessage);
    }),
});
