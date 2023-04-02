import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";


const Chat: NextPage = () => {
  const conversations = api.conversation.getAllConversations.useQuery();
  const utils = api.useContext();
  const mutation = api.conversation.createConversation.useMutation(
    {
      onSuccess(data) {
        void utils.conversation.getAllConversations.invalidate();
        //void router.push(`/app/space/${space.id}/content/${data.id}`);
      },
    }
  );

  const conversationsList = conversations.data?.map((conversation) => {
    const spans = conversation.participants.map((participant) => participant.userId)
    console.log("spans:", spans)
    const userlist = spans.join(", ")
    console.log("userlist:", userlist)
    return (<div key={conversation.id} >
      <div className="grid grid-cols-6 gap-4 sm:grid-cols-6 md:gap-8">
        <div className="col-start-2 col-span-4">

          <Link
            className="flex max-w-xl flex-col  gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href={`/conversation/${conversation.id}`}
          >
            <h3 className="text-2xl font-bold">{conversation.id}→</h3>
            <div className="text-lg">
              Join the conversation with {userlist}
            </div>
            <button
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 truncate"
              onClick={() => null}
            > Join room</button>
          </Link>
        </div>
        {/* <Link href={`/conversation/${conversation.id}`}>
        <span>{conversation.createdAt.toISOString()}</span>
        <span>{conversation.id}</span>
        {conversation.participants.map((participant) => <span key={participant.id}>{participant.userId}</span>)}
      </Link> */}
      </div>
    </div>)
  });

  return (
    <>
      <Head>
        <title>NoP Chat</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <button type="submit" onClick={() => mutation.mutate()} className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Create conversation</button>
          </div>

          {conversationsList}

          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Chat;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
