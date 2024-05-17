import HighlightText from "~/components/HighlightText";
import { ProfilePic } from "./ProfilePic";

type ProfileHeaderProps = {
  profileName: string;
  avatar?: string;
};
export const ProfileHeader = (props: ProfileHeaderProps) => {
  return (
    <>
      <div className="mb-4">
        <ProfilePic url={props.avatar}/>
      </div>
      <h3 className="text-center text-2xl font-bold">
        <HighlightText>{props.profileName}</HighlightText>
      </h3>
    </>
  );
};
