import {Credentials} from "../../pages/login/Credentials";

export type LoginCallConfig = {
    initialLoginProcedure: "session" | "session-credentials" | "credentials"
    sessionID?: string,
    onCredentialsLoginUnknownUsername?: () => void,
    onCredentialsLoginPasswordIncorrect?: () => void,
    onSessionIDLoginSessionNotPresent?: () => void,
    onLoginSuccess?: () => void,
    onLoginFail?: () => void,
    onLoginProcessStarted?: () => void,
    onLoginProcessEnded?: () => void
    credentials?: Credentials
}
