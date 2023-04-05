import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CircleType } from "~/utils/circle";

export const circleRouter = createTRPCRouter({
  createCircle: protectedProcedure
  .input(z.object({ name: z.string(), type: z.string() }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.circle.create({
      data: {
        name: input.name,
        type: input.type as CircleType,
        creatorId: ctx.session.user.name as string,
        moderators: {
          create: {
            moderatorId: ctx.session.user.name as string,
            invitedBy: ctx.session.user.name as string,
            acceptedAt: new Date(),
          },
        },
        conversation: {
          create: {
            participants: {
              create: {
                userId: ctx.session.user.name as string,
                acceptedAt: new Date(),
              },
            },
          },
        },
      },
    });
  }),
  
  getMyPrivateAndModeratedCircles: protectedProcedure.query(async ({ ctx }) => {
    const moderations = await ctx.prisma.circleModerator.findMany({
      where: {
        AND: [
          {
            moderatorId: ctx.session.user.name as string,
            OR: [
              {
                circle: {
                  type: CircleType.Moderated,
                },
              },
              {
                circle: {
                  type: CircleType.Private,
                },
              },
            ],
          },
        ],
      },
      include: {
        circle: true,
      },
    });

    return moderations.map((moderation) => moderation.circle);
  }),

  getAllOpenCircles: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.circle.findMany({
      where: {
        type: CircleType.Open,
      },
    });
  }),
  joinOpenCircle: protectedProcedure
    .input(z.object({ circleId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const circle = await ctx.prisma.circle.findUnique({
        where: { id: input.circleId },
      });
      if (!circle || circle.type !== CircleType.Open) {
        throw new Error("Circle not found");
      }

      if (!circle.conversationId) {
        throw new Error("Circle has no conversation");
      }

      const conversationParticipant =
        await ctx.prisma.conversationParticipant.findMany({
          where: {
            userId: ctx.session.user.name as string,
            conversationId: circle.conversationId,
            deletedAt: null,
          },
        });

      if (conversationParticipant.length > 0) {
        return conversationParticipant;
      }

      return ctx.prisma.conversationParticipant.create({
        data: {
          userId: ctx.session.user.name as string,
          conversationId: circle.conversationId,
          acceptedAt: new Date(),
          invitedBy: ctx.session.user.name as string,
        },
      });
    }),



  inviteModeratorToCircle: protectedProcedure
    .input(
      z.object({
        circleId: z.string(),
        moderatorId: z.string(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const circle = await ctx.prisma.circle.findMany({
        where: {
          id: input.circleId,
          moderators: {
            some: {
              moderatorId: ctx.session.user.name as string,
            },
          },
        },
      });

      if (circle.length === 0) {
        throw new Error("You are not a moderator of this circle");
      }

      if (input.moderatorId === ctx.session.user.name) {
        throw new Error("You can't add yourself as a moderator");
      }

      return ctx.prisma.circleModerator.create({
        data: {
          moderatorId: input.moderatorId,
          invitedBy: ctx.session.user.name as string,
          circleId: input.circleId,
        },
      });
    }),

  acceptModeratorToCircle: protectedProcedure
    .input(z.object({ moderatorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const moderator = await ctx.prisma.circleModerator.findUnique({
        where: {
          id: input.moderatorId,
        },
        include: {
          circle: true,
        },
      });
      if (!moderator) {
        throw new Error("Moderator not found");
      }

      if (moderator.moderatorId !== ctx.session.user.name) {
        throw new Error("You are not the moderator");
      }

      if (!moderator.circle || moderator.circle.conversationId === null) {
        throw new Error("Circle or converstion not found");
      }

      const conversationParticipant =
        await ctx.prisma.conversationParticipant.findMany({
          where: {
            userId: ctx.session.user.name,
            conversationId: moderator.circle.conversationId,
            deletedAt: null,
          },
        });

      if (conversationParticipant.length === 0) {
        return ctx.prisma.$transaction([
          ctx.prisma.conversationParticipant.create({
            data: {
              userId: ctx.session.user.name,
              conversationId: moderator.circle.conversationId,
              acceptedAt: new Date(),
              invitedBy: moderator.invitedBy,
            },
          }),
          ctx.prisma.circleModerator.update({
            where: {
              id: moderator.id,
            },
            data: {
              acceptedAt: new Date(),
            },
          }),
        ]);
      }

      return ctx.prisma.circleModerator.update({
        where: {
          id: moderator.id,
        },
        data: {
          acceptedAt: new Date(),
        },
      });
    }),
  inviteToPrivateCircle: protectedProcedure
    .input(
      z.object({
        circleId: z.string(),
        userId: z.string(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const circles = await ctx.prisma.circle.findMany({
        where: {
          id: input.circleId,
          type: CircleType.Private,
          conversation: {
            participants: {
              some: {
                userId: ctx.session.user.name as string,
              },
            },
          },
        },
        include: {
          conversation: true,
        },
      });

      const circle = circles[0];

      if (!circle) {
        throw new Error("You are not a member of this circle");
      }

      if (input.userId === ctx.session.user.name) {
        throw new Error("You can't add yourself to a circle");
      }

      const conversationParticipants =
        await ctx.prisma.conversationParticipant.findMany({
          where: {
            userId: input.userId,
            conversationId: circle.conversationId,
            deletedAt: null,
          },
        });

      if (conversationParticipants.length > 0) {
        return conversationParticipants[0];
      }

      return ctx.prisma.conversationParticipant.create({
        data: {
          userId: input.userId,
          invitedBy: ctx.session.user.name as string,
          conversationId: circle.conversationId,
        },
      });
    }),
  inviteToModeratedCircle: protectedProcedure
    .input(
      z.object({
        circleId: z.string(),
        userId: z.string(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const circles = await ctx.prisma.circle.findMany({
        where: {
          id: input.circleId,
          type: CircleType.Moderated,
          moderators: {
            some: {
              moderatorId: ctx.session.user.name as string,
            },
          },
        },
        include: {
          conversation: true,
        },
      });

      const circle = circles[0];

      if (!circle) {
        throw new Error("You are not a moderator of this circle");
      }

      if (input.userId === ctx.session.user.name) {
        throw new Error("You can't add yourself to a circle");
      }

      const conversationParticipants =
        await ctx.prisma.conversationParticipant.findMany({
          where: {
            userId: input.userId,
            conversationId: circle.conversationId,
            deletedAt: null,
          },
        });

      if (conversationParticipants.length > 0) {
        return conversationParticipants[0];
      }

      return ctx.prisma.conversationParticipant.create({
        data: {
          userId: input.userId,
          invitedBy: ctx.session.user.name as string,
          conversationId: circle.conversationId,
        },
      });
    }),
    
});
