import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../server/api/trpc";
import {
    getAllEventsFromFirestore,
    getEvent,
    getEventAttendes,
    getEventMessages,
    signupToEvent,
    postEventMessage as postEventMessageFirebase
} from "~/module/events/eventsFirebase";
import { postEventMessage, type NopEvent } from "./components/types";



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
                // console.log("------------signupForEvent.input", input)
                return signupToEvent(ctx.session.user.id, input.eventId)
            }),
    getEventAttendes:
        protectedProcedure
            .input(z.object({ eventId: z.string() }))
            .query(({ input }) => {
                // console.log("------------getEventAttendes.input", input)
                return getEventAttendes(input.eventId)
            }),

    getEventMessages:
        protectedProcedure
            .input(z.object({ eventId: z.string() }))
            .query(({ input }) => {
                // console.log("------------getEventAttendes.input", input)
                return getEventMessages(input.eventId)
            }),

    postEventMessage:
        protectedProcedure
            .input(postEventMessage)
            .mutation(({ input, ctx }) => {
                //console.log("------------postEventMessage.input", input)
                // console.log("ctx", ctx)
                // console.log("ctx.session", ctx.session)
                // console.log("ctx.session.user.", ctx.session.user)
                // console.log("ctx.session.user.name", ctx.session.user.name)
                return postEventMessageFirebase(input.eventId, input.wallmessage, ctx.session.user.name as string)
            }),


})