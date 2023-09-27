import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import HighlightText from "~/components/HighlightText";

import { useRouter } from 'next/router'
import { api } from "~/utils/api";
import Link from "next/link";
import { useState } from "react";
import EventDescription from "~/module/events/components/EventDescription"
import { SwishQR } from "~/components/SwishQR/SwishQR"
import Layout from "~/components/Layout";


const Home: NextPage = () => {
    //const hello = api.example.hello.useQuery({ text: "from tRPC" });
    const router = useRouter();
    const { eventid } = router.query;
    const { data: sessionData } = useSession();
    //console.log("router.asPath: ", router.asPath)
    //sessionData?.user?.append("name1") = "jw"

    const [attendingToEvent, setAttendToEvent] = useState(false)

    const queryInput = { eventId: eventid as string }
    const event = api.event.getEvent.useQuery(queryInput,
        { enabled: sessionData?.user !== undefined })


    const { mutate: eventSignUp } = api.event.signupForEvent.useMutation()
    const attendToEventHandler = () => {
        //console.log("attendToEventHandler")
        setAttendToEvent(true)
        eventSignUp({ eventId: eventid as string })
    }

    const renderAttending = () => {
        return renderAttendingToSkargardsParty()
    }

    const renderAttendingToSkargardsParty = () => {
        return (
            <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                <div className="col-span-2">
                    <div
                        className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                    >
                        <h3 className="text-2xl font-bold"><HighlightText>Snart klart...</HighlightText></h3>
                        <div className="text-lg whitespace-pre-wrap">
                            Vad kul att ni vill hänga med på skärgårdsfest 🎉🍸🍾

                        </div>
                        <div className="text-lg whitespace-pre-wrap">
                            Ännu går det inte riktigt att anmäla sig på vår site.
                            Istället så får skicka ett mail till <a className="text-[hsl(280,100%,70%)]" href="mailto:fest@nightofpassion.se">fest@nightofpassion.se</a> och anmäla er 😀
                        </div>
                        <div className="text-lg whitespace-pre-wrap">
                            Vänta inte med att skicka in er anmälan.
                            Det är inte först till kvarn, vi försöker hitta en bra blandning på paren som gör att alla ska trivas ihop på festen.
                            Det gör att det kan dröja innan vi bekräftar er plats.
                        </div>

                        <div className="text-lg whitespace-pre-wrap">
                            Kram på er så länge 😘
                        </div>


                    </div>
                </div>
            </div>)


    }

    const renderAttendingToCocktailMeet = () => {
        return (
            <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                <div className="col-span-2">
                    <div
                        className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                    >
                        <h3 className="text-2xl font-bold"><HighlightText>Välkommen på Cocktailträff 🎉🍸🍾</HighlightText></h3>
                        <div className="text-lg whitespace-pre-wrap">
                            Kostnaden för träffen är 100:- som ni swishar till 0700066099, märk er betalning med era namn (ex Jonas & Malin).
                            Eller så öppnar ni upp er swish app och skannar QR koden nedan.
                        </div>
                        <div>
                            <SwishQR />
                        </div>
                        <div className="text-lg whitespace-pre-wrap">
                            Efter betalningen så kommer vi lägga till er till träffen och ni kan då se vilka andra som har anmält sig.
                        </div>

                        <div className="text-lg whitespace-pre-wrap">
                            Vi kommer att maila ut mer info några dagar innan träffen. Då berättar vi vilket ställe vi ska ses på. Håll utkik i er mailkorg.
                        </div>

                    </div>
                </div>
            </div>)
    }

    const renderEventClosedForSignup = () => {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-wrap justify-center justify-self-center">
                    <div className="p-2" >
                        <button
                            className="rounded-sm bg-pink-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                            Träffen stängd för anmälan
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (event.isLoading || false) {

        return (
            <Layout headingText={<>Laddar <HighlightText>träff</HighlightText>...</>}>

                <div className="flex pb-8">
                    <div className="relative ">
                        <div className="w-12 h-12 rounded-full absolute
                            border-8 border-solid border-gray-200"></div>
                        <div className="w-12 h-12 rounded-full animate-spin absolute
                            border-8 border-solid border-[hsl(280,100%,70%)] border-t-transparent shadow-md"></div>
                    </div>
                </div>

            </Layout>
        )

    }

    if (!event.data) {
        return <p>hittar ingen träff...</p>
    }

    const e = event.data


    return (
        <Layout headingText={<>Träff med <HighlightText>Night of Passion</HighlightText></>}>
            <EventDescription event={e} />
            {e.options.signupOpen ?
                (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex flex-wrap justify-center justify-self-center">
                            {e.options.showParticipants ?
                                (<div className="p-2" >
                                    <Link href={router.asPath + "/attendes"}>
                                        <button
                                            className="rounded-full bg-white/10 bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                                            Vilka kommer på träffen?
                                        </button>
                                    </Link>
                                </div>) : null}

                            <div className="p-2" >

                                <button
                                    onClick={() => attendToEventHandler()}
                                    className="rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-opacity-75">
                                    Anmäl er till träffen
                                </button>
                            </div>
                            {/* {BUTTONS.map(button => renderButton(button))} */}
                        </div>
                    </div>
                ) : renderEventClosedForSignup()}
            {attendingToEvent ? renderAttending() : null}

        </Layout>
    );
};


export default Home;

