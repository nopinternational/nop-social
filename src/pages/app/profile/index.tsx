/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import HighlightText from "~/components/HighlightText";
import SigninButton from "~/components/SigninButton";
import { api } from "~/utils/api";
import { type Profile } from "~/module/profile/profileRouter";
import Link from "next/link";

const Home: NextPage = () => {
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
                  Night of Passion är fullt av trevliga par. Här kommer ni kunna se er själva och alla andra par som är medlemmar i Night of Passion. Vi kommer att släppa denna sida efter vår cocktailträff 9/9.
                </div>
                <div className="text-lg">
                  Vi ses då 😀
                </div>
              </div>
            </div >
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

