import { type NextPage } from "next";
import Link from "next/link";
import { api } from "~/utils/api";
import HighlightText from "~/components/HighlightText";

import { type NopEvent } from "~/module/events/components/types";
import Layout from "~/components/Layout";
import { Spinner } from "~/components/Spinner";

const Home: NextPage = () => {
    //const hello = api.example.hello.useQuery({ text: "from tRPC" });

    const events = api.event.getAllEvents.useQuery();

    const eventRender = (event: NopEvent) => {

        return (
            <div className="col-span-2" key={event.id}>
                <Link
                    className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                    href={"event/" + event.id}
                >

                    <h3 className="text-2xl font-bold"><HighlightText>{event.title}</HighlightText></h3>
                    <div className="text-lg">
                        {event.when}
                    </div>
                    <div className="text-lg whitespace-pre-wrap">
                        {event.description}
                    </div>
                    <div className="p-2">

                        <button
                            className="rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-opacity-75 hover:bg-white/20">
                            {event.options.signupOpen ? "Läs mer och anmäl er" : "Läs mer"}
                        </button>

                    </div>
                </Link>
            </div>
        );
    };

    const renderNoEvents = () => {
        return (
            <div className="flex flex-col col-span-2 gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                <h3 className="text-2xl font-bold"><HighlightText>Inga träffar planerade...</HighlightText></h3>
                <div className="text-lg">
                    <p>Just nu har vi inga träffar planerade, men återkom snart så har vi säkerligen något kul på gång 😘 </p>
                </div>
            </div>
        );
    };
    const renderLoading = () => {
        return (
            <div className="flex flex-col col-span-2 gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                <h3 className="text-2xl font-bold"><HighlightText>Laddar...</HighlightText></h3>
                <div className="text-lg">
                    <p>Den som väntar på något gott 😘 </p>
                </div>
                <Spinner />
            </div>
        );
    };

    //console.log("events: -> events.data:", events.data)

    return (
        <Layout headingText={<>Träffar med <span className="text-[hsl(280,100%,70%)]">Night of Passion</span></>}>

            <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                {events.isLoading ? renderLoading() : null}
                {events.data?.map((event) => { return eventRender(event); })}
                {events.data && events.data.length == 0 ? renderNoEvents() : null}
            </div>


        </Layout>
    );
};

export default Home;

