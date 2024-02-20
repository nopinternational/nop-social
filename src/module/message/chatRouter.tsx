import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getChatMessages, persistChatMessage } from "./messageFirebase";

import { type AChatMessage } from "~/module/message/messageFirebase";
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
  getChatMessage: protectedProcedure
    .input(
      z.object({
        chatConvoId: z.string(),
      })
    )
    .query(async ({ input, ctx }): Message[] => {
      console.log("input", input);
      const messages = await getChatMessages(input.chatConvoId);
      console.log("return messages", messages);
      const ret_values = messages.map((message): Message => {
        return {
          from: message.fromUserId as string,
          id: message.chatConvoId as string,
          message: message.chatMessage as string,
        };
      });
      console.log("return messages", ret_values);
      return ret_values;
    }),
});
