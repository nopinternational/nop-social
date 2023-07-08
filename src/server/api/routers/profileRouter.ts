import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ProfileSchema } from "~/utils/validation/profile";
import { getAllProfilesFromFirestore } from "~/lib/firebase/firebaseProfiles";

export type Profile = {
  username: string,
  name1: string,
  name2: string,
}

const PROFILES: Profile[] = [
  { username: "sthlmpar08", name1: "Johan", name2: "Evve" },
  { username: "soe", name1: "Emil", name2: "Sandra" }
]
export const profileRouter = createTRPCRouter({

  getAllProfiles: protectedProcedure.query(() => {
    const profilesss = getAllProfilesFromFirestore()
    console.log("profileRouter.getAllProfiles.profilesss", profilesss)
    return PROFILES
  }),
  getProfiles: protectedProcedure.query(() => {
    return "sthlmpar08,soe";
  }),
  // getProfileById: protectedProcedure
  //   .input(z.object({ profileId: z.string() }))
  //   .query(({ ctx, input }) => {
  //     return ctx.prisma.profile.findUnique({ where: { id: input.profileId } });
  //   }),
  //   getProfileByName: protectedProcedure
  //   .input(z.object({ profileName: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const profile = await ctx.prisma.profile.findUnique({ where: { name: input.profileName } });
  //     if(!profile) return null;

  //     const privateConversations = await ctx.prisma.privateConversation.findMany(
  //       {
  //         where: {
  //           AND: [
  //             {
  //               OR: [ 
  //                 { initiatorId: ctx.session.user.name as string, 
  //                   recipientId: profile.userId },
  //                   { initiatorId: profile.userId, 
  //                     recipientId: ctx.session.user.name as string  }
  //               ],
  //             deletedAt: null,
  //             rejectedAt: null,
  //             }
  //           ]

  //         },
  //         include: {
  //           conversation: true,
  //         },
  //         orderBy: { createdAt: "desc" },
  //       }
  //     );


  //     return {profile, privateConversation: privateConversations[0]}
  //   }),
  //   getMyProfile: protectedProcedure
  //   .query(({ ctx }) => {
  //     return ctx.prisma.profile.findUnique({ where: { userId: ctx.session.user.name as string } });
  //   }),
  // upsertProfile: protectedProcedure
  //   .input(
  //     ProfileSchema
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const currentProfile = await ctx.prisma.profile.findUnique({
  //       where: { userId: ctx.session.user.name as string },
  //     });
  //     if (currentProfile) {
  //       return ctx.prisma.profile.update({
  //         where: { id: currentProfile.id },
  //         data: input,
  //       });
  //     }
  //     return ctx.prisma.profile.create({
  //       data: {
  //         ...input,
  //         type: "null",
  //         userId: ctx.session.user.name as string,
  //       },
  //     });
  //   }),
});

