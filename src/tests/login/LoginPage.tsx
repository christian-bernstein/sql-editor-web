import "./LoginPage.scss";
import React, {ChangeEvent} from "react";
import {Credentials} from "./Credentials";
import {CredentialsPreCheckResult} from "./CredentialsPreCheckResult";
import {ICredentialsPreChecker} from "./ICredentialsPreChecker";
import {Environment} from "../../logic/Environment";
import {Utils} from "../../logic/Utils";
import {CredentialsLoginResponsePacketData} from "./CredentialsLoginResponsePacketData";
import {CredentialsCheckResultType} from "./CredentialsCheckResultType";
import ReactJson from 'react-json-view';

export type LoginPageProps = {}

export type LoginPageState = {
    sessionID?: string,
    credentials: Credentials,
    loggedIn: boolean,
    currentCredentialsCheckResults: Array<CredentialsPreCheckResult>,
    sufficientCredentialsToLogin: boolean,
    connector: Environment.Connector,
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
            sufficientCredentialsToLogin: false,
            connector: this.getConnector()
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
                this.state.connector.call({
                    protocol: "login",
                    packetID: "CredentialsLoginPacketData",
                    data: this.state.credentials,
                    callback: {
                        handle: (connector, packet) => loginResponseCallback(packet.data as object as CredentialsLoginResponsePacketData)
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
                            loggedIn: true,
                            sessionID: data.newSessionID
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

        // todo call server
        if (this.state.loggedIn) {
            this.setState({
                loggedIn: false,
                // todo set to undefined
                sessionID: undefined
            });
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
                    }}>Login
                </button>
            </form>

        );
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

    // codeschool
    // google
    // ashes
    // grayscale
    // ocean
    render() {
        return (
            <>
                <div className={"state-display"}>
                    <ReactJson src={this.state} theme={"grayscale"} displayDataTypes={false} enableClipboard={false} collapsed={true}/>
                </div>

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
}
