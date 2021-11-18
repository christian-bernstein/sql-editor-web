import {Credentials} from "./Credentials";
import {CredentialsPreCheckResult} from "./CredentialsPreCheckResult";

export interface ICredentialsPreChecker {
    check(credentials: Credentials): Array<CredentialsPreCheckResult>;
}
