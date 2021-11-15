import "./LoginPage.scss";
import React, {ChangeEvent} from "react";
import {Credentials} from "./Credentials";
import {CredentialsPreCheckResult} from "./CredentialsPreCheckResult";
import {ICredentialsPreChecker} from "./ICredentialsPreChecker";
import {Environment} from "../../logic/Environment";
import {CredentialsLoginResponsePacketData} from "./CredentialsLoginResponsePacketData";
import {CredentialsCheckResultType} from "./CredentialsCheckResultType";
import ReactJson from 'react-json-view';
import {Redirect} from "react-router-dom";
import {BarLoader, BounceLoader, ClipLoader} from "react-spinners";
import {css} from "@emotion/react";

export type LoginPageProps = {
    calledFromWhere?: string
}

export type LoginPageState = {
    sessionID?: string,
    credentials: Credentials,
    loginInProcess: boolean,
    currentCredentialsCheckResults: Array<CredentialsPreCheckResult>,
    sufficientCredentialsToLogin: boolean,
    connector: Environment.Connector,
    redirect: boolean
}

export class LoginPage extends React.Component<LoginPageProps, LoginPageState> {

    constructor(props: LoginPageProps) {
        super(props);
        this.state = {
            credentials: {
                username: "",
                password: ""
            },
            loginInProcess: false,
            currentCredentialsCheckResults: new Array<CredentialsPreCheckResult>(),
            sufficientCredentialsToLogin: false,
            connector: this.getConnector(),
            redirect: false
        };
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

    private getConnector(): Environment.Connector {
        return Environment.Connector.useConnector("login", () => new Environment.Connector({
            protocol: "login",
            address: "ws:192.168.2.102:80",
            id: "login",
            maxConnectAttempts: 50,
            connectionRetryDelayFunc: (i => 0.1 * (i) ** 2 * 1e3 - 10 * 1e3),
            packetInterceptor: () => {}
        })).connect();
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
            const credentialsLoginProcedure = (loginResponseCallback: (data: CredentialsLoginResponsePacketData) => void) => {
                this.setState({
                    loginInProcess: true
                });
                this.state.connector.call({
                    protocol: "login",
                    packetID: "CredentialsLoginPacketData",
                    data: this.state.credentials,
                    callback: {
                        handle: (connector, packet) => {
                            this.setState({
                                loginInProcess: false
                            });
                            loginResponseCallback(packet.data as object as CredentialsLoginResponsePacketData)
                        }
                    }
                });
            }

            if (this.state.sessionID === undefined) {
                // No session state available to try session login, need credentials login procedure
                credentialsLoginProcedure(data => {
                    console.log(data)
                    if (data.type === CredentialsCheckResultType.OK) {
                        // Set user login state to 'logged in'
                        this.setState({
                            sessionID: data.newSessionID,
                            redirect: true
                        });
                    } else if (data.type === CredentialsCheckResultType.UNKNOWN_USERNAME) {
                        // The provided credentials were wrong, highlight the input fields
                        // The username doesn't correlate to an account stored on the current server instance


                    } else if (data.type === CredentialsCheckResultType.INCORRECT_PASSWORD) {
                        // The provided credentials were wrong, highlight the input fields
                        // The password doesn't correlate to the password stored on the current server instance


                    }
                });
            } else {
                // Try to login via sessionID

            }
        }
    }

    private renderLogin(): JSX.Element {
        return (
            <form className={"login"}>
                <label htmlFor={"username"}>Username</label>
                <input id={"username"}
                       type={"username"}
                       autoComplete={"current-username"}
                       onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                           this.updateCredentials("user", ev.currentTarget.value);
                       }}
                       value={this.state.credentials.username}/>
                <label htmlFor={"password"}>Password</label>
                <input id={"password"}
                       type={"password"}
                       autoComplete={"current-password"}
                       onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                           this.updateCredentials("pass", ev.currentTarget.value);
                       }}
                       value={this.state.credentials.password}/>
                <button
                    className={["login-btn", this.state.sufficientCredentialsToLogin ? "active" : "inactive"].join(" ")}
                    onClick={(ev) => {
                        ev.preventDefault();
                        this.login();
                    }}
                >
                    {
                        (() => {
                            if (this.state.loginInProcess) {
                                const override = css`
                                  display: block;
                                  margin: 0 auto;
                                `;
                                return <BarLoader color={"white"} css={override} loading={true} />
                            } else {
                                return "Login";
                            }
                        })()
                    }
                </button>
            </form>

        );
    }

    render() {
        // After completing the login, the user should automatically be  redirected to another page.
        // The login page should only be a small prompt, so afterwards, the user should return to the page,
        // thy originated from.
        if (this.state.redirect) {
            const location = this.props.calledFromWhere === undefined ? "/dashboard" : this.props.calledFromWhere;
            return <Redirect push to={location}/>
        }
        // Display the default login form
        return (
            <div className={"login-page"}>
                <div className={"state-display"}>
                    <ReactJson src={this.state} theme={"grayscale"} displayDataTypes={false} enableClipboard={false} collapsed={true}/>
                </div>
                {
                    this.renderLogin()
                }
            </div>
        );
    }
}
