import Link from "next/link";
import Image, { type StaticImageData } from 'next/image';
import swishLogoSVG from "./swishLogoSVG.svg"

type SwishButtonProp = {
    swishto?: string
    amount: number
    message: string
    // editable?: {
    //     amt: boolean
    //     message: boolean
    // }

}

export const CocktailSwishButton = ({ message }: { message: string }) => {
    return <SwishButton message={message} amount={100} />
}

export const SwishButton = ({ swishto = "+46700066099", amount, message }: SwishButtonProp) => {
    // How to generate url
    // https://developer.swish.nu/documentation/guides/generate-qr-codes
    const link = `https://app.swish.nu/1/p/sw/?sw=${swishto}&amt=${amount}&cur=SEK&src=qr&msg=${message}&edit=msg,amt`
    return (<>
        <Link href={link}>
            <button
                className="flex items-center gap-3 relative rounded-full bg-green-600 px-8 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                <Image
                    priority
                    src={swishLogoSVG as StaticImageData}
                    alt="Follow us on Twitter"
                    height={30}
                />
                <span>Swisha</span>
            </button>
        </Link>
    </>)
}