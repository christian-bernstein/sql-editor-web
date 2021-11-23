import {CredentialsCheckResultType} from "./CredentialsCheckResultType";
import {UserProfileData} from "../../logic/UserProfileData";

export type CredentialsLoginResponsePacketData = {
    type: CredentialsCheckResultType,
    newSessionID: string,
    profileData: UserProfileData
}
