import { type NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useState } from "react";
import { checkActionCode, confirmPasswordReset } from "firebase/auth";

import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import Layout from "~/components/Layout";
import { auth } from "~/lib/firebase/firebase";
import { Spinner } from "~/components/Spinner";
import Link from "next/link";
import { PasswordCard } from "~/module/profile/components/PasswordCard";

const Home: NextPage = () => {
    const searchParams = useSearchParams();
    const [isCodeOK, setCodeOk] = useState<boolean | null>(null);
    const [isSuccessful, setSuccessful] = useState(false);
    const [isVeryingCodeTimeout, setVerifyingCodeTimeout] = useState(false);
    const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);

    const code = searchParams.get("oobCode");

    const deferredCode = useDeferredValue(code);

    useEffect(
        () => {
            if (code) {
                const checkCode = async (code: string) => {
                    const actionCodeInfo = await checkActionCode(auth, code);
                };

                if (timeoutRef) {
                    clearTimeout(timeoutRef);
                } else {
                }
                //checkCode(code).catch(console.error);
                checkActionCode(auth, code)
                    .then((result) => {
                        setCodeOk(true);
                    })
                    .catch((error) => {
                        setCodeOk(false);
                        console.error(error);
                    });
            } else {
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
            clearTimeout(ref);
        };
    }, []);

    const onPasswordChange = (password: string) => {
        void confirmPasswordReset(auth, code as string, password);
        setSuccessful(true);
    };

    if (isSuccessful) {
        return (
            <Layout
                includeSigninSignoutButton={false}
                headingText={<HighlightText>Night of Passion</HighlightText>}
            >
                <SuccessfulCard />
            </Layout>
        );
    }

    return (
        <Layout
            includeSigninSignoutButton={false}
            headingText={<HighlightText>Night of Passion</HighlightText>}
        >
            {isCodeOK == null ? (
                <VerifyingCode
                    showPendingMessage={isVeryingCodeTimeout}
                ></VerifyingCode>
            ) : null}

            {isCodeOK ? (
                <PasswordCard onPasswordChange={onPasswordChange}></PasswordCard>
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
                <>
                    <div className="text-lg">
                        <HighlightText>
              Har ni klickat på länken i mailet eller klistrat in den korrekt i
              er webbläsare?
                        </HighlightText>
                    </div>
                    <Link href="/password-reset">
                        <button className="mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
              Försök igen
                        </button>
                    </Link>
                </>
            ) : null}
        </Card>
    );
};

const SuccessfulCard = () => {
    return (
        <Card header="Lösenordet är ändrat">
            <div className="text-lg">
        Nu är lösenordet ändrat. Vänligen logga in igen med det nya lösenordet.
            </div>
            <Link href="/signin">
                <button className="mb-3 mt-4 rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
          Logga in
                </button>
            </Link>
        </Card>
    );
};
