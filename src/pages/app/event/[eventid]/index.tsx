import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import HighlightText from "~/components/HighlightText";

import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import EventDescription from "~/module/events/components/EventDescription";
import { SwishQR } from "~/components/Swish/SwishQR/SwishQR";
import Layout from "~/components/Layout";
import { Spinner } from "~/components/Spinner";
import { Card } from "~/components/Card";
import { CocktailSwishButton } from "~/components/Swish/SwishButton/SwishButton";
import { type NopEvent } from "~/module/events/components/types";
import { type Session } from "next-auth";
import { AttendingAndPayWithSodality } from "~/module/events/components/SodalityTicketAttenting";

const Home: NextPage = () => {
    //const hello = api.example.hello.useQuery({ text: "from tRPC" });
    const router = useRouter();
    const { eventid } = router.query;
    const session = useSession();
    const { data: sessionData } = session;
    //console.log("router.asPath: ", router.asPath)
    //sessionData?.user?.append("name1") = "jw"

    const [attendingToEvent, setAttendToEvent] = useState(false);

    const queryInput = { eventId: eventid as string };
    const event = api.event.getEvent.useQuery(queryInput, {
        enabled: sessionData?.user !== undefined,
    });
    const myEventStatus = api.event.getMyEventStatus.useQuery(queryInput, {
        enabled: sessionData?.user !== undefined,
    });

    useEffect(() => {
        if (myEventStatus.data) setAttendToEvent(true);
    }, [myEventStatus.data]);

    const { mutate: eventSignUp } = api.event.signupForEvent.useMutation();
    const attendToEventHandler = () => {
    //console.log("attendToEventHandler")
        setAttendToEvent(true);
        eventSignUp({ eventId: eventid as string });
    };

    const renderEventClosedForSignup = () => {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-wrap justify-center justify-self-center">
                    <div className="p-2">
                        <button className="rounded-sm bg-pink-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
              Träffen stängd för anmälan
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (event.isLoading || false) {
        return (
            <Layout
                headingText={
                    <>
            Laddar <HighlightText>träff</HighlightText>...
                    </>
                }
            >
                <Spinner />
            </Layout>
        );
    }

    if (!event.data) {
        return (
            <Layout
                headingText={
                    <>
            Ingen <span className="text-[hsl(280,100%,70%)]">träff</span> här
                    </>
                }
            >
                <div className="grid grid-cols-2  gap-4   sm:grid-cols-2 md:gap-8">
                    <div className="col-span-2 p-2">
                        <Card header="Det finns ingen träff här...">
              Vi är ledsna men vi hittar inte träffen du söker 😔
                        </Card>
                    </div>
                </div>
            </Layout>
        );
    }

    const e: NopEvent = event.data;


    return (
        <Layout
            headingText={
                <>
          Träff med <HighlightText>Night of Passion</HighlightText>
                </>
            }
        >
            <EventDescription event={e} />
            {e.options.signupOpen ? null : renderEventClosedForSignup()}
            {e.options.signupOpen && !attendingToEvent ? (
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-wrap justify-center justify-self-center">
                        <div className="p-2">
                            <button
                                onClick={() => attendToEventHandler()}
                                className="rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-opacity-75"
                            >
                Anmäl er till träffen
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
            {e.options.showParticipants ? (
                <div className="p-2">
                    <Link href={router.asPath + "/attendes"}>
                        <button className="rounded-full bg-[hsl(280,100%,70%)] bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
              Vilka kommer på träffen?
                        </button>
                    </Link>
                </div>
            ) : null}

            {attendingToEvent && e.options.signupOpen ? (
                <Attending event={e} session={session.data} />
            ) : null}
            {attendingToEvent && !e.options.signupOpen ? (
                <>
                    <EventIsClosedForAttendes />
                    <Attending event={e} session={session.data} />
                </>
            ) : null}
        </Layout>
    );
};

const EventIsClosedForAttendes = () => {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-8">
            <div className="col-span-2">
                <Card
                    header={
                        <>
              Anmälan är <HighlightText>stängd</HighlightText>
                        </>
                    }
                >
          Ni är anmälda till träffen men det går inte längre att amäla sig till
          träffen. Nedan finns information om hur ni betalar för träffen, om ni
          ännu inte gjort det.
                </Card>
            </div>
        </div>
    );
};

type AttendingToCocktailMeetProps = {
  eventTitle: string;
  username?: string | null;
};

const Attending = ({
    event,
    session,
}: {
  event: NopEvent;
  session: Session | null;
    }) => {
    if (event.options.ticketUrl) {
        return <AttendingAndPayWithSodality ticketUrl={event.options.ticketUrl}/>;
    }
    if (event.options.customSignupPage) {
        return <AttendingToSkargardsParty />;
    }

    return (
        <AttendingToCocktailMeet
            eventTitle={event.title}
            username={session?.user.name}
        />
    );
};


const AttendingToSkargardsParty = () => {
    return (
        <div className="grid grid-cols-2  gap-4   sm:grid-cols-2 md:gap-8">
            <div className="col-span-2">
                <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                    <h3 className="text-2xl font-bold">
                        <HighlightText>Er anmälan är registrerad</HighlightText>
                    </h3>
                    <div className="whitespace-pre-wrap text-lg">
            Vad kul att ni vill hänga med på skärgårdsfest 🎉🍸🍾
                    </div>
                    <div className="whitespace-pre-wrap text-lg">
            Vi har nu registrerat er anmälan att ni vill vara med. Vi
            eftersträvar att få en bra blandning på paren, så att alla ska känna
            sig trygga och bekväma. Det gör att det kan dröja innan vi bekräftar
            er plats. From söndagen 29/9 kommer vi att börja bjuda in par som
            anmält sitt intresse.
                    </div>
                    <div className="whitespace-pre-wrap text-lg">
            Vi kommer att använda den email som ni använder för att logga in på
            Night of Passion för att skicka en ev inbjudan. Där finns även
            instruktioner för hur festavgiften om 3500kr ska betalas.
                    </div>
                    <div className="whitespace-pre-wrap text-lg">
            Har ni frågor eller funderingar så kan ni skicka ett mail till{" "}
                        <a
                            className="text-[hsl(280,100%,70%)]"
                            href="mailto:fest@nightofpassion.se"
                        >
              fest@nightofpassion.se
                        </a>
                    </div>

                    <div className="whitespace-pre-wrap text-lg">
            Kram på er så länge 😘
                    </div>
                </div>
            </div>
        </div>
    );
};
const AttendingToCocktailMeet = ({
    eventTitle,
    username,
}: AttendingToCocktailMeetProps) => {
    //const username = sessionData?.user.name;
    const getSwishMessage = (username: string | undefined | null): string => {
        if (username) {
            return eventTitle + ": " + username;
        }
        return "Ert användarnamn och era namn här";
    };

    const swishMessage = getSwishMessage(username);
    return (
        <div className="grid grid-cols-2  gap-4   sm:grid-cols-2 md:gap-8">
            <div className="col-span-2">
                <Card
                    header={
                        <>
              Välkommen på <HighlightText>Cocktailträff 🎉🍸🍾</HighlightText>
                        </>
                    }
                >
                    <div className="text-lg ">
            Nu är ni anmälda och nedan finns information hur ni betalar för
            träffen. Efter betalningen så kommer vi lägga till er till träffen
            och ni kan då se vilka andra som har anmält sig.
                    </div>
                    <div className="text-lg ">
            Vi kommer att maila ut mer info några dagar innan träffen. Då
            berättar vi vilket ställe vi ska ses på. Håll utkik i er mailkorg.
                    </div>
                </Card>
                <Card
                    header={
                        <>
                            <HighlightText>Betala</HighlightText> för träffen
                        </>
                    }
                >
                    <div className="whitespace-pre-wrap text-lg">
            Kostnaden för träffen är 100:- som ni swishar till 0700066099. Märk
            er betalning med ert användarnamn ex &quot;passion-couple&quot;.
                    </div>
                    <div>
            Är ni på samma enhet som ni har Swish-appen installerad kan ni
            klicka på knappen nedan för att betala.
                    </div>
                    <div className="flex items-center justify-center">
                        <CocktailSwishButton message={swishMessage} />
                    </div>
                    <div>
            Eller så öppnar ni upp er swish app och skannar QR koden nedan.
                    </div>
                    <div className="p-2">
                        <SwishQR />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Home;
