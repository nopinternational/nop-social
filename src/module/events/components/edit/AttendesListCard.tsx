import { Card } from "~/components/Card";
import { EventAttendes } from "../EventAttendes";

export const AttendesListCard = ({ eventid }: { eventid: string }) => {
    return (
        <Card header="Deltagare">
            <EventAttendes eventid={eventid} />
        </Card>
    );
};
