import { sendPasswordResetEmail } from "firebase/auth";
import { type NextPage } from "next";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";

import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { auth } from "~/lib/firebase/firebase";

const Home: NextPage = () => {
  const router = useRouter();
  const [isEmailSent, setEmailSent] = useState(false);

  const emailSubmitted = (email: string) => {
    console.log("Email has been submitted", email);
    void sendPasswordResetEmail(auth, email);
    setEmailSent(true);
    // navigateToCodePage();
  };

  // const navigateToCodePage = () => {
  //   console.log("navigateToCodePage");
  //   router.push("/password-reset/code");
  // };

  return (
    <Layout headingText={<HighlightText>Night of Passion</HighlightText>}>
      {isEmailSent ? (
        <EmailSentCard></EmailSentCard>
      ) : (
        <EmailCard emailSubmitted={emailSubmitted}></EmailCard>
      )}
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
  const inputEmail = useRef<HTMLInputElement>(null);
  const submitFormClick = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const email = inputEmail.current?.value.trim() || "";

    emailSubmitted && emailSubmitted(email);
  };

  return (
    <>
      <Card header="Återställ lösenord">
        <div className="text-lg">
          Här kan du återställa ditt lösenord. Ange er epost så kommer vi att
          skicka ett mail till er med en återställningskod.
        </div>
        <form className="p-2" onSubmit={(event) => submitFormClick(event)}>
          <div className="m-2">email</div>
          <input
            className="w-full rounded-lg px-3 py-3 text-center text-black"
            name="email"
            type="email"
            required
            ref={inputEmail}
          ></input>
          <br />

          <br />
          <button
            type="submit"
            className="mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          >
            Skicka mail
          </button>
        </form>
      </Card>
    </>
  );
};

const EmailSentCard = () => {
  return (
    <>
      <Card header="Kolla er email">
        <div className="text-lg">
          Vi har skickat ett email till adressen ni angav. I den finns en länk
          ni behöver klicka (eller kopiera in i er webbläsare) för att
          återställa ert lösenord.
        </div>
      </Card>
    </>
  );
};
