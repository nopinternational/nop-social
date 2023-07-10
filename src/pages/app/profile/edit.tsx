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
import { type FC, useRef, useState } from "react";

import { type Person } from "~/server/api/routers/profileRouter";


const Home: NextPage = () => {

  const [editPanel1, setEditPanel1] = useState(false)

  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const { data: sessionData } = useSession();
  // const sess = useSession();
  // console.log("profile.edit.session", sess)
  // console.log("profile.edit.session.data", sessionData)


  const profile = api.profile.getMyProfile.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  const pid = profile.data?.username || '';


  const YEAR = new Date().getFullYear()

  // if (profileQuery.isLoading) {
  //   return <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">Loading...</div>
  // }

  // if (!profileQuery.data) {
  //   return <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">Loading...</div>
  // }

  const toggleEditpanel = () => {
    console.log("toggleEditpanel, current: ", editPanel1)
    setEditPanel1(!editPanel1)
    return true
  }

  const closePanel = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("closePanel")
    event.stopPropagation()
    setEditPanel1(false)
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


  if (profile.isLoading || false) {
    return renderLoading(pid)
  }



  const p = profile.data as Profile
  const p1 = p.person1
  const p2 = p.person2
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
            Ändra er profil <HighlightText>{pid}</HighlightText>
          </h1>
          <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
            <div className="col-span-2">
              < div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                <h3 className="text-2xl font-bold"><HighlightText>{p.username}</HighlightText></h3>
                <div className="text-lg">
                  <p>{p.username} är ett par som heter <HighlightText>{p1?.name}</HighlightText> & <HighlightText>{p2.name}</HighlightText>,
                    dom är {YEAR - p1?.born} och {YEAR - p2?.born}år.</p>
                </div>
              </div>
            </div >
            <div className="col-span-2" onClick={() => setEditPanel1(true)} >
              < div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                <h3 className="text-2xl font-bold" >Ändra <HighlightText>{p1.name}</HighlightText> <button onClick={(event) => closePanel(event)} >→</button></h3>
                <div className="text-lg">
                  {editPanel1 || true ? <PersonEditForm person={p1} ></PersonEditForm> : <p>Klicka för att ändra profil</p>}
                </div>
              </div>
            </div >

            <div className="col-span-2">
              < div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                <h3 className="text-2xl font-bold">Ändra <HighlightText>{p2.name}</HighlightText> →</h3>
                <div className="text-lg">

                </div>
              </div>
            </div >


          </div>
          <Link href="/app/profile">
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

const PersonEditForm: FC<{ person: Person }> = ({ person }) => {
  const [foo, bar] = useState()
  const [name, setName] = useState(person.name);
  const [born, setBorn] = useState(person.born);

  console.log("PersonEditForm.person: ", person)

  const persistData = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    console.log("PersonEditForm.persistData.event.target.value", event.currentTarget.value);
  }
  const onChange = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    console.log("PersonEditForm.onChange.event.target.value", e.currentTarget);
    const newP = { name, born }
    console.log("PersonEditForm.onChange.newP", newP)
    //this.setState({ text: e.currentTarget.value });
  };
  return (
    <>

      <form className="p-2" >
        <div className="m-2">Namn</div>
        <input
          className="w-full px-3 py-3 rounded-full text-black text-center"
          name="p1name" value={name} onChange={event => setName(event.target.value)} /><br />
        <div className="m-2">Födelseår</div>
        <input className="w-full px-3 py-3 rounded-full text-black text-center"
          name="p1born" value={born} onChange={event => setBorn(parseInt(event.target.value))} /><br />
        <button
          className="m-2 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={(event) => onChange(event)}>Ändra</button>
      </form>
    </>
  )
}

