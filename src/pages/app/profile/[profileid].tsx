/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import Head from "next/head";
import { useSession } from "next-auth/react";
import HighlightText from "~/components/HighlightText";
import SigninButton from "~/components/SigninButton";
import { api } from "~/utils/api";
import { type Profile } from "~/server/api/routers/profileRouter";
import Link from "next/link";

const Home: NextPage = () => {
  const router = useRouter();

  const { profileid } = router.query;
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const { data: sessionData } = useSession();

  const profile = api.profile.getProfile.useQuery(
    { profileid },
    { enabled: sessionData?.user !== undefined }
  );


  const YEAR = new Date().getFullYear()

  // if (profileQuery.isLoading) {
  //   return <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">Loading...</div>
  // }

  // if (!profileQuery.data) {
  //   return <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">Loading...</div>
  // }



  const renderProfileOverview = (profile: Profile) => {
    console.log("renderProfileOverview", profile);
    return (
      <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
        <h3 className="text-2xl font-bold"><HighlightText>{profile.username}</HighlightText></h3>
        <div className="text-lg">
          <p>{profile.username} är ett par som heter <HighlightText>{profile.person1?.name}</HighlightText> & <HighlightText>{profile.person2.name}</HighlightText>,
            dom är {YEAR - profile.person1?.born} och {YEAR - profile.person2?.born}år.</p>

        </div>
      </div>
    )
  }
  const renderLoading = (profileid: string) => {
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
              Laddar <HighlightText>{profileid}</HighlightText>
            </h1>
            <div className="flex">
              <div className="relative">
                <div className="w-12 h-12 rounded-full absolute
                            border-8 border-solid border-gray-200"></div>
                <div className="w-12 h-12 rounded-full animate-spin absolute
                            border-8 border-solid border-[hsl(280,100%,70%)] border-t-transparent shadow-md"></div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }
  const renderNoProfileFound = (profileid: string) => {
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
              Vi hittar inte <HighlightText>{profileid}</HighlightText>
            </h1>

          </div>
        </main>
      </>
    )
  }

  if (profile.isLoading || false) {
    return renderLoading(profileid)
  }
  console.log("before return", profile.data)
  if (!profile.data) {
    return renderNoProfileFound(profileid)
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
            Här är <HighlightText>{profileid}</HighlightText>
          </h1>
          <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
            <div className="col-span-2">
              {profile.data ? renderProfileOverview(profile.data) : null}

            </div >

          </div>
          <Link
            href="/app/profile"
          >
            <button
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
              Tillbaka till profiler
            </button>
          </Link>
          <div className="flex flex-col items-center gap-2">
            <SigninButton />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

