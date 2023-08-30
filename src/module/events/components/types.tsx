import { z } from "zod";
const NopEvent = z.object(
    {
        id: z.string(),
        name: z.string(),
        title: z.string(),
        description: z.string(),
        longDesc: z.string(),
        when: z.string()
    })

export type NopEvent = z.infer<typeof NopEvent>

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
    when: string
}

