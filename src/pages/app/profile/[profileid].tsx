/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import { useRouter } from 'next/router';
import Link from "next/link";
import Image from 'next/image'
import { useSession } from "next-auth/react";
import HighlightText from "~/components/HighlightText";

import { api } from "~/utils/api";
import { type Profile } from "~/module/profile/profileRouter";
import couplePic from "./couple_icon_square.png"
import Layout from "~/components/Layout";
import { Spinner } from "~/components/Spinner";

const Home: NextPage = () => {
  const router = useRouter();

  const { profileid } = router.query;
  const pid = profileid as string

  // console.log("profileid", pid)
  // console.log("useParams()", useParams())
  const { data: sessionData } = useSession();

  const profile = api.profile.getProfile.useQuery(
    { profileid: pid },
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
    // console.log("renderProfileOverview", profile);
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
      <Layout headingText={<>Laddar <HighlightText>{profileid}</HighlightText></>}>
        <Spinner />
      </Layout>
    )
  }
  const renderNoProfileFound = (profileid: string) => {
    return (
      <Layout headingText={<>Vi hittar inte <HighlightText>{profileid}</HighlightText></>}>
      </Layout>
    )
  }

  if (profile.isLoading || false) {
    return renderLoading(pid)
  }
  // console.log("before return", profile.data)
  if (!profile.data) {
    return renderNoProfileFound(pid)
  }

  const p = profile.data

  return (
    <Layout headingText={<>Här är <HighlightText>{pid}</HighlightText></>}>
      <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">

        <div className="col-span-2">
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/10 items-center">
            <Image
              className="w-32 h-32 bg-yellow-50 rounded-full shadow max-w-full align-middle border-4 border-[hsl(280,100%,70%)]"
              src={couplePic}
              alt="John Doe" />
            <h3 className="text-2xl font-bold text-center"><HighlightText>{p.username}</HighlightText></h3>
            <div className="text-lg">
              <p>{p.username} är ett par som heter <HighlightText>{p.person1?.name}</HighlightText> & <HighlightText>{p.person2.name}</HighlightText>,
                dom är {YEAR - p.person1?.born} och {YEAR - p.person2?.born}år.</p>

            </div>
          </div>
        </div>

        {/* <div className="col-span-2">
              {renderProfileOverview(p)}
            </div > */}

        <div className="col-span-2">
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/10">
            <h3 className="text-2xl font-bold">Så här <HighlightText>beskriver</HighlightText> dom sig</h3>
            <div className="text-lg">
              {p.description ?
                <p className="p-2 rounded-xl bg-white/10 whitespace-pre-wrap italic" >{p.description}</p> :
                <p className="p-2 rounded-xl bg-white/10 whitespace-pre-wrap text-center" ><span className="italic">Här var det tomt</span> 🙁</p>
              }
            </div>
          </div>
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

    </Layout>
  )
};

export default Home;

