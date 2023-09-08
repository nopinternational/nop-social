import { type DocumentData } from "firebase/firestore";
import { z } from "zod";
const nopEvent = z.object(
    {
        id: z.string(),
        name: z.string(),
        title: z.string(),
        description: z.string(),
        longDesc: z.string(),
        when: z.string(),
        signupOpen: z.boolean()
    })

export type NopEvent = z.infer<typeof nopEvent>

export type ConfirmedUser = {
    name: string,
    id: string
    username?: string
}

export interface EventFirestoreModel extends DocumentData  {
    name: string,
    title: string,
    description: string,
    longDesc: string,
    when: string,
    signupOpen: boolean
}

export interface EventMessage {
    from: {
        uid: string,
        username: string
    }
    message: string,
    when: string
}

export const postEventMessage = z.object({
    eventId: z.string(),
    wallmessage: z.string(),
    from: z.string()
})

export type PostEventMessage = z.infer<typeof postEventMessage>

