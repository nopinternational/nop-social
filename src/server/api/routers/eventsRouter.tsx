import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getAllEventsFromFirestore } from "~/lib/firebase/events";

export const eventRouter = createTRPCRouter({
    getAllEvents:
        protectedProcedure
            .query(async () => {
                return await getAllEventsFromFirestore()
            }),
})