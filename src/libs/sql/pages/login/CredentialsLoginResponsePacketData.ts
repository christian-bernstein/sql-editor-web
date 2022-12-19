import {CredentialsCheckResultType} from "./CredentialsCheckResultType";
import {UserProfileData} from "../../logic/data/UserProfileData";

export type CredentialsLoginResponsePacketData = {
    type: CredentialsCheckResultType,
    newSessionID: string,
    profileData: UserProfileData
}
