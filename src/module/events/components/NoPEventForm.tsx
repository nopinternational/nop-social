import React, { type ChangeEvent, useState } from "react";
import { Toggle } from "~/components/Toogle";

export type EventFormType = {
    title: string;
    when: string;
    description: string;
    longDesc: string;
    options: EventOptions;
    order: number;
};

export type EventInformation = {
    title: string;
    when: string;
    description: string;
    longDesc: string;
    order: number;
    options: EventOptions;
};

export type EventToggleOptions = {
    active: boolean;
    showParticipants: boolean;
    signupOpen: boolean;
    customSignupPage: boolean;
};

export type EventOptions = {
    active: boolean;
    showParticipants: boolean;
    signupOpen: boolean;
    customSignupPage: boolean;
    ticketUrl: string;
};

const DEFAULT_EVENT: EventFormType = {
    title: "title",
    when: "närsomhelst",
    description: "detta är en kort beskrivning",
    longDesc: "##markdown",
    options: {
        active: true,
        showParticipants: false,
        signupOpen: false,
        customSignupPage: false,
        ticketUrl: "",
    },
    order: 10000,
};
const getInitialEventInformation = (
    event?: EventFormType
): EventInformation => {
    if (event) {
        return {
            title: event.title,
            when: event.when,
            description: event.description,
            longDesc: event.longDesc,
            order: event.order,
            options: event.options,
        };
    }
    return {
        title: DEFAULT_EVENT.title,
        when: DEFAULT_EVENT.when,
        description: DEFAULT_EVENT.description,
        longDesc: DEFAULT_EVENT.longDesc,
        order: DEFAULT_EVENT.order,
        options: DEFAULT_EVENT.options,
    };
};

export const NoPEventForm = ({
    event,
    onCreateHandler,
}: {
    event?: EventFormType;
    onCreateHandler?: (e: EventFormType) => void;
}) => {
    const [eventInformation, setEventInformation] = useState<EventInformation>(
        getInitialEventInformation(event)
    );

    const initialOptions: EventOptions = {
        ...DEFAULT_EVENT.options,
        ...event?.options,
    };

    const [eventOptions, setEventOptions] =
        useState<EventOptions>(initialOptions);
    const [isSaving, setIsSaving] = useState(false);

    const createEvent = (e: React.MouseEvent<HTMLButtonElement>): void => {
        if (onCreateHandler) {
            setIsSaving(true);
            e.preventDefault();
            const combined: EventFormType = {
                ...eventInformation,
                options: eventOptions,
            };
            onCreateHandler(combined);
            setIsSaving(false);
        }
        return;
    };

    const updateEventInformation = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        setEventInformation((e: EventInformation) => {
            const newEvnt: EventInformation = { ...e };
            const keyName: string = event.target.name;
            const eventVal = event.target.value;
            if (keyName === "order") {
                newEvnt["order"] = parseInt(eventVal);
            } else {
                // ? parseInt(event.target.value) : event.target.value;
                // newEvnt[keyName] = eventVal;
                // newEvnt[keyName as keyof typeof e] = eventVal;
                setKeyValue(newEvnt, keyName as keyof typeof e, eventVal);
            }
            return newEvnt;
        });
    };

    const setKeyValue = <K extends keyof EventInformation>(
        eventInformation: EventInformation,
        key: K,
        value: EventInformation[K]
    ) => {
        eventInformation[key] = value;
    };

    const toggleOption = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const name: string = e.target.name;
        setEventOptions((options) => {
            const newOptions = { ...options };
            const newVal = !options[name as keyof EventToggleOptions];
            newOptions[name as keyof EventToggleOptions] = newVal;
            return newOptions;
        });
    };

    const updateOptionTicketUrl = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        setEventOptions((options) => {
            const newOptions = { ...options };
            const eventVal = event.target.value;
            newOptions["ticketUrl"] = eventVal;
            return newOptions;
        });
    };

    return (
        <form className="p-2">
            <div className="m-2">Titel</div>
            <input
                className="w-full rounded-lg px-3 py-3 text-black"
                name="title"
                value={eventInformation.title}
                onChange={updateEventInformation}
            />
            <br />

            <div className="m-2">När (text)</div>
            <input
                className="w-full rounded-lg px-3 py-3 text-black"
                name="when"
                value={eventInformation.when}
                onChange={updateEventInformation}
            />
            <br />
            <div className="m-2">order</div>
            <input
                className="w-full rounded-lg px-3 py-3 text-black"
                name="order"
                type="number"
                value={eventInformation.order}
                onChange={updateEventInformation}
            />
            <br />

            <div className="m-2">Kort beskrivning</div>
            <textarea
                className="w-full rounded-lg px-3 py-3 text-black"
                rows={5}
                name="description"
                value={eventInformation.description}
                onChange={updateEventInformation}
            ></textarea>

            <div className="m-2">Lång beskrivning</div>
            <textarea
                className="w-full rounded-lg px-3 py-3 text-black"
                rows={5}
                name="longDesc"
                value={eventInformation.longDesc}
                onChange={updateEventInformation}
            ></textarea>

            <div className="m-2">Options...</div>
            <Toggle
                name="active"
                optionText="Träffen aktiv?"
                checked={eventOptions.active}
                onClick={toggleOption}
            />
            <br />
            <Toggle
                name="signupOpen"
                optionText="Anmälan öppen?"
                checked={eventOptions.signupOpen}
                onClick={toggleOption}
            />
            <br />

            <Toggle
                name="showParticipants"
                optionText="Visa deltagare?"
                checked={eventOptions.showParticipants}
                onClick={toggleOption}
            />
            <br />

            <Toggle
                name="customSignupPage"
                optionText="Custom anmälningssida"
                checked={eventOptions.customSignupPage}
                onClick={toggleOption}
            />
            <div className="m-2">Ticket url</div>
            <input
                className="w-full rounded-lg px-3 py-3 text-black"
                name="order"
                type="text"
                value={eventOptions.ticketUrl}
                onChange={updateOptionTicketUrl}
            />
            <p className="italic">Om ticket url anges så spelar Custom anmälningssida ingen roll.</p>
            <br />

            {isSaving ? (
                <button
                    className="mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                    onClick={(event) => createEvent(event)}
                >
                    <svg
                        aria-hidden="true"
                        role="status"
                        className="mr-2 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        ></path>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#1C64F2"
                        ></path>
                    </svg>
                    Spara
                </button>
            ) : (
                <button
                    className="mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                    onClick={(event) => createEvent(event)}
                >
                    Spara
                </button>
            )}
        </form>
    );
};

