import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  getChatMessages,
  getGroups,
  persistChatMessage,
} from "./messageFirebase";

// import { type MessageFirestoreModel } from "~/module/message/messageFirebase";
import { type Message } from "~/components/Message/ChatMessage";
import { type ConversationGroup } from "~/pages/app/message";
export const chatRouter = createTRPCRouter({
  getMyConvoGroups: protectedProcedure.query(
    async ({ ctx }): Promise<ConversationGroup[]> => {
      // console.log("getMyConvoGroups.input", input);
      // console.log("getMyConvoGroups.ctx", ctx);
      const groups = await getGroups(ctx.session.user.id);
      console.log("return groups from fb", groups);
      // const conversation_groups: ConversationGroup[] = groups.map((group) => ({
      //   // const convo_group: ConversationGroup = {
      //   conversationId: group,
      //   lastMessage: "last message",
      //   username: "USRNAME",
      //   // };
      //   // return convo_group;
      // }));
      return groups;
    }
  ),

  getChatMessage: protectedProcedure
    .input(
      z.object({
        chatConvoId: z.string(),
      })
    )
    .query(async ({ input, ctx }): Promise<Message[]> => {
      // console.log("getChatMessage.input", input);
      // console.log("getChatMessage.ctx", ctx);
      const messages = await getChatMessages(input.chatConvoId);
      // console.log("return messages from fb", messages);

      return messages;
    }),

  postChatMessage: protectedProcedure
    .input(z.object({ chatMessage: z.custom<Message>() }))
    .mutation(async ({ input, ctx }) => {
      console.log("postChatMessage", input);
      console.log("postChatMessage", ctx);

      input.chatMessage.from = ctx.session.user.name || "";
      input.chatMessage.fromId = ctx.session.user.id || "";
      input.chatMessage.when = new Date().toISOString();
      // console.log("postChatMessage", input);
      return await persistChatMessage(input.chatMessage);
    }),
});
