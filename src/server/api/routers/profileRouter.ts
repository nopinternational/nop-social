import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ProfileSchema, ProfileType } from "~/utils/validation/profile";
import { profile } from "console";

export const profileRouter = createTRPCRouter({
  getAllProfiles: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.profile.findMany();
  }),
  getProfileById: protectedProcedure
    .input(z.object({ profileId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.profile.findUnique({ where: { id: input.profileId } });
    }),
    getProfileByName: protectedProcedure
    .input(z.object({ profileName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.profile.findUnique({ where: { name: input.profileName } });
    }),
    getMyProfile: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.profile.findUnique({ where: { userId: ctx.session.user.name as string } });
    }),
  upsertProfile: protectedProcedure
    .input(
      ProfileSchema
    )
    .mutation(async ({ ctx, input }) => {
      const currentProfile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.name as string },
      });
      if (currentProfile) {
        return ctx.prisma.profile.update({
          where: { id: currentProfile.id },
          data: input,
        });
      }
      return ctx.prisma.profile.create({
        data: {
          ...input,
          type: ProfileType.HeterosexualPair,
          userId: ctx.session.user.name as string,
        },
      });
    }),
});

