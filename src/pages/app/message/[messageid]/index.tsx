import { type NextPage } from "next";
import Link from "next/link";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { ChatMessage, type Message, SendChatMessageForm } from "~/components/Message/ChatMessage";

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

    function postMessageHandler(): void {
        alert("tack för att du vill testa att skicka ett meddelande, men det är inget som fungerar ännu 😟");
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

                    <Card header={<>Konversation med <HighlightText>Sexy-couple</HighlightText>:</>}>
                        {MESSAGES.map(message => {
                            return (

                                <ChatMessage key={message.id} message={message} fromMe={message.from === "sthlmpar08"} />
                            )
                        })}

                        <SendChatMessageForm toUsername="Sexy-Couple" postMessageHandler={postMessageHandler}></SendChatMessageForm>
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
