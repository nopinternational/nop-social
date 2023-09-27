import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import HighlightText from "~/components/HighlightText";
import Footer from "~/components/Footer";
import { useRouter } from 'next/router'
import { api } from "~/utils/api";
import Link from "next/link";
import { EventAttendes } from "~/module/events/components/EventAttendes"
import { EventMessages } from "~/module/events/components/EventMessages";
import Layout from "~/components/Layout";


const Home: NextPage = () => {
    //const hello = api.example.hello.useQuery({ text: "from tRPC" });
    const router = useRouter();
    let { eventid } = router.query;
    eventid = eventid as string;
    const { data: sessionData } = useSession();
    //console.log("session: ", sessionData)
    //sessionData?.user?.append("name1") = "jw"

    const queryInput = { eventId: eventid }
    const event = api.event.getEvent.useQuery(queryInput,
        { enabled: sessionData?.user !== undefined })

    if (event.isLoading || false) {
        return (
            <Layout>
                <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                            Laddar <HighlightText>träff</HighlightText>...
                        </h1>
                        <div className="flex">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full absolute
                            border-8 border-solid border-gray-200"></div>
                                <div className="w-12 h-12 rounded-full animate-spin absolute
                            border-8 border-solid border-[hsl(280,100%,70%)] border-t-transparent shadow-md"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </Layout>
        )
    }

    if (!event.data) {
        return <p>hittar ingen träff...</p>
    }

    const e = event.data


    return (
        <Layout>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center">
                        Vilka kommer på  <HighlightText>{e.title}</HighlightText>?
                    </h1>

                    <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                        <div className="col-span-2">
                            <div
                                className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                            >
                                <h3 className="text-2xl font-bold"><HighlightText>{e.title}</HighlightText></h3>
                                <div className="text-lg whitespace-pre-wrap">
                                    {e.when}
                                </div>
                                <div className="text-lg whitespace-pre-wrap">
                                    <EventAttendes eventid={eventid} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <EventMessages eventid={eventid}></EventMessages>

                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex flex-wrap justify-center justify-self-center">
                            <div className="p-2" >
                                <Link href={router.asPath + "/.."}>
                                    <button
                                        className="rounded-full bg-white/10 bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[hsl(280,100%,70%)]">
                                        Tillbaka
                                    </button>
                                </Link>
                            </div>

                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Footer />
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default Home;

