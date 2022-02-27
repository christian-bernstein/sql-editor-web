import {SessionIDCheckResultType} from "./SessionIDCheckResultType";
import {UserProfileData} from "../../logic/data/UserProfileData";

export type SessionIDLoginResponsePacketData = {
    type: SessionIDCheckResultType,
    profileData: UserProfileData
}
