/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useRef } from "react"
import { type NextPage, type GetServerSideProps, GetStaticPropsContext, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from 'next/router';
// import { providers, signIn, getSession, csrfToken } from "next-auth/client/";
import { getProviders, signIn, signOut, getCsrfToken, getSession, useSession } from "next-auth/react"
import authOptions from "./api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import type {
    Provider
} from "next-auth/providers"


type SigninPageProps = {
    providers: Provider[]
}

const Signin = ({ providers }: SigninPageProps) => {
    const router = useRouter();
    const { error } = router.query;

    const inputUsername = useRef<HTMLInputElement>(null);
    const inputPassword = useRef<HTMLInputElement>(null);

    const nopAuthSignIn = (providers: Provider[]) => {
        const nopSigninProvider = Object.values(providers).filter(provider => provider.id == "nop-auth")[0]
        //console.log("nopAuthSignIn.nopSigninProvider: ", nopSigninProvider)


        if (!nopSigninProvider) return <div>no nop</div>

        const signinNopAuth = (event: React.MouseEvent<HTMLButtonElement>): void => {
            console.log("Signin.nopAuthSignIn.signinNopAuth.event", event)
            event.preventDefault()
            const signinreturn = signIn('nop-auth', {
                redirect: true,
                callbackUrl: '/welcome',
                username: inputUsername.current?.value,
                password: inputPassword.current?.value
            })

        }

        return (
            <>
                {error ? <div className="text-[hsl(280,100%,70%)]">Felaktig inloggning, försök igen</div> : null}
                <form className="p-2" >
                    <div className="m-2">email</div>
                    <input
                        className="w-full px-3 py-3 rounded-full text-black text-center"
                        name="username" ref={inputUsername}></input><br />
                    <div className="m-2">lösenord</div>
                    <input className="w-full px-3 py-3 rounded-full text-black text-center"
                        name="password" type="password" ref={inputPassword}></input><br />
                    <button
                        className="m-2 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => signinNopAuth(event)}>Logga in</button>
                </form>
            </>
        )
    }

    return (
        <>
            <Head>
                <title>Night of Passion</title>
                <meta name="description" content="Night of Passion" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        Logga in till <span className="text-[hsl(280,100%,70%)]">Night of Passion</span>
                    </h1>
                    <div className="grid w-full xl:w-1/2 grid-cols-1 sm:grid-cols-1 gap-4 md:gap-8">
                        <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">

                            <h3 className="text-2xl font-bold">Logga in →</h3>
                            <div className="text-lg">
                                {nopAuthSignIn(providers)}
                            </div>

                        </div>
                    </div>
                    <div>
                        <Link
                            href="/">
                            <button
                                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                            >
                                Tillbaka
                            </button></Link>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Signin;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const session = await getServerSession(context.req, context.res, authOptions)

    if (session) {
        return {
            redirect: { destination: "/" },
        };
    }

    return {
        props: {
            providers: await getProviders(),
            csrfToken: await getCsrfToken(),
        },
    };
}