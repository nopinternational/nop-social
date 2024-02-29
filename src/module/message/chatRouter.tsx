import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getChatMessages, persistChatMessage } from "./messageFirebase";

import { type MessageFirestoreModel } from "~/module/message/messageFirebase";
import { type Message } from "~/components/Message/ChatMessage";
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
      const aChatMessage: MessageFirestoreModel = {
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
  getChatMessage: protectedProcedure
    .input(
      z.object({
        chatConvoId: z.string(),
      })
    )
    .query(async ({ input, ctx }): Promise<Message[]> => {
      console.log("input", input);
      const messages = await getChatMessages(input.chatConvoId);
      console.log("return messages from fb", messages);

      return messages;
    }),
  postChatMessage: protectedProcedure
    .input(z.object({ chatMessage: z.custom<Message>() }))
    .mutation(({ input, ctx }) => {
      console.log("postChatMessage", input);
      console.log("postChatMessage", ctx);
      persistChatMessage(input.chatMessage);
    }),
});
