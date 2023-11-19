import React, { type ChangeEvent, useState } from "react"

export type EventFormType = {
    title: string
    when: string
    shortDesc: string
    longDesc: string
    options: EventOptions
}

export type EventInformation = {
    title: string
    when: string
    shortDesc: string
    longDesc: string
}

export type EventOptions = {
    active: boolean
    showParticipants: boolean
    signupOpen: boolean
}

const DEFAULT_EVENT: EventFormType = {
    title: "title",
    when: "närsomhelst",
    shortDesc: "detta är en kort beskrivning",
    longDesc: "##markdown",
    options: {
        active: false,
        showParticipants: false,
        signupOpen: false
    }
}
const getInitialEventInformation = (event: EventFormType): EventInformation => {
    if (event) {
        return {
            title: event.title,
            when: event.when,
            shortDesc: event.shortDesc,
            longDesc: event.longDesc
        }
    }
    return {
        title: DEFAULT_EVENT.title,
        when: DEFAULT_EVENT.when,
        shortDesc: DEFAULT_EVENT.shortDesc,
        longDesc: DEFAULT_EVENT.longDesc
    }

}

export const NoPEventForm = ({ event, onCreateHandler }: { event?: EventFormType, onCreateHandler?: (e: EventFormType) => void }) => {
    // console.log("EventForm.event", event)
    const [eventInformation, setEventInformation] = useState<EventInformation>(getInitialEventInformation(event))
    const [eventOptions, setEventOptions] = useState<EventOptions>(event?.options || DEFAULT_EVENT.options)


    const createEvent = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        const combined: EventFormType = { ...eventInformation, options: eventOptions }
        onCreateHandler && onCreateHandler(combined)
    }

    function updateEventInformation(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setEventInformation((e: EventInformation) => {
            const newEvnt = { ...e }
            const keyName: string = event.target.name;
            const eventVal: string = event.target.value

            console.log("updateEvent.newEvnt old value", newEvnt[keyName as keyof typeof e])


            newEvnt[keyName as keyof typeof e] = eventVal
            return newEvnt
        })
    }

    return (
        <form className="p-2" >
            <div className="m-2">Titel</div>
            <input
                className="w-full px-3 py-3 rounded-lg text-black"
                name="title" value={eventInformation.title}
                onChange={updateEventInformation} /><br />

            <div className="m-2">När</div>
            <input className="w-full px-3 py-3 rounded-lg text-black"
                name="when" value={eventInformation.when}
                onChange={updateEventInformation} /><br />

            <div className="m-2">Kort beskrivning</div>
            <textarea className="w-full px-3 py-3 rounded-lg text-black"
                rows={5}
                name="shortDesc" value={eventInformation.shortDesc}
                onChange={updateEventInformation}  ></textarea>

            <div className="m-2">Lång beskrivning</div>
            <textarea className="w-full px-3 py-3 rounded-lg text-black"
                rows={5}
                name="longDesc"
                value={eventInformation.longDesc}
                onChange={updateEventInformation} ></textarea>

            <div className="m-2">Options...</div>

            <button
                className="mt-4 mb-3 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => createEvent(event)}>Spara</button>
        </form>
    )
}

