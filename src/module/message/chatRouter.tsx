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
  // sendChatMessage: protectedProcedure
  //   .input(
  //     z.object({
  //       chatConvoId: z.string(),
  //       fromUserId: z.string(),
  //       chatMessage: z.string(),
  //     })
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     const aChatMessage2: MessageFirestoreModel = {
  //       chatConvoId: input.chatConvoId,
  //       fromUserId: input.fromUserId,
  //       chatMessage: input.chatMessage,
  //     };

  //     const aChatMessage: Message = {
  //       id: input.chatConvoId,
  //       from: input.fromUserId,
  //       message: input.chatMessage,
  //     };

  //     console.log("------------sendChatMessage.input", input);
  //     console.log("------------sendChatMessage.aChatMessage", aChatMessage);
  //     console.log("ctx", ctx);
  //     console.log("ctx.session", ctx.session);
  //     console.log("ctx.session.user.", ctx.session.user);
  //     console.log("ctx.session.user.name", ctx.session.user.name);
  //     return await persistChatMessage(aChatMessage);
  //   }),
  getMyConvoGroups: protectedProcedure.query(
    async ({ ctx }): Promise<ConversationGroup[]> => {
      // console.log("getMyConvoGroups.input", input);
      // console.log("getMyConvoGroups.ctx", ctx);
      const groups = await getGroups(ctx.session.user.id);
      console.log("return groups from fb", groups);
      const conversation_groups: ConversationGroup[] = groups.map((group) => ({
        // const convo_group: ConversationGroup = {
        conversationId: group,
        lastMessage: "last message",
        username: "USRNAME",
        // };
        // return convo_group;
      }));
      return conversation_groups;
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
      // console.log("postChatMessage", input);
      // console.log("postChatMessage", ctx);
      input.chatMessage.from = ctx.session.user.name || "";
      // console.log("postChatMessage", input);
      return await persistChatMessage(input.chatMessage);
    }),
});
