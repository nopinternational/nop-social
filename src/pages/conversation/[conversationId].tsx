import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";
import { Message } from "@prisma/client";
import { UserList } from "~/components/UserList";

function Conversation({ conversationId }: { conversationId: string }) {
  const conversation = api.conversation.getConversation.useQuery({ conversationId });
  const utils = api.useContext();
  const joinMutation = api.conversation.joinConversation.useMutation({
    onSuccess() {
      void utils.conversation.getConversation.invalidate({ conversationId });
      void utils.conversation.getAllConversations.invalidate();
    }
  });

  if (conversation.isLoading) return (<div>loading...</div>);


  return (
    <>
      <Head>
        <title>NoP Chat</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-3xl font-bold tracking-tight text-white ">
            Welcome to room {conversation.data?.id}
          </h1>

          <div className="flex-1 gap-4 md:gap-8">
            <UserList usernames={conversation.data?.participants.map(p => p.userId) || []} />

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <button type="submit" onClick={() => joinMutation.mutate({ conversationId })} className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              Join conversation
            </button>
          </div>
          <div className=" gap-4 md:gap-8">
            <Chat conversationId={conversationId} />
          </div>

          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}


const ConversationView: NextPage = () => {
  const router = useRouter()

  const { conversationId } = router.query;
  if (!conversationId) return (<div>loading...</div>);


  return (
    <Conversation conversationId={conversationId as string} />
  );
};

export default ConversationView;

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


function Chat({ conversationId }: { conversationId: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: sessionData } = useSession();

  const { mutate: sendMessage } = api.conversation.sendMessage.useMutation();
  api.conversation.onSendMessage.useSubscription({ conversationId }, {
    onData(msgData) {
      setMessages((m) => {
        return [...m, msgData];
      });
    },
  });



  return <div className="flex-1">

    <h1 className="text-xl font-extrabold tracking-tight text-white">CHAT:</h1>
    <div id="messages" className="m-1 text-m bg-white h-96  flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {messages.map((message) => {

        if (message.userId === sessionData?.user?.name) {
          return (<div key={message.id} className="chat-message">
            <div className="flex items-end">
              <div className="flex flex-col space-y-2  mx-2 order-2 items-start">
                <div><span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{message.content} - {message.userId}</span></div>
              </div>
              <img src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="My profile" className="w-6 h-6 rounded-full order-1" />
            </div>
          </div>)
        }

        return <div key={message.id} className="chat-message">
          <div className="flex items-end justify-end">
            <div className="flex flex-col space-y-2  max-w-xs mx-2 order-1 items-end">
              <div><span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{message.content} - {message.userId}</span></div>
            </div>
            <img src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="My profile" className="w-6 h-6 rounded-full order-2" />
          </div>
        </div>
      }



      )}



    </div>
    <form className="flex " onSubmit={(e) => {
      e.preventDefault();
      sendMessage({ conversationId, content: message });
    }}>
      <textarea className=" " onChange={(e) => setMessage(e.target.value)}></textarea>
      <div><button type="submit" className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Send</button></div>
    </form>

  </div>

}
