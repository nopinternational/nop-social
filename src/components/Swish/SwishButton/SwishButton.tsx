import Link from "next/link";

type SwishButtonProp = {
    swishto?: string
    amount: number
    message: string
    // editable?: {
    //     swishto: boolean
    //     amt: boolean
    //     message: boolean
    // }

}

export const CocktailSwishButton = ({ message }: { message: string }) => {
    return <SwishButton message={message} amount={100} />
}

export const SwishButton = ({ swishto = "+46700066099", amount, message }: SwishButtonProp) => {

    const link = `https://app.swish.nu/1/p/sw/?sw=${swishto}&amt=${amount}&cur=SEK&src=qr&msg=${message}&edit=msg,amt`
    return (<>
        <Link href={link}>
            <button
                className="relative rounded-full bg-green-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                Swisha
            </button>
        </Link>
    </>)
}