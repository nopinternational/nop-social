import { type NextPage } from "next";
import { useRef } from "react";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout headingText={<HighlightText>Night of Passion</HighlightText>}>
      <EmailCard></EmailCard>
      <CodeCard></CodeCard>
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
    console.log("submitFormClick ", event);
    console.log(
      "reset password for email ",
      inputUsername.current?.value.trim()
    );
  };
  return (
    <Card header="Återställ lösenord">
      <div className="text-lg">
        Här kan du återställa ditt lösenord. Ange din epost så kommer vi att
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
          Återställ lösenord
        </button>
      </form>
    </Card>
  );
};
const CodeCard = () => {
  const inputCode = useRef<HTMLInputElement>(null);
  const submitFormClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    //console.log("Signin.nopAuthSignIn.signinNopAuth.event", event)
    event.preventDefault();
    console.log("submitFormClick ", event);
    console.log("reset password with code ", inputCode.current?.value.trim());
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
            submitFormClick(event)
          }
        >
          Återställ lösenord
        </button>
      </form>
    </Card>
  );
};
