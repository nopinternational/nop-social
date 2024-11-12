import { type FC } from "react";
import { type NopEvent } from "./types";
import HighlightText from "~/components/HighlightText";

const EventAttendes: FC<{ event: NopEvent }> = ({ event }) => {
    return (
        <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
            <div className="col-span-2">
                <div
                    className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                >
                    <h3 className="text-2xl font-bold"><HighlightText>{event.title}</HighlightText></h3>
                    <div className="text-lg whitespace-pre-wrap">
                        {event.when}
                    </div>
                    <div className="text-lg whitespace-pre-wrap">
                        {event.longDesc}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventAttendes;
