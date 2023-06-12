import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";

const SigninButton: React.FC = () => {
    const { data: sessionData } = useSession();

    const { data: secretMessage } = api.example.getSecretMessage.useQuery(
        undefined, // no input
        { enabled: sessionData?.user !== undefined },
    );


    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
                {sessionData && <span>Ni är inloggade som <span className="text-[hsl(280,100%,70%)]">{sessionData.user?.name}</span></span>}

            </p>
            <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={sessionData ? () => void signOut({ callbackUrl: '/' }) : () => void signIn()}
            >
                {sessionData ? "Logga ut" : "Logga in"}
            </button>
        </div>
    );
};

export default SigninButton