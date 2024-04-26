import { type NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { sendPasswordResetEmail } from "@firebase/auth";
import {
  checkActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
  type ActionCodeSettings,
  type ActionCodeInfo,
} from "firebase/auth";

import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { auth } from "~/lib/firebase/firebase";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const searchParams = useSearchParams();

  const code = searchParams.get("oobCode");
  console.log("reset password code: ", code, searchParams);

  const emailSubmitted = (email: string) => {
    console.log("Email has been submitted", email);
    void sendPasswordResetEmail(auth, email);
    navigateToCodePage();
  };

  const navigateToCodePage = () => {
    console.log("navigateToCodePage");
  };

  return (
    <Layout headingText={<HighlightText>Night of Passion</HighlightText>}>
      <EmailCard
        emailSubmitted={emailSubmitted}
        gotoCodeInputClicked={() => {
          navigateToCodePage();
        }}
      ></EmailCard>
    </Layout>
  );
};

export default Home;

const EmailCard = ({
  emailSubmitted,
  gotoCodeInputClicked,
}: {
  emailSubmitted?: (email: string) => void;
  gotoCodeInputClicked?: () => void;
}) => {
  const inputUsername = useRef<HTMLInputElement>(null);
  const submitFormClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    //console.log("Signin.nopAuthSignIn.signinNopAuth.event", event)
    event.preventDefault();
    const email = inputUsername.current?.value.trim() || "";
    console.log("submitFormClick ", event);
    console.log("reset password for email ", email);

    emailSubmitted && emailSubmitted(email);
  };

  return (
    <>
      <Card header="Återställ lösenord">
        <div className="text-lg">
          Här kan du återställa ditt lösenord. Ange er epost så kommer vi att
          skicka ett mail till er med en återställningskod.
        </div>
        <form className="p-2">
          <div className="m-2">email</div>
          <input
            className="w-full rounded-lg px-3 py-3 text-center text-black"
            name="username"
            ref={inputUsername}
          ></input>
          <br />

          <br />
          <button
            className="mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              submitFormClick(event)
            }
          >
            Skicka mail
          </button>
        </form>
      </Card>
      <Card header="Har ni fått en kod?">
        <div className="text-lg">
          Har ni redan fått en kod skickad till er, klicka här så kan ni direkt
          ange den.
        </div>
        <form className="p-2">
          <button
            className="mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              gotoCodeInputClicked && gotoCodeInputClicked();
            }}
          >
            Ange kod
          </button>
        </form>
      </Card>
    </>
  );
};
