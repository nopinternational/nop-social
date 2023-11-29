import HighlightText from "~/components/HighlightText";
import { ProfilePic } from "./ProfilePic";

export const ProfileHeader = ({ profileName }: { profileName: string }) => {

    return (
        <div className="">
            <div className="mb-4">
                <ProfilePic />
            </div>
            <h3 className="text-2xl font-bold text-center"><HighlightText>{profileName}</HighlightText></h3>
        </div>
    )
}

