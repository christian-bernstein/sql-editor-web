import {ContextualLink} from "./ContextualLink";
import {UserActiveState} from "./UserActiveState";
import {ClientDeviceType} from "./ClientDeviceType";
import {ProfileBadgeData} from "./ProfileBadgeData";
import {ImageData} from "./ImageData";

export type UserPublicProfileData = {
    id: string,
    email: string
    username: string,
    firstname: string,
    lastname: string,
    lastActive?: Date,
    profilePicture: ImageData,
    banner: ImageData,
    biography: string,
    links: ContextualLink[],
    activeState: UserActiveState,
    deviceType?: ClientDeviceType,
    badges: ProfileBadgeData[],
    viewedFromID?: string
}
