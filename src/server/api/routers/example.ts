import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "../trpc";


export const exampleRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    getSecretMessage: protectedProcedure.query(() => {
    // console.log("api.routes.example, all fine!!!")
        return "you can now see this secret message!";
    }),
});
