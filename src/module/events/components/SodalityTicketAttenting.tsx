import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import { Spinner } from "~/components/Spinner";

export const AttendingAndPayWithSodality = ({ ticketUrl }: { ticketUrl: string }) => {

    const [showSpinner, setShowSpinner] = useState(false);
    const [hasPayed, setHasPayed] = useState(false);
    const session = useSession();
    const currentEmail = session.data?.user.email;
    
    const startPollForPayment = () => {
        setShowSpinner(true);
    };

    const lemonPayments = (payments: [{}], currentUserEmail: string) => {
        console.log("lemonPayments", payments, currentEmail);
        const thisUserHasPayed: boolean = payments.filter(p => p.email === currentEmail).length > 0;
        console.log("thisUserHasPayed", thisUserHasPayed);
        if (thisUserHasPayed) {
            setShowSpinner(false);
            setHasPayed(true);

        }

    };
    const fetchPayments = async () => {
        const res = await fetch("http://localhost:3000/api/payments");
        const payments = await res.json();
        console.log("fetchPayments", payments, session);
        lemonPayments(payments, currentEmail);
        return payments;
    };
    const { data, status } = useQuery(["paymets"], fetchPayments, {
        enabled: showSpinner,
        refetchInterval: 2000,
    });

    console.log("status:", status);

    return (
        <div className="grid grid-cols-2  gap-4   sm:grid-cols-2 md:gap-8">
            <div className="col-span-2">
                <Card
                    header={
                        <>
                            Välkommen på <HighlightText>Cocktailträff 🎉🍸🍾</HighlightText>
                        </>
                    }
                >
                    <div className="text-lg ">
                        Nu är ni anmälda och nedan finns information hur ni betalar för
                        träffen. Efter betalningen så kommer vi lägga till er till träffen
                        och ni kan då se vilka andra som har anmält sig.
                    </div>
                    <div className="text-lg ">
                        Vi kommer att maila ut mer info några dagar innan träffen. Då
                        berättar vi vilket ställe vi ska ses på. Håll utkik i er mailkorg.
                    </div>
                </Card>
                <Card
                    header={
                        <>
                            <HighlightText>Betala</HighlightText> för träffen
                        </>
                    }
                >
                    <div className="whitespace-pre-wrap text-lg">
                        Vi samarbetar med Sodality för att betala för cocktailträffen. Klickan nedan för att starta betalningen.
                    </div>
                    <div className="flex items-center justify-center">
                        <Link href={"https://www.google.com" || ticketUrl} target="ticketpayment">
                            <button
                                disabled={showSpinner || hasPayed}
                                className="flex items-center gap-3 relative rounded-full bg-green-600 px-8 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                                onClick={startPollForPayment}>
                                <span>Betala</span>
                            </button>
                        </Link>
                    </div>
                    {showSpinner ? <div><Spinner></Spinner>
                    </div> : null}
                    {hasPayed ?
                        <div className="text-lg text-green-600">Ni har nu betalat för träffen  </div> : null}
                </Card>
            </div>
        </div>);

};