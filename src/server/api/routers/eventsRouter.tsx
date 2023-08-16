import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getAllEventsFromFirestore, getEvent, signupToEvent } from "~/lib/firebase/events";

export const eventRouter = createTRPCRouter({
    getAllEvents:
        protectedProcedure
            .query(async () => {
                return await getAllEventsFromFirestore()
            }),
    getEvent:
        protectedProcedure
            .input(z.object({ eventId: z.string() }))
            .query(async ({ input }) => {
                return await getEvent(input.eventId)
            }),
    signupForEvent:
        protectedProcedure
            .input(z.object({ eventId: z.string() }))
            .mutation(({ input, ctx }) => {
                console.log("------------signupForEvent.input", input)
                return signupToEvent(ctx.session.user.id, input.eventId)
            }),
        
})