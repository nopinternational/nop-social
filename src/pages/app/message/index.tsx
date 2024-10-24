import { type NextPage } from "next";
import Link from "next/link";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import {
  type ChatMember,
  type ConversationGroup,
} from "~/components/Message/ChatMessage";
import { Spinner } from "~/components/Spinner";
import { MessageHeaderCard } from "~/module/message/components/MessageHeaderCard";
import { ProfilePic } from "~/module/profile/components/ProfilePic";
import { api } from "~/utils/api";

const CONVERSATION_GROUP_EMPTY: ConversationGroup[] = [];
/* const CONVERSATION_GROUP_DUMMY: ConversationGroup[] = [
  {
    conversationId: "test-e36db886ceadadf6e26678b57222a6d0",
    username: "sthlmpar08",
    lastMessage: "Så roligt att höra! Vi ses på lördag för en middag",
    members: ["123", "456"],
    when: "2024-03-01T10:40:28.706Z",
    chatMembers: [{ profileid: "sthlmpar08", profilename: "sthlmpar08" }],
    conversationGroupName: "sthlmpar08",
  },
  {
    conversationId: "test-6f0216ac2fa4cee37679b55795f5517d",
    username: "Sexy-couple",
    lastMessage:
      "Det var många härliga par på förra träffen och ni är ett par som vi särskilt gillar 😉",
    members: ["123", "456"],
    when: "2024-03-01T10:41:28.706Z",
    chatMembers: [{ profileid: "Sexy-couple", profilename: "Sexy-couple" }],
    conversationGroupName: "Sexy-couple",
  },
  {
    conversationId: "test-7061c9f8e194f2076a40e0b988a00859",
    username: "Latin-Language-Lovers",
    lastMessage:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    members: ["123", "456"],
    when: "2024-03-01T10:42:28.706Z",
    chatMembers: [
      {
        profileid: "Latin-Language-Lovers",
        profilename: "Latin-Language-Lovers",
      },
    ],
    conversationGroupName: "Latin-Language-Lovers",
  },
  {
    conversationId: "test-TliD2abuGuAbNELbtDXf",
    username: "happy couple",
    lastMessage: "Tjoho på er!",
    members: ["123", "456"],
    when: "2024-03-01T10:43:28.706Z",
    chatMembers: [{ profileid: "happy couple", profilename: "happy couple" }],
    conversationGroupName: "happy couple",
  },
];*/
const CONVERSATION_GROUP = CONVERSATION_GROUP_EMPTY;

const Home: NextPage = () => {
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
          <MessageHeaderCard />
          <ConnectedConversationsCard></ConnectedConversationsCard>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

const NoMessagesCard = () => {
  return (
    <Card
      header={
        <>
          Inga pågående <HighlightText>konversationer</HighlightText>
        </>
      }
    >
      <p>Här var det tomt 😏</p>
    </Card>
  );
};
const LoadingMessagesCard = () => {
  return (
    <Card
      header={
        <>
          Laddar <HighlightText>konversationer</HighlightText>...
        </>
      }
    >
      <Spinner />
    </Card>
  );
};

const ConnectedConversationsCard = () => {
  const myConvoGroups = api.chat.getMyConvoGroups.useQuery();
  const myConversations = myConvoGroups.data || [];
  //const myConversations: ConversationGroup[] = [];

  if (!myConvoGroups.data) {
    // console.log("myConvoGroups.data", myConvoGroups.data);
    return <LoadingMessagesCard />;
  }
  if (myConversations && myConversations.length == 0) {
    return <NoMessagesCard />;
  }
  return (
    <Card
      header={
        <>
          Pågående <HighlightText>konversationer</HighlightText>
        </>
      }
    >
      {myConversations.map((convo) => (
        <Link
          key={convo.conversationId}
          className="grid grid-cols-4 hover:bg-white/20"
          href={`/app/message/${convo.conversationId}`}
        >
          <Conversation convo={convo} />
        </Link>
      ))}
    </Card>
  );
};

/*
const DummyConversationsCard = () => {
  return (
    <Card
      header={
        <>
          Pågående <HighlightText>konversationer</HighlightText>
        </>
      }
    >
      {CONVERSATION_GROUP.map((convo) => (
        <Link
          key={convo.conversationId}
          className="grid grid-cols-4 hover:bg-white/20"
          href={`/app/message/${convo.conversationId}`}
        >
          <Conversation convo={convo} />
        </Link>
      ))}
    </Card>
  );
};*/

const Conversation = ({ convo }: { convo: ConversationGroup }) => {
  const featureIsRead = false;
  // : string | null
  function getFirstChatmember(chatmembers: ChatMember[]): string | null {
    // (convo.chatMembers && convo.chatMembers.length > 0) ||
    // convo.chatMembers[0]?.profileName ||
    if (chatmembers.length >= 0) {
      const chtmember = chatmembers[0] as ChatMember;
      return chtmember.profilename;
    }
    return null;
  }
  const chatMemberProfileName: string =
    getFirstChatmember(convo.chatMembers || []) || "unknown";

  const whenDate = new Date(convo.when);
  const whenFormatted =
    whenDate.toLocaleDateString() + " - " + whenDate.toLocaleTimeString();

  const convoLastread = convo.lastread;

  const when = new Date(convo.when);
  const isRead = convoLastread === null ? true : convoLastread < when;
  const css = isRead && featureIsRead ? "bg-lime-500" : "";

  console.log("-----------------------");
  console.log("when", when);
  console.log("last read", convoLastread);
  console.log("isRead", isRead);
  console.log("-----------------------");
  const dateReadString = convoLastread
    ? convoLastread.toLocaleDateString() +
      " - " +
      convoLastread.toLocaleDateString()
    : "aldrig 😢";
  return (
    <>
      <div className="col-span-1 flex items-center justify-center pt-2">
        <ProfilePic variant="small" />
      </div>
      <div className={"col-span-3 " + css}>
        <h3 className="text-2xl font-bold">
          <HighlightText>{chatMemberProfileName}</HighlightText>
        </h3>
        <p className="line-clamp-3 truncate  whitespace-pre-wrap rounded-xl bg-white/10 p-2 pb-1 italic">
          {convo.lastMessage || "inget har sagts ännu"}
        </p>
        <div className="relative">
          <p className="left-0 text-xs">när: {whenFormatted}</p>
        </div>
        {featureIsRead ? (
          <div>
            <p className="left-0 text-xs">convoread? {dateReadString}</p>
          </div>
        ) : null}
      </div>
    </>
  );
};
