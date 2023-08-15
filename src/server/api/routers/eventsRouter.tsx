import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getAllEventsFromFirestore, getEvent } from "~/lib/firebase/events";

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
                console.log()
                return await getEvent(input.eventId)
            }),
})