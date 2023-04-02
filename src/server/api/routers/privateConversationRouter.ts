import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const privateConversationRouter = createTRPCRouter({
  getMyOpenPrivateConversations: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.privateConversation.findMany({
      where: {
        initiatorId: ctx.session.user.name as string,
        acceptedAt: null,
        deletedAt: null,
        rejectedAt: null,
      },
    });
  }),

  getMyInvitationsToPrivateConversations: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.privateConversation.findMany({
      where: {
        recipientId: ctx.session.user.name as string,
        acceptedAt: null,
        deletedAt: null,
        rejectedAt: null,
      },
    });
  }),

  getPrivateConversationWith: protectedProcedure
    .input(z.object({ recipientId: z.string() }))
    .query(async ({ ctx, input }) => {
      // TODO: Check if user is part of conversation
      const conversation = await ctx.prisma.privateConversation.findMany({
        where: {
          initiatorId: ctx.session.user.name as string,
          recipientId: input.recipientId,
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
      });

      return conversation[0];
    }),

  inviteToPrivateConversation: protectedProcedure
    .input(
      z.object({ recipientId: z.string(), message: z.string().optional() })
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.privateConversation.findMany({
        where: {
          initiatorId: ctx.session.user.name as string,
          recipientId: input.recipientId,
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
      });

      if (conversation.length > 0) {
        return conversation[0];
      }

      return ctx.prisma.privateConversation.create({
        data: {
          initiatorId: ctx.session.user.name as string,
          recipientId: input.recipientId,
          message: input.message,
        },
      });
    }),
  acceptPrivateConversation: protectedProcedure
    .input(z.object({ privateConversaionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.privateConversation.findUnique({
        where: {
          id: input.privateConversaionId,
        },
      });

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      if (conversation.recipientId !== ctx.session.user.name) {
        throw new Error("You are not part of this conversation");
      }

      return ctx.prisma.privateConversation.update({
          where: { id: input.privateConversaionId },
          data: {
            acceptedAt: new Date(),
            conversation: {
              create: {
                participants: {
                  create: [{
                    userId: conversation.initiatorId,
                  },
                  {
                    userId: conversation.recipientId,
                  }],
                },
              },
            },
          },
        });
    }),
});
