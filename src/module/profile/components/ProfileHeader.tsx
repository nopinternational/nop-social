import Image from 'next/image'

import HighlightText from "~/components/HighlightText";

import couplePic from "./couple_icon_square.png"

export const ProfileHeader = () => {
    const profile = {"username" :"Jane & Joe"}
    return (<div className="">
        <div className="">
            <Image
                className="w-32 h-32 bg-yellow-50 rounded-full shadow max-w-full align-middle border-4 border-[hsl(280,100%,70%)]"
                src={couplePic}
                alt="John Doe" />
        </div>
        <h3 className="text-2xl font-bold text-center"><HighlightText>{profile.username}</HighlightText></h3>
    </div>)
}