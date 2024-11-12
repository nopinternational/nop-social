import Link from "next/link";


type ProfileLinkProps = {
    username: string
}


export const ProfileLink = ({ username }: ProfileLinkProps) => {

    return <Link href={`/app/profile/${username}`}>
        {username}
    </Link>;
};