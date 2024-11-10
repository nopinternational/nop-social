import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
    getChatMessages,
    getConvoAndMessages,
    getGroups,
    persistChatMessage,
    persistChatMessageToUser,
    updateConvoMarkAsRead,
} from "./messageFirebase";

// import { type MessageFirestoreModel } from "~/module/message/messageFirebase";
import {
    type ConvoWithMessages,
    type ConversationGroup,
    type ConversationMessage,
    type MessageToUser,
} from "~/components/Message/ChatMessage";
import { type APIMessageToUser } from "./types";

export const chatRouter = createTRPCRouter({
    getMyConvoGroups: protectedProcedure.query(
        async ({ ctx }): Promise<ConversationGroup[]> => {
            // console.log("getMyConvoGroups.input", input);
            // console.log("getMyConvoGroups.ctx", ctx);
            const groups = await getGroups(ctx.session.user.id);
            // console.log("return groups from fb", groups);
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
        .query(async ({ input }): Promise<ConversationMessage[]> => {
            // console.log("getChatMessage.input", input);
            // console.log("getChatMessage.ctx", ctx);
            const messages = await getChatMessages(input.chatConvoId);
            // console.log("return messages from fb", messages);

            return messages;
        }),

    getConvoAndChatMessages: protectedProcedure
        .input(
            z.object({
                chatConvoId: z.string(),
            })
        )
        .query(async ({ input, ctx }): Promise<ConvoWithMessages> => {
            // console.log("getChatMessage.input", input);
            // console.log("getChatMessage.ctx", ctx);
            const convoWithMessages = await getConvoAndMessages(
                input.chatConvoId,
                ctx.session.user.id
            );
            // console.log("return messages from fb", messages);

            return convoWithMessages;
        }),

    postChatMessageToConvo: protectedProcedure
        .input(z.object({ chatMessage: z.custom<ConversationMessage>() }))
        .mutation(async ({ input, ctx }) => {
            // console.log("postChatMessage", input);
            // console.log("postChatMessage", ctx);

            input.chatMessage.from = ctx.session.user.name || "";
            input.chatMessage.fromId = ctx.session.user.id || "";
            input.chatMessage.when = new Date().toISOString();
            // console.log("postChatMessage", input);
            return await persistChatMessage(input.chatMessage);
        }),

    updateConvoMarkAsRead: protectedProcedure
        .input(
            z.object({
                chatConvoId: z.string(),
            })
        )
        .mutation(({ input, ctx }) => {
            updateConvoMarkAsRead(input.chatConvoId, ctx.session.user.id)
        }),

    postChatMessageToUser: protectedProcedure
        .input(z.object({ chatMessage: z.custom<MessageToUser>() }))
        .mutation(async ({ input, ctx }) => {
            // console.log("postChatMessage", input);
            // console.log("postChatMessage", ctx);

            const apiMessage: APIMessageToUser = {
                ...input.chatMessage,
                fromProfileId: ctx.session.user.id,
                fromProfileName: ctx.session.user.name || ctx.session.user.id,
            };

            // input.chatMessage.t = ctx.session.user.name || "";
            // input.chatMessage.fromId = ctx.session.user.id || "";
            // input.chatMessage.when = new Date().toISOString();
            // console.log("postChatMessage", input);
            const persistChatMessageToUserResponse = await persistChatMessageToUser(
                apiMessage
            );
            // console.log(
            //   "postChatMessageToUser.persistChatMessageToUserResponse----------",
            //   persistChatMessageToUserResponse
            // );
            return persistChatMessageToUserResponse;
        }),
});
