import Image from "next/image"


export const ProfileHeader = () => {

    return (<div className="">
        <div className="">
            <Image
                className="w-32 h-32  bg-yellow-50  rounded-full shadow rounded-full max-w-full h-auto align-middle border-4 border-[hsl(280,100%,70%)]"
                src={couplePic}
                alt="John Doe" />
        </div>
        <h3 className="text-2xl font-bold text-center"><HighlightText>{profile.username}</HighlightText></h3>
    </div>)
}