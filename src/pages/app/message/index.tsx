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

    if (!myConvoGroups.data) {
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
