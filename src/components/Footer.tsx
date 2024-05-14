import { signIn, signOut, useSession } from "next-auth/react";
import HighlightText from "./HighlightText";
import Link from "next/link";

type CTA_Button = {
  text: string;
  url: string;
  isnew?: boolean;
};

const BUTTONS: CTA_Button[] = [
  {
    text: "Visa alla profiler",
    url: "/app/profile",
  },
  {
    text: "Ändra er profil",
    url: "/app/profile/edit",
  },
  {
    text: "Visa alla träffar",
    url: "/app/event",
  },
  {
    text: "Meddelanden",
    url: "/app/message",
    isnew: false,
  },
];

type FooterProps = {
  includeSigninSignoutButton?: boolean;
};

const Footer: React.FC<FooterProps> = ({
  includeSigninSignoutButton = true,
}: FooterProps) => {
  const { data: sessionData } = useSession();

  const renderNotLoggedIn = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        {includeSigninSignoutButton ? (
          <button
            className="rounded-full bg-pink-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={
              sessionData
                ? () => void signOut({ callbackUrl: "/" })
                : () => void signIn()
            }
          >
            {sessionData ? "Logga ut" : "Logga in"}
          </button>
        ) : null}
      </div>
    );
  };

  if (!sessionData) {
    return renderNotLoggedIn();
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        <span>
          Ni är inloggade som{" "}
          <HighlightText>{sessionData.user?.name}</HighlightText>
        </span>
      </p>
      <div className="flex flex-wrap justify-center justify-self-center">
        {BUTTONS.map((button) => (
          <CTAButton key={button.url} button={button} />
        ))}
      </div>

      <button
        className="mb-3 mt-4 rounded-full bg-pink-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={
          sessionData
            ? () => void signOut({ callbackUrl: "/" })
            : () => void signIn()
        }
      >
        Logga ut
      </button>
    </div>
  );
};

export default Footer;

const CTAButton = ({ button }: { button: CTA_Button }) => {
  return (
    <div className="p-2">
      <Link href={button.url}>
        <button className="relative rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
          {button.text}

          {button.isnew ? (
            <div className="absolute -end-2 -top-2 inline-flex h-6 items-center justify-center rounded-full border-2 border-white bg-red-500 p-2 text-xs font-bold text-white dark:border-gray-900">
              Nytt
            </div>
          ) : null}
        </button>
      </Link>
    </div>
  );
};
