import couplePic from "./couple_icon_square.png"
import Image from 'next/image'

export const ProfilePic = () => {
    return <Image
        className="w-20 h-20 sm:w-32 sm:h-32 min-w-fit  bg-yellow-50 rounded-full shadow max-w-full align-middle border-4 border-[hsl(280,100%,70%)]"
        src={couplePic}
        alt="John Doe" />

}