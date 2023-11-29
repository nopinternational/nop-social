import { signIn, signOut, useSession } from "next-auth/react";
import HighlightText from "./HighlightText";
import Link from "next/link";

type CTA_Button = {
    text: string
    url: string
    isnew?: boolean
}

const BUTTONS: CTA_Button[] = [
    {
        text: "Visa alla profiler",
        url: "/app/profile"
    },
    {
        text: "Ändra er profil",
        url: "/app/profile/edit"
    },
    {
        text: "Visa alla träffar",
        url: "/app/event"
    },
    {
        text: "Meddelanden",
        url: "/app/message",
        isnew: true
    },

]

const Footer: React.FC = () => {
    const { data: sessionData } = useSession();

    const renderNotLoggedIn = () => {
        return (
            <div className="flex flex-col items-center justify-center gap-4">

                <button
                    className="rounded-full bg-pink-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                    onClick={sessionData ? () => void signOut({ callbackUrl: '/' }) : () => void signIn()}
                >
                    {sessionData ? "Logga ut" : "Logga in"}
                </button>

            </div>
        )
    }

    if (!sessionData) {
        return renderNotLoggedIn()
    }

    const renderButton = (button: CTA_Button) => {

        return (
            <CTAButton button={button} />
        )
    }
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
                <span>Ni är inloggade som <HighlightText>{sessionData.user?.name}</HighlightText></span>
            </p>
            <div className="flex flex-wrap justify-center justify-self-center">
                {BUTTONS.map(button => <CTAButton key={button.url} button={button} />)}
            </div>

            <button
                className="mt-4 mb-3 rounded-full bg-pink-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={sessionData ? () => void signOut({ callbackUrl: '/' }) : () => void signIn()}
            >
                Logga ut
            </button>

        </div>
    );
};

export default Footer

const CTAButton = ({ button }: { button: CTA_Button }) => {

    return (
        <div className="p-2" >
            <Link href={button.url}>
                <button
                    className="relative rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                    {button.text}

                    {button.isnew ?
                        <div className="absolute p-2 inline-flex items-center justify-center h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">Nytt</div>
                        : null}


                </button>
            </Link>
        </div>
    )
}