import {SessionIDCheckResultType} from "./SessionIDCheckResultType";
import {UserProfileData} from "../../logic/UserProfileData";

export type SessionIDLoginResponsePacketData = {
    type: SessionIDCheckResultType,
    profileData: UserProfileData
}
