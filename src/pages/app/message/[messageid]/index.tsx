import { type NextPage } from "next";
import Link from "next/link";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { TextEditForm, type TextEditFormOptions } from "~/components/TextEditForm";
import SendAMessageForm from "~/module/message/SendAMessage";
import { ProfilePic } from "~/module/profile/components/ProfilePic";


type Message = {
    id: string
    from: string
    message: string
}

const Home: NextPage = () => {

    const MESSAGES: Message[] = [
        {
            id: "jscfdn",
            from: "sthlmpar08",
            message: "Hej på er. Tack för ett ni kom cocktailträffen. Vi tycker det var väldigt kul att få träffa er och lära känna er."
        },
        {
            id: "awergzx",
            from: "Sexy-couple",
            message: "Tack själva! Vilket härligt gäng det var, supertrevligt. Ni är ett par vi kände vi klickade med... "
        },
        {
            id: "lkojmn",
            from: "Sexy-couple",
            message: "Vi ska ha en middags-träff på lördag med ett annat par, vi tror ni skulle gilla dom också. Det vore kul och spännande om ni vill joina oss."
        },
        {
            id: "nccarp",
            from: "sthlmpar08",
            message: "Så roligt att höra. Vi ses gärna på lördag för en middag, kul!"
        },
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

                    <Card header={<>Konversation med <HighlightText>Sexy-couple</HighlightText>:</>}>
                        {MESSAGES.map(message => {
                            return (

                                <ChatMessage key={message.id} message={message} fromMe={message.from === "sthlmpar08"} />
                            )
                        })}
                        <SendAMessageForm profileId="profileId" username="Sexy-couple"></SendAMessageForm>
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



const ChatMessage = ({ message, fromMe }: { message: Message, fromMe: boolean }) => {

    return (
        <>
            {fromMe ?
                <div className="pl-10">

                    <p className="p-2  rounded-xl bg-white/10 whitespace-pre-wrap italic" >{message.message}</p>
                </div> :
                <div className="pr-10">
                    <p><HighlightText>{message.from}</HighlightText> säger:</p>
                    <p className="p-2 rounded-xl bg-white/10 whitespace-pre-wrap italic" >{message.message}</p>
                </div>
            }
            {/* <div className="flex col-span-1 items-center justify-center pt-2">
                <ProfilePic />
            </div>
            <div className="col-span-3">
                <h3 className="text-2xl font-bold"><HighlightText>{convo.username}</HighlightText></h3>
                <p className=" p-2 rounded-xl bg-white/10 whitespace-pre-wrap italic" >{convo.lastMessage}</p>
            </div> */}
        </ >
    )
}