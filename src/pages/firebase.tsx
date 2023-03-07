import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import useFirebaseAuth from "../lib/firebase/useFirebaseAuth";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Firebase Auth</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Firebase <span className="text-[hsl(280,100%,70%)]">Auth</span>
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">

            <FirebaseAuthDemo />


          </div>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const FirebaseAuthDemo: React.FC = () => {

  const { authUser, loading, signIn, signOut } = useFirebaseAuth()
  return (
    <div>
      <h3 className="text-2xl font-bold">FirebaseAuthDemo →</h3>
      <div className="text-lg">UID: <span className="text-">{authUser && authUser.uid || "-"}</span></div>
      <div className="text-lg">Email: <span className="text-">{authUser && authUser.email || "-"}</span></div>
      <div className="text-lg">
        Just the basics - Everything you need to know to set up your
        database and authentication.
      </div>
    </div>)
}

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