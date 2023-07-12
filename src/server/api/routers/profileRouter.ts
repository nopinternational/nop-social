import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getAllProfilesFromFirestore, getProfileFromFirestore, mergeToProfile } from "~/lib/firebase/firebaseProfiles";

export type Profile = {
  username: string,
  person1: Person,
  person2: Person,
  description: string

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
        return await getProfileFromFirestore(ctx.session.user.name || "")
      }),

  mergeProfile:
    protectedProcedure
      .input(z.object({
        person1:
          z.object({
            name: z.string(),
            born: z.number()
          })
            .optional(),

        person2:
          z.object({
            name: z.string(),
            born: z.number()
          })
            .optional(),

        description: z.string()
          .optional(),

      }))
      .mutation(({ input, ctx }) => {
        console.log("------------mergeProfile.input", input)
        return mergeToProfile(ctx.session.user.id, input)
      }),



});

