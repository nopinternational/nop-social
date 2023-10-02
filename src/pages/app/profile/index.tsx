/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import HighlightText from "~/components/HighlightText";

import { api } from "~/utils/api";
import { type Profile } from "~/module/profile/profileRouter";
import Link from "next/link";
import couplePic from "./couple_icon_square.png"
import Image from 'next/image'
import Layout from "~/components/Layout";
import { Spinner } from "~/components/Spinner";
import { type PropsWithChildren, type ReactNode } from "react";

type CardProps = {
  headingText?: string | ReactNode
}

const Card: FC = ({ children, headingText }: PropsWithChildren<CardProps>) => {

  return (
    <>
      {children}
    </>
  )
}


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
      <Card>
        <div key={profile.username} className="flex flex-col gap-4 col-span-2 md:col-span-1 items-center w-full justify-center rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
          <div className="inline h-full">
            <Link href={profileSlug} >
              <div className="">
                <Image
                  className="w-32 h-32 bg-yellow-50 rounded-full shadow  max-w-full align-middle border-4 border-[hsl(280,100%,70%)]"
                  src={couplePic}
                  alt="John Doe" />
              </div>
              <h3 className="text-2xl font-bold text-center"><HighlightText>{profile.username}</HighlightText></h3>
              {/* <div className="p-2">
            <div className="text-lg ">
              <p>{profile.username} är ett par som heter <HighlightText>{profile.person1?.name}</HighlightText> & <HighlightText>{profile.person2.name}</HighlightText>,
                dom är {YEAR - profile.person1?.born} och {YEAR - profile.person2?.born}år.</p>
            </div>
          </div> */}
            </Link>
          </div>
        </div>
      </Card>
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

