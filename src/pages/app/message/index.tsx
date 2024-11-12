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
import { ProfileLink } from "~/module/profile/components/ProfileLink";


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
                    className=" hover:bg-white/20"
                    href={`/app/message/${convo.conversationId}`}
                >
                    <Conversation convo={convo} />
                </Link>
            ))}
        </Card>
    );
};

const Conversation = ({ convo }: { convo: ConversationGroup }) => {
    function getFirstChatmember(chatmembers: ChatMember[]): string | null {
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
    const css = isRead ? "bg-[hsl(280,100%,70%)]/20 border-2 border-solid border-[hsl(280,100%,70%)] rounded-xl p-2" : "";

    const dateReadString = convoLastread
        ? convoLastread.toLocaleDateString() +
      " - " +
      convoLastread.toLocaleDateString()
        : "aldrig 😢";
    return (
        
        <div className={"flex " + css}>
            <div className="min-w-max">
                <ProfilePic variant="small" />
            </div>
            <div className="ml-3">
                <h3 className="text-2xl font-bold">
                    <HighlightText>
                        <ProfileLink username={chatMemberProfileName}></ProfileLink>
                    </HighlightText>
                </h3>
                <p className="line-clamp-3 truncate  whitespace-pre-wrap rounded-xl bg-white/10 p-2 pb-1 italic">
                    {convo.lastMessage || "inget har sagts ännu"}
                </p>
                <div className="relative">
                    <p className="left-0 text-xs">när: {whenFormatted}</p>
                </div>
                {false ? (
                    <div>
                        <p className="left-0 text-xs">convoread? {dateReadString}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
