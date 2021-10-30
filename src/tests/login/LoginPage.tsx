import "./LoginPage.scss";
import React, {ChangeEvent} from "react";
import {Credentials} from "./Credentials";
import {CredentialsPreCheckResult} from "./CredentialsPreCheckResult";
import {ICredentialsPreChecker} from "./ICredentialsPreChecker";

export type LoginPageProps = {}

export type LoginPageState = {
    sessionID?: string,
    credentials: Credentials,
    loggedIn: boolean,
    currentCredentialsCheckResults: Array<CredentialsPreCheckResult>,
    sufficientCredentialsToLogin: boolean
}

export class LoginPage extends React.Component<LoginPageProps, LoginPageState> {

    constructor(props: LoginPageProps) {
        super(props);
        this.state = {
            credentials: {
                username: "",
                password: ""
            },
            loggedIn: false,
            currentCredentialsCheckResults: new Array<CredentialsPreCheckResult>(),
            sufficientCredentialsToLogin: false
        };
    }

    render() {
        return (
            <>
                <pre>{JSON.stringify(this.state, null, 2)}</pre>
                {(() => {
                    if (this.state.loggedIn) {
                        return this.renderSession();
                    } else {
                        return this.renderLogin();
                    }
                })()}
            </>
        );
    }

    private renderLogin(): JSX.Element {
        return (
            <form className={"login"}>
                <label htmlFor={"username"}>Username</label>
                <input id={"username"}
                       onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                           this.updateCredentials("user", ev.currentTarget.value);
                       }}
                       value={this.state.credentials.username}/>

                <label htmlFor={"password"}>Password</label>
                <input id={"password"}
                       onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                           this.updateCredentials("pass", ev.currentTarget.value);
                       }}
                       value={this.state.credentials.password}
                       type={"password"}/>
                <button
                    className={["login-btn", this.state.sufficientCredentialsToLogin ? "active" : "inactive"].join(" ")}
                    onClick={(ev) => {
                        ev.preventDefault();
                        this.login();
                    }}>Login
                </button>
            </form>

        );
    }

    private updateCredentials(source: "user" | "pass", val: string) {
        const newCredentials: Credentials = this.state.credentials;
        if (source === "user") {
            newCredentials.username = val;
        } else if (source === "pass") {
            newCredentials.password = val;
        }
        this.reevaluate(newCredentials);
    }

    private reevaluate(newCredentials: Credentials | undefined) {
        if (newCredentials === undefined) {
            newCredentials = this.state.credentials;
        }
        const results: CredentialsPreCheckResult[] = this.evaluate(newCredentials);
        this.setState({
            currentCredentialsCheckResults: results,
            credentials: newCredentials,
            sufficientCredentialsToLogin: results.includes(CredentialsPreCheckResult.OK)
        });
    }

    private renderSession(): JSX.Element {
        return (
            <div className={"session"}>
                <button
                    className={"logout-btn"}
                    onClick={() => {
                    this.login();
                }}>Logout
                </button>
            </div>
        );
    }

    private evaluate(credentials: Credentials): Array<CredentialsPreCheckResult> {
        let results: CredentialsPreCheckResult[] = [];
        const union: <T>(x1: any[], x2: any[]) => T[] = (x1, x2) => {
            const x3: any[] = x1;
            x2.forEach(x => {
                if (!x3.includes(x)) x3.push(x);
            });
            return x3;
        }
        const checkers: Array<ICredentialsPreChecker> = new Array<ICredentialsPreChecker>({
            check(credentials: Credentials): Array<CredentialsPreCheckResult> {
                const results: Array<CredentialsPreCheckResult> = [];
                if (credentials.username.length === 0) {
                    results.push(CredentialsPreCheckResult.EMPTY_USERNAME);
                }
                if (credentials.password.length === 0) {
                    results.push(CredentialsPreCheckResult.EMPTY_PASSWORD);
                }
                if (results.length === 0) {
                    results.push(CredentialsPreCheckResult.OK);
                }
                return results;
            }
        });
        checkers.forEach(checker => {
            const result: CredentialsPreCheckResult[] = checker.check(credentials);
            results = union(results, result);
        })
        return results;
    }

    private login(skipSession: boolean = true): void {
        if (this.state.sufficientCredentialsToLogin) {
            this.setState({
                loggedIn: !this.state.loggedIn
            });
        }
        const credentials = this.state.credentials;
        if (credentials.username === "Christian") {

        }
    }
}
