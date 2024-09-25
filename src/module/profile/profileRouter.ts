import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../server/api/trpc";
import {
  getAllProfilesFromFirestore,
  getProfileByIdFromFirestore,
  getProfileByProfileNameFromFirestore,
  mergeToProfile,
} from "~/module/profile/firebaseProfiles";

export type Profile = {
  username: string;
  person1: Person;
  person2: Person;
  description: string;
  id: string;
  avatar?: string;
};

export type Person = {
  name: string;
  born: number;
};

export const profileRouter = createTRPCRouter({
  getAllProfiles: protectedProcedure.query(async () => {
    return await getAllProfilesFromFirestore();
  }),

  getProfileById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getProfileByIdFromFirestore(input.id);
    }),
    
  getProfileByProfileName: protectedProcedure
    .input(z.object({ profilename: z.string() }))
    .query(async ({ input }) => {
      return await getProfileByProfileNameFromFirestore(input.profilename);
    }),

  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    //console.log("------------getMyProfile.input", input)
    // console.log("getMyProfile.ctx", ctx)
    // console.log("getMyProfile.ctx.session", ctx.session)
    //console.log("getMyProfile.ctx.session.user.", ctx.session.user)
    // console.log("getMyProfilectx.session.user.name", ctx.session.user.name)
    return await getProfileByProfileNameFromFirestore(ctx.session.user.name || "");
  }),

  mergeProfile: protectedProcedure
    .input(
      z.object({
        username: z.string().optional(),

        person1: z
          .object({
            name: z.string(),
            born: z.number(),
          })
          .optional(),

        person2: z
          .object({
            name: z.string(),
            born: z.number(),
          })
          .optional(),

        description: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      // console.log("------------mergeProfile.input", input)
      return mergeToProfile(ctx.session.user.id, input);
    }),
});
