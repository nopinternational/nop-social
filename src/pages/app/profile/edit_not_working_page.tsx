/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import HighlightText from "~/components/HighlightText";
import Footer from "~/components/Footer";
import Layout from "~/components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Ändra <HighlightText>er</HighlightText> profil
          </h1>
          <div className="grid grid-cols-2  sm:grid-cols-2   gap-4 md:gap-8">
            <div className="col-span-2">
              <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                <h3 className="text-2xl font-bold">Problem 👷👷‍♀️</h3>
                <div className="text-lg">
                  Just nu har vi problem med att ändra er profil. Vi jobbar på det och återkommer!
                </div>

              </div>
            </div >
          </div>
          <div className="flex flex-col items-center gap-2">
            <Footer />
          </div>
        </div>
      </main>
    </Layout>
  )
};

export default Home;

