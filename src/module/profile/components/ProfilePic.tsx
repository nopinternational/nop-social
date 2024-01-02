import couplePic from "./couple_icon_square.png"
import Image from 'next/image'

export const ProfilePic = ({ variant }: { variant?: string }) => {
    if (variant === "small")
        return <Image
            priority={true}
            className="min-w-fill min-h-fill w-14 h-14 sm:w-32 sm:h-32  bg-yellow-50 rounded-full shadow max-w-full align-middle border-4 border-[hsl(280,100%,70%)]"
            src={couplePic}
            alt="John Doe" />

    return <Image
        priority={true}
        className="min-w-fill min-h-fill h-32 w-32 sm:w-32 sm:h-32  bg-yellow-50 rounded-full shadow max-w-full align-middle border-4 border-[hsl(280,100%,70%)]"
        src={couplePic}
        alt="John Doe" />

}