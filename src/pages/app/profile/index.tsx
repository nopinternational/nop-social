/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import HighlightText from "~/components/HighlightText";
import SigninButton from "~/components/SigninButton";
import { api } from "~/utils/api";
import { Profile } from "~/server/api/routers/profileRouter";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const foo = useSession();
  const { data: sessionData } = foo;
  console.log("profilepage: foo=", foo)
  console.log("profilepage: sessionData=", sessionData)

  const message = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const profiles = api.profile.getAllProfiles.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  // console.log("profilepage: message=", message);
  //const message = { data: "hardcoded message on data key" }
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  //const hello = { data: { greeting: "hello-data-key" } }
  //console.log("profilepage: HELLO=", hello);
  console.log("profilepage: profiles.data=", profiles.data);

  // if (profileQuery.isLoading) {
  //   return <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">Loading...</div>
  // }

  // if (!profileQuery.data) {
  //   return <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">Loading...</div>
  // }
  const renderProfile = (profile: Profile) => {

    return (
      <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
        <h3 className="text-2xl font-bold">Här kommer <HighlightText>{profile.username}</HighlightText></h3>
        <div className="text-lg">
          <p>{profile.username} är ett par som heter {profile.name1} & {profile.name2}</p>

        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Night of Passion</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Våra <HighlightText>härliga</HighlightText> par
          </h1>
          <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
            <div className="col-span-2">
              <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                <h3 className="text-2xl font-bold">Par, par, par ❤️❤️❤️</h3>
                <div className="text-lg">
                  Night of Passion är fullt av trevliga par. Njut av dom på våra träffar 😘
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                <h3 className="text-2xl font-bold">Ett hemligt meddelande</h3>
                <div className="text-lg">
                  <p>hello: {hello.data?.greeting}</p>
                  <p>data: {message.data}</p>
                </div>
              </div>
            </div>
            {profiles.data?.map((profile) => renderProfile(profile))}

          </div>
          <div className="flex flex-col items-center gap-2">
            <SigninButton />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

