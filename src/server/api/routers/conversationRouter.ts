import type { Message } from "@prisma/client";
import { observable } from "@trpc/server/observable";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CircleType } from "~/utils/circle";

export const conversationRouter = createTRPCRouter({
  getAllConversations: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.conversation.findMany({
      include: { participants: true },
    });
  }),

  getMyConversations: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.conversation.findMany({
      where: {
        participants: { some: { userId: ctx.session.user.name as string } },
      },
      include: { participants: true },
    });
  }),

  getConversation: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
      // TODO: Check if user is part of conversation
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
        include: { participants: true, PrivateConversation: true, Circle: true },
      });

      if(!conversation) {
        throw new Error("Conversation not found");
      }

      const participation = await ctx.prisma.conversationParticipant.findMany({
        where: {
          conversationId: input.conversationId,
          userId: ctx.session.user.name as string,
          deletedAt: null,
        }
      });

      if((!participation || participation.length === 0) && conversation.Circle && conversation.Circle.type === CircleType.Open) {
        return {partcipation: null, conversation};
      }

      return {conversation, partcipation: participation[0]};
    }),

    acceptConversationInvitation: protectedProcedure
    .input(z.object({ conversationParticipantId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.conversationParticipant.updateMany({
        where:{
          id: input.conversationParticipantId,
          userId: ctx.session.user.name as string,
        },
        data: {
          acceptedAt: new Date(),
        },
      });
    }),

  createConversation: protectedProcedure.mutation(async ({ ctx }) => {
    const conversation = await ctx.prisma.$transaction([
      ctx.prisma.conversation.create({
        data: {
          participants: {
            create: {
              userId: ctx.session.user.name as string,
            },
          },
        },
      }),
    ]);

    return conversation[0];
  }),
/*
  joinConversation: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingParticipation =
        await ctx.prisma.conversationParticipant.findMany({
          where: {
            conversationId: input.conversationId,
            userId: ctx.session.user.name as string,
          },
        });

      if (existingParticipation.length > 0) {
        return existingParticipation[0];
      }

      const newParticipation = await ctx.prisma.conversationParticipant.create({
        data: {
          conversationId: input.conversationId,
          userId: ctx.session.user.name as string,
        },
      });

      return newParticipation;
    }),
*/
  sendMessage: protectedProcedure
    .input(z.object({ conversationId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: input.conversationId },
        include: { participants: true },
      });

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      if (
        !conversation.participants.find(
          (participant) => participant.userId === ctx.session.user.name
        )
      ) {
        throw new Error("You are not part of conversation");
      }

      const message = await ctx.prisma.message.create({
        data: {
          conversationId: input.conversationId,
          content: input.content,
          userId: ctx.session.user.name as string,
        },
      });

      ctx.eventEmitter.emit("message" + input.conversationId, message);

      return message;
    }),
  onSendMessage: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .subscription(({ ctx, input }) => {
      // return an `observable` with a callback which is triggered immediately
      return observable<Message>((emit) => {
        const onAdd = (data: Message) => {
          // emit data to client
          if (input.conversationId === data.conversationId) {
            emit.next(data);
          }
        };
        // Todo: Check if user is part of conversation.
        void ctx.prisma.message
          .findMany({
            where: { conversationId: input.conversationId },
            orderBy: { createdAt: "asc" },
          })
          .then((messages) => messages.forEach((message) => onAdd(message)))
          .then(() =>
            ctx.eventEmitter.on("message" + input.conversationId, onAdd)
          );
        // trigger `onAdd()` when `add` is triggered in our event emitter

        // unsubscribe function when client disconnects or stops subscribing
        return () => {
          ctx.eventEmitter.off("message" + input.conversationId, onAdd);
        };
      });
    }),
});
