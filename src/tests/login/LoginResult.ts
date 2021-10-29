import {LoginResultType} from "./LoginResultType";

export type LoginResult = {
    type: LoginResultType,
    sessionID?: string
}
