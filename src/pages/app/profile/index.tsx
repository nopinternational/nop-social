/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import HighlightText from "~/components/HighlightText";

import { api } from "~/utils/api";
import { type Profile } from "~/module/profile/profileRouter";
import Link from "next/link";
import Layout from "~/components/Layout";
import { Spinner } from "~/components/Spinner";
import { ProfileHeader } from "~/module/profile/components/ProfileHeader";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const { data: sessionData } = useSession();

  const profiles = api.profile.getAllProfiles.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const renderProfile = (profile: Profile) => {

    const profileSlug = `profile/${profile.username}`
    return (
      <Link href={profileSlug} className="col-span-2 md:col-span-1">
        <div key={profile.username} className="flex flex-col gap-4 col-span-2 md:col-span-1 items-center w-full justify-center rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
          <ProfileHeader profileName={profile.username} />
        </div>
      </Link>
    )
  }

  const renderLoading = () => {
    return (
      <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20 col-span-2" >
        <h3 className="text-2xl font-bold"><HighlightText>Laddar...</HighlightText></h3>
        <div className="text-lg">
          <p>Den som väntar på något gott 😘 </p>
        </div>
        <Spinner />
      </div>

    )
  }
  return (
    <Layout headingText={<>Våra <HighlightText>härliga</HighlightText> par</>}>
      <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
        <div className="col-span-2">
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
            <h3 className="text-2xl font-bold">Par, par, par ❤️❤️❤️</h3>
            <div className="text-lg">
              Night of Passion är fullt av trevliga par. Nedan hittar ni några av dom 😘
            </div>
          </div>

        </div >
        {profiles.isLoading ? renderLoading() : null}
        {profiles.data?.map((profile) => renderProfile(profile))}
      </div>
    </Layout>
  )
};

export default Home;

