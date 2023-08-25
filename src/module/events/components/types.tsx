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

const Cat = z.object({
    id: z.number(),
    name: z.string(),
});
const Cats = z.array(Cat);



export type Cat = z.infer<typeof Cat>;
export type Cats = z.infer<typeof Cats>;