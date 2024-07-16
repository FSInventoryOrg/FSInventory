import { prependHostIfMissing } from "@/lib/utils";
import { FullScaleIcon } from "../icons/FullScaleIcon";
import ProfileCardDetails from "./ProfileCardDetails";
import ProfilePicture from "./ProfilePicture";
import { UploadImage, UserType } from "@/types/user";

interface ProfileCardProps {
  isSM: boolean;
  isMD: boolean;
  user: UserType;
  avatar: string;
  onSave: (data: UploadImage) => void;
}

const ProfileCard = ({
  isSM,
  isMD,
  avatar,
  user,
  onSave,
}: ProfileCardProps) => {
  return (
    <div
      id="side"
      className="flex flex-col md:max-w-80 items-center bg-accent rounded-md gap-4 py-4 md:px-4"
    >
      {!isMD && (
        <FullScaleIcon
          size={isSM && !isMD ? 80 : 40}
          className="fill-current text-primary"
        />
      )}

      <ProfilePicture
        src={prependHostIfMissing(avatar)}
        userId={user._id}
        onSave={onSave}
      />
      <ProfileCardDetails userData={user} />
    </div>
  );
};

export default ProfileCard;
