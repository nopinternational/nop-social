import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import SigninButton from "~/components/SigninButton";
import { EVENTS, type Event } from "~/lib/event/events";



const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });


  const eventRender = (event: Event) => {
    return (
      <div className="col-span-2">
        <Link
          className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
          href={"event/" + event.id}
        >

          <h3 className="text-2xl font-bold">{event.title}</h3>
          <div className="text-lg">
            {event.description}
          </div>

        </Link>
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
            Event med <span className="text-[hsl(280,100%,70%)]">Night of Passion</span>
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
            {EVENTS.map(event => { return eventRender(event) })}

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

