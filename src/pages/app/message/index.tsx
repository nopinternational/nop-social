import { type NextPage } from "next";
import Link from "next/link";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { ProfilePic } from "~/module/profile/components/ProfilePic";


type Conversation = {
    conversationId: string
    username: string
    lastMessage: string
}

const Home: NextPage = () => {

    const CONVERSATION: Conversation[] = [
        {
            conversationId: "e36db886ceadadf6e26678b57222a6d0",
            username: "sthlmpar08",
            lastMessage: "Så roligt att höra! Vi ses på lördag för en middag"

        },
        {
            conversationId: "6f0216ac2fa4cee37679b55795f5517d",
            username: "Sexy-couple",
            lastMessage: "Det var många härliga par på förra träffen och ni är ett par som vi särskilt gillar 😉"
        },
        {
            conversationId: "7061c9f8e194f2076a40e0b988a00859",
            username: "Latin-Language-Lovers",
            lastMessage: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        }
    ]

    function postMessageHandler(description: { description: string; }): void {
        throw new Error("Function not implemented.");
    }

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

                        {CONVERSATION.map(convo => (
                            <Link
                                key={convo.conversationId}
                                className="grid grid-cols-4 "
                                href={`/app/message/${convo.conversationId}`}>
                                <Conversation convo={convo} />
                            </Link >
                        ))}

                    </Card>

                </div >
            </div >
        </Layout >
    )
};

export default Home;

const Conversation = ({ convo }: { convo: Conversation }) => {
    return (
        <>
            <div className="flex col-span-1 items-center justify-center pt-2">
                <ProfilePic variant="small" />
            </div>
            <div className="col-span-3">
                <h3 className="text-2xl font-bold"><HighlightText>{convo.username}</HighlightText></h3>
                <p className="pb-1 p-2  rounded-xl bg-white/10 whitespace-pre-wrap italic line-clamp-3 truncate" >{convo.lastMessage}</p>
            </div>
        </ >
    )
}