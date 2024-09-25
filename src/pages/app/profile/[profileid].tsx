import { type NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
import HighlightText from "~/components/HighlightText";

import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import { Spinner } from "~/components/Spinner";
import { ProfileHeader } from "~/module/profile/components/ProfileHeader";
import { Card } from "~/components/Card";
import {
  type MessageToUser,
  SendChatMessageForm,
} from "~/components/Message/ChatMessage";
import { type ConversationMessage } from "~/components/Message/ChatMessage";

const Home: NextPage = () => {
  const router = useRouter();

  const { profileid } = router.query;
  const pid = profileid as string;

  // console.log("profileid", pid)
  // console.log("useParams()", useParams())
  const { data: sessionData } = useSession();
  //const { mutate: sendChatMessage } = api.chat.sendChatMessage.useMutation();
  const profile = api.profile.getProfileByProfileName.useQuery(
    { profilename: pid },
    { enabled: sessionData?.user !== undefined }
  );
  const { mutate: postChatMessage, mutateAsync: postChatMessageAsync } =
    api.chat.postChatMessageToUser.useMutation();

  const YEAR = new Date().getFullYear();

  const renderLoading = (profileid: string) => {
    return (
      <Layout
        headingText={
          <>
            Laddar <HighlightText>{profileid}</HighlightText>
          </>
        }
      >
        <Spinner />
      </Layout>
    );
  };
  const renderNoProfileFound = (profileid: string) => {
    return (
      <Layout
        headingText={
          <>
            Vi hittar inte <HighlightText>{profileid}</HighlightText>
          </>
        }
      ></Layout>
    );
  };

  if (profile.isLoading || false) {
    return renderLoading(pid);
  }
  // console.log("before return", profile.data)
  if (!profile.data) {
    return renderNoProfileFound(pid);
  }

  function postMessageHandler({ text }: { text: string }): void {
    sendMessageToUser(text);
  }

  const sendMessageToUser = (message: string) => {
    // console.log("sendMessageToUser", message, profile.data?.id);

    const toUserId = profile.data?.id as string;

    const chatMessage: MessageToUser = {
      toProfileId: toUserId,
      message: message,
    };
    // console.log("postMessageHandler.postChatMessage", chatMessage);
    //const postMessageResponse = await  postChatMessage({ chatMessage: chatMessage });
    postChatMessageAsync({ chatMessage: chatMessage })
      .then((storedMessage: ConversationMessage) => {
        // console.log("sendMessageToUser.response", storedMessage);
        void router.push(`/app/message/${storedMessage.conversationId}`);
      })
      .catch((error) => {
        console.error(error);
      });
    // console.log("messagService.sendMessageToUser", result_sendChatMessage);
  };
  const p = profile.data;

  return (
    <Layout
      headingText={
        <>
          Här är <HighlightText>{pid}</HighlightText>
        </>
      }
    >
      <div className="grid grid-cols-2  gap-4   sm:grid-cols-2 md:gap-8">
        <div className="col-span-2">
          <div className="flex flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/10">
            <ProfileHeader
              profileName={p.username}
              avatar={p.avatar}
            ></ProfileHeader>
            <div className="text-lg">
              <p>
                {p.username} är ett par som heter{" "}
                <HighlightText>{p.person1?.name}</HighlightText> &{" "}
                <HighlightText>{p.person2.name}</HighlightText>, dom är{" "}
                {YEAR - p.person1?.born} och {YEAR - p.person2?.born}år.
              </p>
            </div>
          </div>
        </div>

        {/* <div className="col-span-2">
              {renderProfileOverview(p)}
            </div > */}

        <div className="col-span-2">
          {/* <Card header={undefined} >
            <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/10 items-center">
              <ProfileHeader profileName={p.username}></ProfileHeader>
              <div className="text-lg">
                <p>{p.username} är ett par som heter <HighlightText>{p.person1?.name}</HighlightText> & <HighlightText>{p.person2.name}</HighlightText>,
                  dom är {YEAR - p.person1?.born} och {YEAR - p.person2?.born}år.</p>
              </div>
            </div>
          </Card> */}

          <Card
            header={
              <>
                Så här <HighlightText>beskriver</HighlightText> dom sig
              </>
            }
          >
            <div className="text-lg">
              {p.description ? (
                <p className="whitespace-pre-wrap rounded-xl bg-white/10 p-2 italic">
                  {p.description}
                </p>
              ) : (
                <p className="whitespace-pre-wrap rounded-xl bg-white/10 p-2 text-center">
                  <span className="italic">Här var det tomt</span> 🙁
                </p>
              )}
            </div>
          </Card>

          <Card
            header={
              <>
                Skicka ett meddelande till{" "}
                <HighlightText>{p.username}</HighlightText>
              </>
            }
          >
            <SendChatMessageForm
              toUsername={p.username}
              postMessageHandler={postMessageHandler}
              options={{ emptyOnSubmit: false }}
            ></SendChatMessageForm>
          </Card>
        </div>
      </div>
      <Link href="/app/profile">
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
          Tillbaka till profiler
        </button>
      </Link>
    </Layout>
  );
};

export default Home;
