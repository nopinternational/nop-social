import { signIn, signOut, useSession } from "next-auth/react";
import HighlightText from "./HighlightText";
import Link from "next/link";


const SigninButton: React.FC = () => {
    const { data: sessionData } = useSession();

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
                {sessionData && <span>Ni är inloggade som <HighlightText>{sessionData.user?.name}</HighlightText></span>}
            </p>
            <div className="flex flex-wrap justify-center justify-self-center">
                <div className="p-2">
                    <Link href={"/app/profile/edit"}>
                        <button
                            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                            Ändra er profil
                        </button>
                    </Link>
                </div>
            </div>

            <button
                className="rounded-full bg-pink-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={sessionData ? () => void signOut({ callbackUrl: '/' }) : () => void signIn()}
            >
                {sessionData ? "Logga ut" : "Logga in"}
            </button>

        </div>
    );
};

export default SigninButton