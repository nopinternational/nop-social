import { z } from "zod";
const nopEvent = z.object(
    {
        id: z.string(),
        name: z.string(),
        title: z.string(),
        description: z.string(),
        longDesc: z.string(),
        when: z.string()
    })

export type NopEvent = z.infer<typeof nopEvent>

export type ConfirmedUser = {
    name: string,
    id: string
}

export type EventFirestoreModel = {
    name: string,
    title: string,
    description: string,
    longDesc: string,
    when: string
}

export interface EventMessage {
    from: {
        uid: string,
        username: string
    }
    message: string,
    when: number
}

export const postEventMessage = z.object({
    eventId: z.string(),
    wallmessage: z.string(),
    from: z.string()
})

export type PostEventMessage = z.infer<typeof postEventMessage>

