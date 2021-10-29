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
    lastResults: Array<CredentialsPreCheckResult>
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
            lastResults: new Array<CredentialsPreCheckResult>()
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
            <div className={"login"}>
                <label htmlFor={"username"}>Username</label>
                <input id={"username"}
                       onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                           this.setState({
                               credentials: {
                                   username: ev.currentTarget.value,
                                   password: this.state.credentials.password,
                               }
                           });
                           this.evaluate();
                       }}
                       value={this.state.credentials.username}/>
                <label htmlFor={"password"}>Password</label>
                <input id={"password"}
                       onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                           this.setState({
                               credentials: {
                                   username: this.state.credentials.username,
                                   password: ev.currentTarget.value
                               }
                           });
                           this.evaluate();
                       }}
                       value={this.state.credentials.password}
                       type={"password"}/>
                <button onClick={() => {
                    this.login();
                }}>Login
                </button>
            </div>
        );
    }

    private renderSession(): JSX.Element {
        return (
            <div className={"session"}>
                <button onClick={() => {
                    this.login();
                }}>Logout
                </button>
            </div>
        );
    }

    private evaluate(): Array<CredentialsPreCheckResult> {
        const results: Array<CredentialsPreCheckResult> = new Array<CredentialsPreCheckResult>();
        const union: <T>(x1: [], x2: []) => T[] = (x1, x2) => {
            const x3: [] = x1;
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


        return results;
    }

    private login(): void {
        this.setState({
            loggedIn: !this.state.loggedIn
        });
    }
}
