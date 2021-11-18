import {CredentialsCheckResultType} from "./CredentialsCheckResultType";

export type CredentialsLoginResponsePacketData = {
    type: CredentialsCheckResultType,
    newSessionID: string
}
