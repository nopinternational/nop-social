import { type NextPage } from "next";
import { type ChangeEvent, useState } from "react";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";


const Home: NextPage = () => {



    return (
        <Layout headingText={<>Ordna en <HighlightText>träff</HighlightText></>}>
            <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                <div className="col-span-2">
                    <Card header={<>Ordna <HighlightText>träff</HighlightText></>}>
                        Skapa en träff och samla alla sexiga par i <HighlightText>Night of Passion</HighlightText>
                    </Card>

                    <Card header="Detaljer">
                        <EventForm></EventForm>
                    </Card>


                </div>
            </div>
        </Layout>
    );
};

type EventFormType = {
    title: string
    when: string
    shortDesc: string
    longDesc: string
    options: EventOptions
}

type EventOptions = {
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
const EventForm = ({ event }: { event?: EventFormType }) => {
    console.log("EventForm.event", event)
    const [evnt, setEvnt] = useState<EventFormType>(event || DEFAULT_EVENT)

    const createEvent = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        console.log("create Event", e.target)
    }

    function updateEvent(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        event.preventDefault()
        console.log("EventForm.event", event.target)
        console.log("EventForm.event", event.target.name)
        console.log("EventForm.event", event.target.value)
        setEvnt((e: EventFormType) => {
            console.log("e:", e)
            const newEvnt = { ...e }
            console.log("newEvnt:", e)
            newEvnt[event.target.name] = event.target.value
            console.log("newEvnt:", e)
            return newEvnt
        })

        // const obj = {}
        // obj[event.target.name] = event.target.value
        // setEvnt(obj)
    }

    console.log("evnt", evnt)

    function desco(event: ChangeEvent<HTMLTextAreaElement>): void {
        throw new Error("Function not implemented.");
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
EventForm.defaultProps = DEFAULT_EVENT

export default Home;

