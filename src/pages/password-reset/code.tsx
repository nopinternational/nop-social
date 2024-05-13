import { type NextPage } from "next";
import { useSearchParams } from "next/navigation";
import {
  type ChangeEvent,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { sendPasswordResetEmail } from "@firebase/auth";
import {
  checkActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
  type ActionCodeInfo,
} from "firebase/auth";

import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { auth } from "~/lib/firebase/firebase";
import { Spinner } from "~/components/Spinner";
import { useRouter } from "next/router";
import Link from "next/link";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isCodeOK, setCodeOk] = useState<boolean | null>(null);
  const [isVeryingCodeTimeout, setVerifyingCodeTimeout] = useState(false);
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);

  const code = searchParams.get("oobCode");
  console.log("reset password code: ", code, searchParams);
  console.log("reset password code: ", code, searchParams.entries());

  console.log("router.query: ", router.query);
  const deferredCode = useDeferredValue(code);
  console.log("deferredCode", deferredCode);
  console.log("------------------------------------ ");

  useEffect(
    () => {
      if (code) {
        const checkCode = async (code: string) => {
          console.log("call firebase to verify code");
          const actionCodeInfo = await checkActionCode(auth, code);
          console.log("check code -- actionCodeInfo", actionCodeInfo);
        };

        console.log("xxxxxxx -- lets verify the code");

        if (timeoutRef) {
          console.log("xxxxxxx -- clear timeout");

          clearTimeout(timeoutRef);
        } else {
          console.log("xxxxxxx -- no timeout to clear");
        }
        //checkCode(code).catch(console.error);
        checkActionCode(auth, code)
          .then((result) => {
            console.log("code is verified", result);
            setCodeOk(true);
          })
          .catch((error) => {
            setCodeOk(false);
            console.error(error);
          });
      } else {
        console.log("xxxxxxx -- code is null, do nothing");
      }
    },
    [code, timeoutRef] // [code]
  );

  useEffect(() => {
    const ref = setTimeout(() => {
      setVerifyingCodeTimeout(true);
    }, 3000);
    setTimeoutRef(ref);
    return () => {
      console.log("--clear timeout--");
      clearTimeout(ref);
    };
  }, []);

  searchParams.forEach((p) =>
    console.log("SearchParam", p, searchParams.get(p))
  );

  const onPasswordChange = (password: string) => {
    alert("password: " + password + " code: " + (code || ""));
  };

  return (
    <Layout headingText={<HighlightText>Night of Passion</HighlightText>}>
      {isCodeOK == null ? (
        <VerifyingCode
          showPendingMessage={isVeryingCodeTimeout}
        ></VerifyingCode>
      ) : null}

      {/* {isVeryingCodeTimeout ? (
        <Card header="Rätt kod">
          <div className="text-lg">
            Har ni klickat på länken i mailet eller klistrat in den korrekt i er
            webbläsare?
          </div>
        </Card>
      ) : null} */}
      {isCodeOK ? (
        <PasswordCard
          code={code || ""}
          onPasswordChange={onPasswordChange}
        ></PasswordCard>
      ) : null}
      {isCodeOK != null && !isCodeOK ? (
        <CodeCannotBeVerified></CodeCannotBeVerified>
      ) : null}
    </Layout>
  );
};

export default Home;
const CodeCannotBeVerified = () => {
  return (
    <Card header="Felaktig kod">
      <div className="text-lg">
        Länken från mailet innehåller en felaktig kod.{" "}
      </div>
      <Link href="/password-reset">
        <button className="mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
          Försök igen
        </button>
      </Link>
    </Card>
  );
};
const VerifyingCode = ({
  showPendingMessage,
}: {
  showPendingMessage?: boolean;
}) => {
  return (
    <Card header="Verifierar kod">
      <div className="text-lg">Vänligen vänta medans vi verifierar koden</div>
      <Spinner />
      {showPendingMessage ? (
        <div className="text-lg">
          <HighlightText>
            Har ni klickat på länken i mailet eller klistrat in den korrekt i er
            webbläsare?
          </HighlightText>
        </div>
      ) : null}
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
        lösenordet.
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

const PasswordCard = ({
  code,
  onPasswordChange,
}: {
  code: string;
  onPasswordChange?: (password: string) => void;
}) => {
  const inputPass1 = useRef<HTMLInputElement>(null);
  const inputPass2 = useRef<HTMLInputElement>(null);
  const [getPass, setPass] = useState({ password1: "", password2: "" });
  const [getPass1, setPass1] = useState("");
  const [getPass2, setPass2] = useState("");
  // const [passwordMatches, setPasswordMatches] = useState(false);
  const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);

  const onChangePass = (e: ChangeEvent<HTMLInputElement>) => {
    const k = e.target.name || "";
    const v = e.target.value || "";
    const newState = { ...getPass };
    newState[k] = v;
    setPass(newState);
    console.log("newState", newState);
  };

  const onChangePass2 = (e: ChangeEvent<HTMLInputElement>) => {
    onChangePass(e);
    console.log(e);
    const p2 = e.target.value;
    setPass2(p2);
    console.log(
      "onChangePass2",
      e.target.name,
      getPass1,
      p2,
      getPass1 == p2,
      getPass1 == p2 && getPass1
    );
    if (getPass1 == p2 && getPass1) {
      console.log("setPasswordMatches", true);
      // setPasswordMatches(true);
    } else {
      console.log("setPasswordMatches", false);
      // setPasswordMatches(false);
    }
  };

  const submitFormClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    //console.log("Signin.nopAuthSignIn.signinNopAuth.event", event)
    event.preventDefault();
    // const p1 = inputPass1.current?.value.trim() || "";
    // const p2 = inputPass2.current?.value.trim();
    const p1 = getPass("password1") as string;
    const p2 = getPass("password2");

    const passwordMatches = p1 === p2 && p1 != "";
    console.log("submitFormClick ", event);
    console.log("reset password with new ", p1, p2, passwordMatches);

    if (passwordMatches) {
      //void confirmPasswordReset(auth, code, p1);
      onPasswordChange && onPasswordChange(p1);
      console.log("new password is set to ", p1);
    } else {
      setShowPasswordMismatch(true);
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
          value={getPass["password1"]}
          onChange={onChangePass}
        ></input>
        <br />
        <div className="m-2">Repetera lösenordet</div>
        <input
          className="w-full rounded-lg px-3 py-3 text-center text-black"
          name="password2"
          ref={inputPass2}
          value={getPass["password2"]}
          onChange={onChangePass}
        ></input>
        <br />
        {showPasswordMismatch ? (
          <p>Lösenorden matchar inte</p>
        ) : (
          <p>lösen matchar</p>
        )}

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
