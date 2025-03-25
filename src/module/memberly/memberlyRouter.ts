import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const MEMBERLY_MEMBERSHIP_ID = process.env.MEMBERLY_MEMBERSHIP_ID as string;
const MEMBERLY_API_TOKEN = process.env.MEMBERLY_API_TOKEN as string;

export const memberlyRouter = createTRPCRouter({

    initiateTicketPayment: protectedProcedure
        .input(z.object({ eventId: z.string() }))
        .query(({ input, ctx }) => {
            return startTicketPaymentClient(input.eventId, ctx.session.user.email, ctx.session.user.id);
        })
});

// const memberlyInitTicketPay = (foo: string): string => {
//     console.log("memberlyInitTicketPay");
//     startTicketPaymentClient();
//     return "Hello from memberlyInitTicketPay " + foo;
// };


export type MemberlyInitTicketPayResponse = {
    userToken: string,
    acquireMembershipUrl: string,
    acquireTicketUrl: string
}

const startTicketPaymentClient = async (eventId: string, userEmail: string, userId: string): Promise<MemberlyInitTicketPayResponse> => {
    // console.log("---------------------------");
    // console.log("startTicketPayment for event: ", eventId);
    // console.log("MEMBERLY_API_TOKEN", MEMBERLY_API_TOKEN);
    // console.log("MEMBERLY_MEMBERSHIP_ID", MEMBERLY_MEMBERSHIP_ID);
    // console.log("---------------------------");

    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im9yZ2FuaXphdGlvbklkIjoiY201dmFnaWtmMDAwNjJ0a3ZxNjJuOXc1ZSIsImFjY2VzcyI6eyJyZWFkIjp0cnVlLCJ3cml0ZSI6dHJ1ZX19LCJjcmVhdGVkIjoiMjAyNS0wMy0wNVQxNjowNzozMC4zNzVaIiwiaWF0IjoxNzQxMTkwODUwfQ.8CB8pR9O9h_-dCGXV5tvz-m9RK1yAtsGfmyEH5_MSKs";
    // const membershipTypeId = "cm5vaigbt000e2tkvrfdnkk0j";
    
    
    const apitoken = MEMBERLY_API_TOKEN;
    const membershipTypeId = MEMBERLY_MEMBERSHIP_ID;
    
    
    const bodyJson = {
        email: userEmail,
        eventId: eventId,
        membershipTypeId,
        membershipPaid: true,
        externalUserId: userId
    };

    const body = JSON.stringify(bodyJson);
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apitoken,
        "x-nop": "fockbar"
    };

    const res = await fetch("https://memberly.se/api/user-token/v1", {
        method: "POST",
        // mode: "no-cors",
        headers: headers,
        body: body,
    });
    // console.log("-----------------");
    // console.log("req.body", body, bodyJson);
    // console.log("req.headers", headers);
    // console.log("-----------------");
    // console.log(res.status, res.statusText);
    // console.log("-----------------");
    const jsn = await res.json() as MemberlyInitTicketPayResponse;
    // console.log("json response goes here ---");
    // console.log(jsn);
    // console.log("-----------------");
    return jsn ;

};