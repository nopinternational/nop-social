import { type NextPage } from "next";
import Link from "next/link";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { ProfileHeader } from "~/module/profile/components/ProfileHeader";
import { ProfilePic } from "~/module/profile/components/ProfilePic";


type Conversation = {
    username: string
    lastMessage: string
}

const Home: NextPage = () => {

    const CONVERSATION: Conversation[] = [
        {
            username: "sthlmpar08",
            lastMessage: "Så roligt att höra! Vi ses på lördag för en middag"
        },
        {
            username: "Sexy-couple",
            lastMessage: "Det var många härliga par på förra träffen och ni är ett par som vi särskilt gillar 😉"
        },
        {
            username: "Latin-Language-Lovers",
            lastMessage: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        }
    ]

    return (
        <Layout headingText={<><HighlightText>Meddelanden</HighlightText></>}>
            <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
                <div className="col-span-2">

                    <Card header={<>Skicka <HighlightText>meddelande</HighlightText> till andra <HighlightText>profiler</HighlightText></>}>
                        <div className="text-lg">
                            Tjoho! Just nu arbetar vi med att göra det möjligt att skicka meddelande till varandra. Bra va 😃
                        </div>
                        <div className="text-lg">
                            Som ni märker är vi inte riktigt klara... Men nedan kan ni se hur vi tänkt oss.
                        </div >
                    </Card >

                    <Card header="Pågående konversationer">
                        <p className=" p-2 rounded-xl bg-white/10 whitespace-pre-wrap italic" >
                            Så roligt att höra! Vi ses på lördag för en middag
                        </p>
                        {/* <div className="grid grid-cols-4 gap-y-8">
                        </div> */}
                    </Card>

                </div >
            </div >
            <Link href="/app/message">
                <button
                    className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                    Tillbaka till meddelanden
                </button>
            </Link>
        </Layout >
    )
};

export default Home;

const Conversation = ({ convo }: { convo: Conversation }) => {
    return (
        <>
            <div className="flex col-span-1 items-center justify-center pt-2">
                <ProfilePic />
            </div>
            <div className="col-span-3">
                <h3 className="text-2xl font-bold"><HighlightText>{convo.username}</HighlightText></h3>
                <p className=" p-2 rounded-xl bg-white/10 whitespace-pre-wrap italic" >{convo.lastMessage}</p>
            </div>
        </ >
    )
}