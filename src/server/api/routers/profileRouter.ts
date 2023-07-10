import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getAllProfilesFromFirestore, getProfileFromFirestore } from "~/lib/firebase/firebaseProfiles";

export type Profile = {
  username: string,
  person1: Person,
  person2: Person,

}
export type Person = {
  name: string,
  born: number,
}

export const profileRouter = createTRPCRouter({

  getAllProfiles:
    protectedProcedure
      .query(async () => {
        return await getAllProfilesFromFirestore()

      }),


  getProfile:
    protectedProcedure
      .input(z.object({ profileid: z.string() }))
      .query(async ({ input }) => {
        return await getProfileFromFirestore(input.profileid)
      }),

  getMyProfile:
    protectedProcedure

      .query(async ({ ctx }) => {
        console.log("profileRouter.getMyProfile.ctx", ctx)
        console.log("profileRouter.getMyProfile.ctx.session", ctx.session)
        console.log("profileRouter.getMyProfile.ctx.session.user", ctx.session.user)
        console.log("profileRouter.getMyProfile.ctx.session.user.name", ctx.session.user.name)
        return await getProfileFromFirestore(ctx.session.user.name || "")
      }),
  //7K7PxXthSmblBF8uJIQN2zWMCyw1
  //7K7PxXthSmblBF8uJIQN2zWMCyw1""

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

