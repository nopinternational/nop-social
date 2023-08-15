import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
//import Link from "next/link";
import SigninButton from "~/components/SigninButton";
//import { EVENTS, type Event } from "~/lib/event/events";
import { useRouter } from 'next/router'
import { api } from "~/utils/api";
//import React, { useEffect, useState } from "react";



const Home: NextPage = () => {
    //const hello = api.example.hello.useQuery({ text: "from tRPC" });
    const router = useRouter();
    const { eventid } = router.query;
    const { data: sessionData } = useSession();

    // const [event, setEvent] = useState<Event | undefined>(undefined)

    // useEffect(() => {
    //     const loadedevent = EVENTS.find(event => {
    //         console.log(" EVENTS.find->event", event);
    //         console.log(" EVENTS.find->event.id == eventid", event.id == eventid);
    //         return event.id == eventid;
    //     })
    //     console.log(" EVENTS.find->loadedevent", loadedevent);

    //     if (!loadedevent) {
    //         console.log("NO EVENT FOUND", loadedevent)
    //         console.log("NO EVENT FOUND", !loadedevent)
    //         void router.push('/app/event/event_not_found')
    //     }
    //     setEvent(loadedevent)
    // })
    const queryInput = { eventId: eventid as string }
    console.log("queryInput", queryInput, "as: " + typeof queryInput)
    console.log("queryInput.eventId", queryInput.eventId, "as: " + typeof queryInput.eventId)
    const event = api.event.getEvent.useQuery(queryInput,
        { enabled: sessionData?.user !== undefined })

    if (event.isLoading || false) {
        return <p>laddar träff...</p>
    }

    if (!event.data) {
        return <p>hittar ingen träff...</p>
    }

    const e = event.data
    console.log(e)
    return (
        <>
            <Head>
                <title>Night of Passion</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center">
                        Träff med <span className="text-[hsl(280,100%,70%)]">Night of Passion</span>
                    </h1>

                    <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                        <div className="col-span-2">
                            <div
                                className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                            >

                                <h3 className="text-2xl font-bold">{e.title}</h3>
                                <div className="text-lg">
                                    {e.description}
                                </div>

                                <div className="text-lg whitespace-pre-wrap">
                                    {e.longDesc}
                                </div>


                            </div>
                        </div>

                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <SigninButton />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;

