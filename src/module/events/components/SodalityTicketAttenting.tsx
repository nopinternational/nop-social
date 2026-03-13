import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import { Spinner } from "~/components/Spinner";
import { api } from "~/utils/api";

export const AttendingAndPayWithSodality = ({ ticketUrl }: { ticketUrl: string }) => {

    const [showSpinner, setShowSpinner] = useState(false);
    const [hasPayed, setHasPayed] = useState(false);
    
    const session = useSession();
    const currentEmail = session.data?.user.email || null;
    
    const startPayment = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        //startTicketPayment();
        setShowSpinner(true);
    };

    type UserPaid = {
        email: string
    }

    const checkForPayment = (payments: UserPaid[], currentUserEmail: string | null) => {
        const thisUserHasPayed: boolean = payments.filter(p => p.email === currentUserEmail).length > 0;
        if (thisUserHasPayed) {
            setShowSpinner(false);
            setHasPayed(true);

        }

    };

    const fetchPayments = async () => {
        const res = await fetch("http://localhost:3000/api/payments");
        const payments: UserPaid[] = await res.json() as UserPaid[];
        checkForPayment(payments, currentEmail);
        return payments;
    };

    useQuery({
        queryKey: ["paymets"],
        queryFn: fetchPayments,
        enabled: false,
        refetchInterval: 2000,
    });


    

    

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
                        {/* <Link href={ ticketUrl} target="ticketpayment"> */}
                        <Link href="#" target="ticketpayment">
                            <button
                                disabled={showSpinner || hasPayed}
                                className="flex items-center gap-3 relative rounded-full bg-green-600 px-8 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                                onClick={startPayment}>
                                <span>Betala</span>
                            </button>
                        </Link>
                    </div>
                    {showSpinner ? <div><Spinner></Spinner>
                        <MemberlyPayment eventId={ticketUrl} ></MemberlyPayment>
                    </div> : null}
                    {hasPayed ?
                        <div className="text-lg text-green-600">Ni har nu betalat för träffen  </div> : null}
                </Card>
            </div>
        </div>);

};

const MemberlyPayment = ({ eventId }: {eventId: string}) => {
    //const [memberlyData, setMemberlyData] = useState<MemberlyInitTicketPayResponse | null>(null);

    const initiatePayment = api.memberly.initiateTicketPayment.useQuery(
        { eventId: eventId },
        {
            enabled: true
        }
    );

    // async function startTicketPayment(): Promise<void> {
    //     console.log("startTicketPayment");
    //     // event.preventDefault();
    //     //const foo = await initiatePayment.refetch();
    //     console.log("foo:", foo);
    //     console.log("foo.data:", foo.data);
    //     setMemberlyData(foo.data);
    // }
    if (initiatePayment.isSuccess) {
        const data = initiatePayment.data;
        // setMemberlyData(data);
    
        const memberlyData = data;

        return (
            <div>
                <div>
                    <p>MemberlyPayment</p>
                </div>
                <div>{memberlyData?.acquireTicketUrl}</div>
                <Link href={memberlyData?.acquireTicketUrl || ""} target="acquireticket">
                    <button
                        className="flex items-center gap-3 relative rounded-full bg-green-600 px-8 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                    ticket
                    </button>
                </Link>

                <div>{memberlyData?.acquireMembershipUrl}</div>
                <Link href={
                    memberlyData?.acquireMembershipUrl || ""} target="acquiremembership">
                    <button
                        className="flex items-center gap-3 relative rounded-full bg-green-600 px-8 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                    membership
                    </button>
                </Link>
            </div>
        );
    }
    return null;
};