/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type RefObject, useRef, useState } from "react";
import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
// import { providers, signIn, getSession, csrfToken } from "next-auth/client/";
import { getProviders, signIn, getCsrfToken } from "next-auth/react";
import authOptions from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import type { Provider } from "next-auth/providers";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

type SigninPageProps = {
  providers: Provider[];
};

const Signin = ({ providers }: SigninPageProps) => {
    const router = useRouter();
    const { error, callbackUrl } = router.query;

    const inputUsername = useRef<HTMLInputElement>(null);
    const inputPassword = useRef<HTMLInputElement>(null);

    const nopAuthSignIn = (providers: Provider[]) => {
        const nopSigninProvider = Object.values(providers).filter(
            (provider) => provider.id == "nop-auth"
        )[0];

        if (!nopSigninProvider) return <div>no nop</div>;

        const signinNopAuth = (
            event: React.MouseEvent<HTMLButtonElement>
        ): void => {
            //console.log("Signin.nopAuthSignIn.signinNopAuth.event", event)
            event.preventDefault();
            const u = inputUsername.current?.value.trim();
            const p = inputPassword.current?.value.trim();
            void signIn("nop-auth", {
                //redirect: true,
                callbackUrl: (callbackUrl as string) || "/app/welcome",
                username: u,
                password: p,
            });
        };

        return (
            <>
                {error ? (
                    <div className="text-[hsl(280,100%,70%)]">
            Felaktig inloggning, försök igen
                    </div>
                ) : null}
                <form className="p-2">
                    <div className="m-2">email</div>
                    <input
                        className="w-full rounded-lg px-3 py-3 text-center text-black"
                        name="username"
                        ref={inputUsername}
                    ></input>
                    <br />
                    <div className="m-2">lösenord</div>

                    <PasswordInput passwordRef={inputPassword}></PasswordInput>
                    <div className="m-2 ">
                        <HighlightText>
                            <Link href="/password-reset">Glömt lösenord?</Link>
                        </HighlightText>
                    </div>
                    <br />
                    <button
                        className="mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                            signinNopAuth(event)
                        }
                    >
            Logga in
                    </button>
                </form>
            </>
        );
    };

    return (
        <Layout includeSigninSignoutButton={false} headingText={<></>}>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Logga in till <HighlightText>Night of Passion</HighlightText>
                    </h1>
                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8 xl:w-1/2">
                        <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                            <h3 className="text-2xl font-bold ">Logga in →</h3>
                            <div className="text-lg">{nopAuthSignIn(providers)}</div>
                        </div>
                    </div>
                    <div>
                        <Link href="/">
                            <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                Tillbaka
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default Signin;

const PasswordInput = ({
    passwordRef,
}: {
  passwordRef: RefObject<HTMLInputElement>;
}) => {
    const [type, setType] = useState("password");
    const [icon, setIcon] = useState<object>(eyeOff);

    const handleEyeToggle = () => {
        if (type === "password") {
            setIcon(eye);
            setType("text");
        } else {
            setIcon(eyeOff);
            setType("password");
        }
    };

    return (
        <div className="mb-4 flex">
            <input
                className="w-full rounded-lg px-3 py-3 text-center text-black"
                name="password"
                type={type}
                ref={passwordRef}
            />
            <span
                className="flex items-center justify-around text-black"
                onClick={handleEyeToggle}
            >
                <Icon className="absolute mr-14" icon={icon} size={25} />
            </span>
        </div>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getServerSession(context.req, context.res, authOptions);

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
};
