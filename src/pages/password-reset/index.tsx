import { sendPasswordResetEmail } from "@firebase/auth";
import {
  type ActionCodeInfo,
  applyActionCode,
  checkActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
  type ActionCodeSettings,
} from "firebase/auth";
import { type NextPage } from "next";
import { useRef } from "react";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { auth } from "~/lib/firebase/firebase";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout headingText={<HighlightText>Night of Passion</HighlightText>}>
      <EmailCard></EmailCard>
      <CodeCard></CodeCard>
      <PasswordCard></PasswordCard>
    </Layout>
  );
};

export default Home;

const EmailCard = () => {
  const inputUsername = useRef<HTMLInputElement>(null);
  const submitFormClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    //console.log("Signin.nopAuthSignIn.signinNopAuth.event", event)
    event.preventDefault();
    const email = inputUsername.current?.value.trim();
    console.log("submitFormClick ", event);
    console.log("reset password for email ", email);
    const actionCodeSettings: ActionCodeSettings = {
      dynamicLinkDomain: "https://nop-website-dev.firebaseapp.com",
      url: "https://nop-website-dev.firebaseapp.com",
    };
    void sendPasswordResetEmail(auth, email || "");
  };
  return (
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
  );
};

const CodeCard = () => {
  const inputCode = useRef<HTMLInputElement>(null);
  const submitFormClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    //console.log("Signin.nopAuthSignIn.signinNopAuth.event", event)
    const code = inputCode.current?.value.trim() || "";
    event.preventDefault();
    console.log("submitFormClick ", event);
    console.log("reset password with code ", code);
    const checkCodeResponse: ActionCodeInfo = await checkActionCode(auth, code);
    console.log("CodeCard.checkCodeResponse", checkCodeResponse);
    const verifyPasswordResetCodeResponse = await verifyPasswordResetCode(
      auth,
      code
    );
    console.log(
      "CodeCard.verifyPasswordResetCodeResponse",
      verifyPasswordResetCodeResponse
    );
    // void applyActionCode(auth, code); // throws an error
  };
  return (
    <Card header="Har ni fått en kod?">
      <div className="text-lg">
        Har ni fått en kod så kan ni ange den nedan för att återställa
        lösenorder
      </div>
      <form className="p-2">
        <div className="m-2">Återställningskod</div>
        <input
          className="w-full rounded-lg px-3 py-3 text-center text-black"
          name="username"
          ref={inputCode}
        ></input>
        <br />

        <br />
        <button
          className="mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
            void submitFormClick(event)
          }
        >
          Ange kod
        </button>
      </form>
    </Card>
  );
};

const PasswordCard = () => {
  const inputPass1 = useRef<HTMLInputElement>(null);
  const inputPass2 = useRef<HTMLInputElement>(null);
  const submitFormClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    //console.log("Signin.nopAuthSignIn.signinNopAuth.event", event)
    event.preventDefault();
    const p1 = inputPass1.current?.value.trim() || "";
    const p2 = inputPass2.current?.value.trim();
    console.log("submitFormClick ", event);
    console.log("reset password with new ", p1, p2);
    if (p1 === p2) {
      const code = "-Ttj6npFTuYDapM7io6n_VbPzOE0VtNZgqHVKYuCs1gAAAGPFh_-Uw";
      void confirmPasswordReset(auth, code, p1);
    }
  };
  return (
    <Card header="Ange nytt lösenord">
      <div className="text-lg">
        Här kan ni ange nytt lösenord. Efter att ni har angett nytt lösenord kan
        ni använda det för att logga in
      </div>
      <form className="p-2">
        <div className="m-2">Lösenord</div>
        <input
          className="w-full rounded-lg px-3 py-3 text-center text-black"
          name="password1"
          ref={inputPass1}
        ></input>
        <br />
        <div className="m-2">Repetera lösenordet</div>
        <input
          className="w-full rounded-lg px-3 py-3 text-center text-black"
          name="password2"
          ref={inputPass2}
        ></input>
        <br />

        <br />
        <button
          className="mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
            submitFormClick(event)
          }
        >
          Återställ lösenord
        </button>
      </form>
    </Card>
  );
};
