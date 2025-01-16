import { type NextApiRequest, type NextApiResponse } from "next/types";

type Ticket = {
    ticketNumber:number
    email: string
    ticketName: string
}
const tickets: Ticket[] = [
    {
        ticketNumber: 123,
        email: "foo@mail.com",
        ticketName: "eventticket",
    },
    
    {
        ticketNumber: 456,
        email: "bar@example.com",
        ticketName: "eventticket",
    },

];

export default function handler(
    _req: NextApiRequest,
    res: NextApiResponse
) {
    res.status(200).json(tickets);
}