import React, { type ChangeEvent, useState } from "react"

export type EventFormType = {
    title: string
    when: string
    shortDesc: string
    longDesc: string
    //options?: EventOptions
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
    // options: {
    //     active: false,
    //     showParticipants: false,
    //     signupOpen: false
    // }
}

export const NoPEventForm = ({ event, onCreateHandler }: { event?: EventFormType, onCreateHandler?: (e: EventFormType) => void }) => {
    // console.log("EventForm.event", event)
    const [evnt, setEvnt] = useState<EventFormType>(event || DEFAULT_EVENT)

    const createEvent = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        onCreateHandler && onCreateHandler(evnt)
    }

    function updateEvent(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setEvnt((e: EventFormType) => {
            const newEvnt = { ...e }
            const keyName: string = event.target.name;
            const eventVal: string = event.target.value
            newEvnt[keyName as keyof EventFormType] = eventVal
            return newEvnt
        })
    }

    return (
        <form className="p-2" >
            <div className="m-2">Titel</div>
            <input
                className="w-full px-3 py-3 rounded-lg text-black"
                name="title" value={evnt.title}
                onChange={updateEvent} /><br />

            <div className="m-2">När</div>
            <input className="w-full px-3 py-3 rounded-lg text-black"
                name="when" value={evnt.when}
                onChange={updateEvent} /><br />

            <div className="m-2">Kort beskrivning</div>
            <textarea className="w-full px-3 py-3 rounded-lg text-black"
                rows={5}
                name="shortDesc" value={evnt.shortDesc}
                onChange={updateEvent}  ></textarea>

            <div className="m-2">Lång beskrivning</div>
            <textarea className="w-full px-3 py-3 rounded-lg text-black"
                rows={5}
                name="longDesc"
                value={evnt.longDesc}
                onChange={updateEvent} ></textarea>

            <div className="m-2">Options...</div>

            <button
                className="mt-4 mb-3 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => createEvent(event)}>Ändra</button>
        </form>
    )
}

