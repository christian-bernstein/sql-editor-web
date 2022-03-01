import "../../styles/pages/LoginPage.scss";
import React, {ChangeEvent} from "react";
import {Credentials} from "./Credentials";
import {CredentialsPreCheckResult} from "./CredentialsPreCheckResult";
import {ICredentialsPreChecker} from "./ICredentialsPreChecker";
import {ReactComponent as BackIcon} from "../../assets/icons/ic-20/ic20-arrow-left.svg";
import {ReactComponent as AppLogo} from "../../assets/logo.svg";
import {Redirect} from "react-router-dom";
import {BarLoader} from "react-spinners";
import {css} from "@emotion/react";
import {App} from "../../logic/App";
import {Input} from "../../components/Input";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/style/FlexDirection";
import {Align} from "../../logic/Align";
import {Text, TextType} from "../../components/Text";
import {Justify} from "../../logic/style/Justify";
import {ServerConnectionIcon} from "../../components/ServerConnectionIcon";
import {Icon} from "../../components/Icon";

export type LoginPageProps = {
    calledFromWhere?: string
}

export type LoginPageState = {
    sessionID?: string,
    credentials: Credentials,
    loginInProcess: boolean,
    currentCredentialsCheckResults: Array<CredentialsPreCheckResult>,
    sufficientCredentialsToLogin: boolean,
    redirect: boolean,
    redirectLocation?: string
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
            redirect: false,
            redirectLocation: undefined
        };
    }

    private clickReturnToBoarding() {
        this.setState({
            redirect: true,
            redirectLocation: "/boarding"
        });
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

            App.app().login({
                initialLoginProcedure: "credentials",
                credentials: this.state.credentials,
                onLoginProcessStarted: () => {
                    console.log("log in process started")
                    this.setState({
                        loginInProcess: true
                    });
                },
                onLoginProcessEnded: () => {
                    console.log("log in process ended")
                    if (!this.state.redirect) {
                        this.setState({
                            loginInProcess: false
                        });
                    }
                },
                onLoginSuccess: () => {
                    this.setState({
                        redirect: true,
                        redirectLocation: "/dashboard"
                    });
                },
                onLoginFail: () => {
                    console.log("login failed!!")
                }
            });
        }
    }

    private renderRedirect(): JSX.Element {
        let location = undefined;
        if (this.props.calledFromWhere !== undefined) {
            location = this.props.calledFromWhere as string;
        } else if (this.state.redirectLocation !== undefined) {
            location = this.state.redirectLocation as string;
        }
        if (location === undefined) {
            return <></>;
        } else return <Redirect to={location as string}/>;
    }

    // <ObjectJSONDisplay object={App.app().config.connectorConfig}/>
    private renderLogin(): JSX.Element {
        return (
            <div className={"login-page"}>
                <div className={"login-page-foreground"}>
                    <div className={"l-p-f-header"}>
                        <FlexBox flexDir={FlexDirection.ROW} align={Align.CENTER}>
                            <Icon icon={<BackIcon/>} onClick={() => this.clickReturnToBoarding()}/>
                        </FlexBox>
                        <h3 className={"page-name"}>Login</h3>
                        <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.FLEX_END}>
                            <ServerConnectionIcon/>
                        </FlexBox>
                    </div>

                    <FlexBox flexDir={FlexDirection.COLUMN} align={Align.CENTER}>
                        <AppLogo/>
                        <Text text={"SQL-Editor"} type={TextType.largeHeader}/>
                        <Text text={"Learn SQL in our interactive\neditor and create your projects"}
                              type={TextType.secondaryDescription}
                              align={Align.CENTER}
                        />
                    </FlexBox>

                    <form className={"login"}>
                        <FlexBox flexDir={FlexDirection.ROW} justifyContent={Justify.SPACE_BETWEEN}>
                            <Text text={"Not a member? [Sign up now](/register/)"}/>
                            <Text text={"[Forgot password](/password-reset/)"}/>
                        </FlexBox>
                        <Input label={"Username"}
                               opaque
                               autoFocus
                               key={"username-input"}
                               onChange={(ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                   this.updateCredentials("user", ev.currentTarget.value);
                               }}
                        />

                        <Input label={"Password"}
                               opaque
                               type={"password"}
                               key={"password-input"}
                               onChange={(ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                   this.updateCredentials("pass", ev.currentTarget.value);
                               }}
                        />
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
                </div>
            </div>
        );
    }

    render() {
        // After completing the login, the user should automatically be redirected to another page.
        // The login page should only be a small prompt, so afterwards, the user should return to the page,
        // thy originated from.
        if (this.state.redirect) {
            return this.renderRedirect();
        }
        // Display the default login form
        // <div className={"state-display"}>
        //     <ReactJson src={this.state} theme={"grayscale"} displayDataTypes={false} enableClipboard={false} collapsed={true}/>
        // </div>
        return (
            this.renderLogin()
        );
    }
}
