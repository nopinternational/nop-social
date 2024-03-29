import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import { Card } from "~/components/Card";
import { useFeature } from "~/components/FeatureFlag";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import {
  SendChatMessageForm,
  ChatMessage,
  type ChatMember,
  type ConversationGroup,
  type ConvoWithMessages,
  type Message,
} from "~/components/Message/ChatMessage";
import { api } from "~/utils/api";

const MESSAGES_EMPTY: Message[] = [];

const MESSAGES_DUMMY: Message[] = [
  {
    id: "jscfdn",
    from: "sthlmpar08",
    fromId: "sthlmpar08",
    message:
      "Hej på er. Tack för ett ni kom cocktailträffen. Vi tycker det var väldigt kul att få träffa er och lära känna er.",
    when: "2024-02-29T11:04:37.083Z",
  },
  {
    id: "awergzx",
    from: "Sexy-couple",
    fromId: "Sexy-couple",
    message:
      "Tack själva! Vilket härligt gäng det var, supertrevligt. Ni är ett par vi kände vi klickade med... ",
    when: "2024-02-29T11:04:37.083Z",
  },
  {
    id: "lkojmn",
    from: "Sexy-couple",
    fromId: "Sexy-couple",
    message:
      "Vi ska ha en middags-träff på lördag med ett annat par, vi tror ni skulle gilla dom också. Det vore kul och spännande om ni vill joina oss.",
    when: "2024-02-29T11:04:37.083Z",
  },
  {
    id: "nccarp",
    from: "sthlmpar08",
    fromId: "sthlmpar08",
    message: "Så roligt att höra. Vi ses gärna på lördag för en middag, kul!",
    when: "2024-02-29T11:04:37.083Z",
  },
];

const MESSAGES = MESSAGES_DUMMY;
const CONVERSTAION_GROUP_DUMMY: ConversationGroup = {
  conversationId: "convoid",
  lastMessage: "lastmessage",
  username: "username",
  when: "2024-03-03T11:43:06.626Z",
  members: ["123", "456"],
  chatMembers: [{ profileid: "222", profilename: "Sexy-couple" }],
  conversationGroupName: "Sexy-couple",
};
const CONVERSTAION_GROUP_EMPTY: ConversationGroup = {
  conversationId: "",
  lastMessage: "",
  username: "",
  when: "",
  members: [],
  chatMembers: [],
  conversationGroupName: "",
};

const CONVO_WITH_MESSAGES: ConvoWithMessages = {
  messages: MESSAGES,
  conversation: CONVERSTAION_GROUP_DUMMY,
};

const Home: NextPage = () => {
  const messageIsEnabled = useFeature("message");
  const session = useSession();

  const router = useRouter();
  const { messageid } = router.query;

  const convoId = messageid as string;
  console.log("message/", messageid, convoId);
  const isTestConversation = convoId ? convoId.startsWith("test-") : true;

  // const messageApi = api.chat.getChatMessage.useQuery({
  //   chatConvoId: convoId,
  // });

  const messageApiConvoAndMessages = api.chat.getConvoAndChatMessages.useQuery({
    chatConvoId: convoId,
  });

  const { mutate: postChatMessage } = api.chat.postChatMessage.useMutation();

  function renderMessage(message: Message) {
    const myUserId = isTestConversation ? "sthlmpar08" : session.data?.user.id;
    return (
      <ChatMessage
        key={message.id}
        message={message}
        fromMe={message.fromId === myUserId}
      />
    );
  }

  function postMessageHandler({ text }: { text: string }): void {
    console.log("postMessageHandler ", text);
    if (messageIsEnabled) {
      // alert("Nu skickar vi iväg meddelandet");
      const message: Message = {
        from: "from", // will be set on server
        fromId: "from", // will be set on server
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

  function getDummyConvoWithMessages(): ConvoWithMessages {
    return CONVO_WITH_MESSAGES;
  }

  const data: ConvoWithMessages = isTestConversation
    ? getDummyConvoWithMessages()
    : messageApiConvoAndMessages.data || {
        messages: [],
        conversation: CONVERSTAION_GROUP_EMPTY,
      };

  function getGroupNameFromChatMembers(
    chatMembers: ChatMember[] | undefined
  ): string {
    if (chatMembers && chatMembers.length > 0) {
      return chatMembers.map((chatMember) => chatMember.profilename).join(", ");
    } else return "--unknown--";
  }

  data.conversation.conversationGroupName = getGroupNameFromChatMembers(
    data.conversation.chatMembers
  );

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
                Konversation med{" "}
                <HighlightText>
                  {data.conversation.conversationGroupName}
                </HighlightText>
                :
              </>
            }
          >
            {data.messages.map((message) => {
              return renderMessage(message);

              //   return renderMessage({
              //     id: "123",
              //     message: message.chatMessage as string,
              //     from: message.fromUserId as string,
              //   });
            })}

            <SendChatMessageForm
              toUsername={data.conversation.conversationGroupName}
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
