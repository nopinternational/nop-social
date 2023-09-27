/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import HighlightText from "~/components/HighlightText";
import Footer from "~/components/Footer";
import { api } from "~/utils/api";
import { type Profile } from "~/module/profile/profileRouter";
import Link from "next/link";
import { type FC, useState } from "react";
import { type Person } from "~/module/profile/profileRouter";
import { type PartialProfile } from "~/module/profile/firebaseProfiles";
import { TextEditForm, type TextEditFormOptions } from "~/components/TextEditForm";
import Layout from "~/components/Layout";



const Home: NextPage = () => {

  const [editPanel1, setEditPanel1] = useState(false)
  const [editPanel2, setEditPanel2] = useState(false)
  const [editPanel3, setEditPanel3] = useState(false)

  const trpcCtx = api.useContext()

  const { data: sessionData } = useSession();

  const profile = api.profile.getMyProfile.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  const { mutate: mergeProfile } = api.profile.mergeProfile.useMutation()

  const pid = profile.data?.username || '';

  const YEAR = new Date().getFullYear()

  const closePanel1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setEditPanel1(false)
  }
  const closePanel2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setEditPanel2(false)
  }
  const closePanel3 = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setEditPanel3(false)
  }

  const renderLoading = (profileid: string) => {
    return (
      <Layout>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center" >
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
      </Layout>
    )
  }


  if (profile.isLoading || false) {
    return renderLoading(pid)
  }


  const persistPerson = (profile: PartialProfile) => {
    //console.log("Edit.persistPerson", profile)

    mergeProfile(profile)
  }
  const persistPerson_p1 = (person: Person) => persistPerson({ "person1": person })
  const persistPerson_p2 = (person: Person) => persistPerson({ "person2": person })

  const persistDescription = (description: PartialProfile) => {
    //console.log("Edit.persistDescription", description)

    mergeProfile(description)
  }
  const default_user: Profile = {
    username: "",
    person1: {
      name: "",
      born: YEAR
    },
    person2: {
      name: "",
      born: YEAR
    },
    description: ""
  }

  const p = profile.data as Profile || default_user
  //console.log("profile.edit.p", p)
  const p1 = p.person1
  const p2 = p.person2

  const textEditFormOptions: TextEditFormOptions = {
    buttontext: "Ändra",
    headingText: "Beskrivning"
  }

  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center">
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
                <h3 className="text-2xl font-bold" >Ändra <HighlightText>{p1.name}</HighlightText> <button onClick={(event) => closePanel1(event)} >→</button></h3>
                <div className="text-lg">
                  {editPanel1 ? <PersonEditForm person={p1} onsubmitHandler={persistPerson_p1} /> : <p>Klicka för att ändra person</p>}
                </div>
              </div>
            </div >
            <div className="col-span-2" onClick={() => setEditPanel2(true)} >
              < div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                <h3 className="text-2xl font-bold" >Ändra <HighlightText>{p2.name}</HighlightText> <button onClick={(event) => closePanel2(event)} >→</button></h3>
                <div className="text-lg">
                  {editPanel2 ? <PersonEditForm person={p2} onsubmitHandler={persistPerson_p2} /> : <p>Klicka för att ändra person</p>}
                </div>
              </div>
            </div >

            <div className="col-span-2" onClick={() => setEditPanel3(true)} >
              < div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                <h3 className="text-2xl font-bold" >Ändra <HighlightText>beskrivning</HighlightText> <button onClick={(event) => closePanel3(event)} >→</button></h3>
                <div className="text-lg">
                  {editPanel3 ? <TextEditForm options={textEditFormOptions} value={p.description} onsubmitHandler={persistDescription} /> : <p>Klicka för att ändra er beskrivning</p>}
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
            <Footer />
          </div>
        </div>
      </main>
    </Layout>
  )
};

export default Home;




const PersonEditForm: FC<{ person: Person, onsubmitHandler: (person: Person) => void }> = ({ person, onsubmitHandler }) => {

  const [name, setName] = useState(person.name);
  const [born, setBorn] = useState(person.born);


  const onChange = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    const newP = { name, born }

    onsubmitHandler(newP)
    //this.setState({ text: e.currentTarget.value });
  };
  return (
    <form className="p-2" >
      <div className="m-2">Namn</div>
      <input
        className="w-full px-3 py-3 rounded-lg text-black text-center"
        name="name" value={name} onChange={event => setName(event.target.value)} /><br />
      <div className="m-2">Födelseår</div>
      <input className="w-full px-3 py-3 rounded-lg text-black text-center"
        name="born" value={born} onChange={event => setBorn(parseInt(event.target.value))} /><br />
      <button
        className="mt-4 mb-3 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => onChange(event)}>Ändra</button>
    </form>
  )
}



