import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../server/api/trpc";
import {
    getAllEventsFromFirestore,
    getEvent,
    getEventAttendes,
    getEventMessages,
    signupToEvent,
    postEventMessage as postEventMessageFirebase,
    persistEvent,
    updateEvent,
    getMyEventStatus
} from "~/module/events/eventsFirebase";
import { type EventFormType } from "~/module/events/components/NoPEventForm";
import { postEventMessage } from "./components/types";
import { TRPCError } from "@trpc/server";



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
    getMyEventStatus:
        protectedProcedure
            .input(z.object({ eventId: z.string() }))
            .query(async ({ input, ctx }) => {
                return await getMyEventStatus(ctx.session.user.id, input.eventId)
            }),

    createEvent:
        protectedProcedure
            //.input(z.object({ eventTitle: z.string() }))
            .input(z.object({
                nopEvent: z.custom<EventFormType>()
            }))
            .mutation(async ({ input, ctx }) => {

                const persistNopEvent = {
                    nopEvent: input.nopEvent,
                    uid: ctx.session.user.id,
                }
                return await persistEvent(persistNopEvent)
            }),

    updateEvent:
        protectedProcedure
            //.input(z.object({ eventTitle: z.string() }))
            .input(z.object({
                eventId: z.string(),
                nopEvent: z.custom<EventFormType>()
            }))
            .mutation(async ({ input, ctx }) => {

                const persistNopEvent = {
                    nopEvent: input.nopEvent,
                    uid: ctx.session.user.id,
                    eventId: input.eventId
                }
                const updatedDocId = await updateEvent(persistNopEvent)
                if (updatedDocId) return updatedDocId
                throw new TRPCError({ code: "FORBIDDEN", message: "Not owner of event" })
            }),

    signupForEvent:
        protectedProcedure
            .input(z.object({ eventId: z.string() }))
            .mutation(({ input, ctx }) => {
                // console.log("------------signupForEvent.input", input)
                return signupToEvent(input.eventId, ctx.session.user.id)
            }),
    getEventAttendes:
        protectedProcedure
            .input(z.object({
                eventId: z.string()
            }))
            .query(({ input, ctx }) => {
                // console.log("------------getEventAttendes.input", input)
                return getEventAttendes(ctx.session.user.id, input.eventId)
            }),

    getEventMessages:
        protectedProcedure
            .input(z.object({ eventId: z.string() }))
            .query(({ input, ctx }) => {
                // console.log("------------getEventAttendes.input", input)
                return getEventMessages(ctx.session.user.id, input.eventId)
            }),

    postEventMessage:
        protectedProcedure
            .input(postEventMessage)
            .mutation(({ input, ctx }) => {
                // console.log("------------postEventMessage.input", input)
                // console.log("ctx", ctx)
                // console.log("ctx.session", ctx.session)
                // console.log("ctx.session.user.", ctx.session.user)
                // console.log("ctx.session.user.name", ctx.session.user.name)
                return postEventMessageFirebase(input.eventId, input.wallmessage, ctx.session.user.name as string)
            }),


})