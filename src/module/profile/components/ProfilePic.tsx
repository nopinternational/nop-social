import defaultCouplePic from "./couple_icon_square.png";
import Image, { type StaticImageData } from "next/image";

type ProfilePicProps = { variant?: string; url?: string };
export const ProfilePic = ({ variant, url }: ProfilePicProps) => {
    const couplePic: string | StaticImageData = url || defaultCouplePic;

    if (variant === "small")
        return (
            <Image
                // loader={url ? () => url : undefined}
                priority = { true}
                className="min-w-fill min-h-fill h-14 w-14 max-w-full rounded-full  border-4 border-[hsl(280,100%,70%)] bg-yellow-50 align-middle shadow sm:h-32 sm:w-32"
                src={couplePic}
                width={500}
                height={500}
                alt="John Doe"
            />
        );

    return (
        <Image
            // loader={url ? () => url : undefined}
            priority={true}
            className="rounded-full aspect-square object-cover h-32 w-32 border-4 border-[hsl(280,100%,70%)] bg-yellow-50 align-middle shadow sm:h-32 sm:w-32"
            src={couplePic}
            width={500}
            height={500}
            alt="John Doe"
        />
    );
};
