import Link from "next/link";
import { useState } from "react";
import { Card } from "~/components/Card";
import HighlightText from "~/components/HighlightText";
import { Spinner } from "~/components/Spinner";

export const AttendingAndPayWithSodality = ({ ticketUrl }: { ticketUrl: string }) => {

    const [showSpinner, setShowSpinner] = useState(false);
    
    const startPollForPayment = () => {
        setShowSpinner(true);
    };

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
                        <Link href={ticketUrl} target="ticketpayment">
                            <button
                                className="flex items-center gap-3 relative rounded-full bg-green-600 px-8 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                                onClick={startPollForPayment}>
                                <span>Betala</span>
                            </button>
                        </Link>
                    </div>
                    {showSpinner ? <div><Spinner></Spinner>
                    </div>: null}
                </Card>
            </div>
        </div>);

};