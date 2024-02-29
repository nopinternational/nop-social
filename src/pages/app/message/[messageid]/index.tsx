import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Card } from "~/components/Card";
import { useFeature } from "~/components/FeatureFlag";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import {
  ChatMessage,
  type Message,
  SendChatMessageForm,
} from "~/components/Message/ChatMessage";
import { api } from "~/utils/api";

const MESSAGES: Message[] = [
  {
    id: "jscfdn",
    from: "sthlmpar08",
    message:
      "Hej på er. Tack för ett ni kom cocktailträffen. Vi tycker det var väldigt kul att få träffa er och lära känna er.",
    when: "2024-02-29T11:04:37.083Z",
  },
  {
    id: "awergzx",
    from: "Sexy-couple",
    message:
      "Tack själva! Vilket härligt gäng det var, supertrevligt. Ni är ett par vi kände vi klickade med... ",
    when: "2024-02-29T11:04:37.083Z",
  },
  {
    id: "lkojmn",
    from: "Sexy-couple",
    message:
      "Vi ska ha en middags-träff på lördag med ett annat par, vi tror ni skulle gilla dom också. Det vore kul och spännande om ni vill joina oss.",
    when: "2024-02-29T11:04:37.083Z",
  },
  {
    id: "nccarp",
    from: "sthlmpar08",
    message: "Så roligt att höra. Vi ses gärna på lördag för en middag, kul!",
    when: "2024-02-29T11:04:37.083Z",
  },
];

const Home: NextPage = () => {
  const messageIsEnabled = useFeature("message");

  const router = useRouter();
  const { messageid } = router.query;
  const convoId = messageid as string;
  console.log("message/", messageid);

  const messageApi = api.chat.getChatMessage.useQuery({
    chatConvoId: convoId,
  });
  const { mutate: postChatMessage } = api.chat.postChatMessage.useMutation();

  function renderMessage(message: Message) {
    console.log("render message for message", message);
    return (
      <ChatMessage
        key={message.message}
        message={message}
        fromMe={message.from === "sthlmpar08"}
      />
    );
  }

  function postMessageHandler({ text }: { text: string }): void {
    console.log("postMessageHandler ", text);
    if (messageIsEnabled) {
      // alert("Nu skickar vi iväg meddelandet");
      const message: Message = {
        from: "from",
        id: messageid as string,
        message: text,
        when: "", // will be set on server
      };
      console.log("postMessageHandler.postChatMessage", message);
      postChatMessage({ chatMessage: message });
    } else {
      alert(
        "tack för att du vill testa att skicka ett meddelande, men det är inget som fungerar ännu 😟"
      );
    }
  }
  const data = messageApi.data || [];

  return (
    <Layout
      headingText={
        <>
          <HighlightText>Meddelanden</HighlightText>
        </>
      }
    >
      <div className="grid grid-cols-2  gap-4   sm:grid-cols-2 md:gap-8">
        <div className="col-span-2">
          <Card
            header={
              <>
                Skicka <HighlightText>meddelande</HighlightText> till andra{" "}
                <HighlightText>profiler</HighlightText>
              </>
            }
          >
            <div className="text-lg">
              Tjoho! Just nu arbetar vi med att göra det möjligt att skicka
              meddelande till varandra. Bra va 😃
            </div>
            <div className="text-lg">
              Som ni märker är vi inte riktigt klara... Men nedan kan ni se hur
              vi tänkt oss.
            </div>
          </Card>

          <Card
            header={
              <>
                Konversation med <HighlightText>Sexy-couple</HighlightText>:
              </>
            }
          >
            {MESSAGES.map((message) => {
              return renderMessage(message);
              //   return (
              //     <ChatMessage
              //       key={message.id}
              //       message={message}
              //       fromMe={message.from === "sthlmpar08"}
              //     />
              //   );
            })}
            {data.map((message) => {
              return renderMessage(message);
              //   return renderMessage({
              //     id: "123",
              //     message: message.chatMessage as string,
              //     from: message.fromUserId as string,
              //   });
            })}

            <SendChatMessageForm
              toUsername="stockholm"
              postMessageHandler={postMessageHandler}
            ></SendChatMessageForm>
          </Card>
        </div>
      </div>
      <Link href="/app/message">
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
          Tillbaka till meddelanden
        </button>
      </Link>
    </Layout>
  );
};

export default Home;
