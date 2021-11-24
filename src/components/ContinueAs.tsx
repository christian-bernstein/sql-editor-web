import React from "react";
import {SessionHistoryEntry} from "../logic/SessionHistoryEntry";
import {ReactComponent as ArrowRight} from "../assets/icons/ic-20/ic20-arrow-right.svg";
import {ReactComponent as ErrorIcon} from "../assets/icons/ic-16/ic16-warning.svg";
import {Img} from "react-image";
import {BarLoader, PuffLoader} from "react-spinners";
import "../styles/components/ContinueAs.scss";
import {App} from "../logic/App";
import {Redirect} from "react-router-dom";

export type ContinueAsProps = {
    sessionHistoryEntry: SessionHistoryEntry,
    calledFromWhere?: string
}

export type ContinueAsState = {
    redirect: boolean,
    loginInProcess: boolean
    error: boolean
}

export class ContinueAs extends React.Component<ContinueAsProps, ContinueAsState> {

    constructor(props: ContinueAsProps) {
        super(props);
        this.state = {
            redirect: false,
            loginInProcess: false,
            error: false
        };
    }

    private onContinueClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!this.state.loginInProcess) {
            App.app().login({
                initialLoginProcedure: "session",
                sessionID: this.props.sessionHistoryEntry.sessionID,
                onLoginProcessStarted: () => {
                    this.setState({
                        loginInProcess: true
                    });
                },
                onLoginProcessEnded: () => {
                    this.setState({
                        loginInProcess: false
                    });
                },
                onLoginSuccess: () => {
                    this.setState({
                        redirect: true
                    });
                },
                onLoginFail: () => {
                    this.displayErrorBadge();
                }
            });
        }
    }

    private displayErrorBadge() {
        this.setState({
            // redirect: true
            error: true
        });
        setTimeout(() => {
            this.setState({
                error: false
            });
        }, 6000);
    }

    private renderContinueAs(): JSX.Element {
        return (
            <div className={"session-history-entry"} onClick={event => this.onContinueClicked(event)}>
                <div className={"name-container"}>
                    <p>Continue as {<span className={"name"}>{this.props.sessionHistoryEntry.profileData.username}</span>}</p>
                    <Img className={"avatar"}
                         alt={"avatar"}
                         src={"https://gravatar.com/avatar/" + this.props.sessionHistoryEntry.profileData.username + "?d=identicon"}
                         loader={<div className={"avatar-loader"}><PuffLoader color={"#A9E5C3"} size={"10px"}/></div>}/>
                </div>
                <div className={"icon"}>
                    {(() => {
                        if (this.state.loginInProcess) {
                            // Display loading animation
                            return <BarLoader color={"#A9E5C3"} width={"50px"}/>;
                        } else {
                            if (this.state.error) {
                                // Display error badge
                                return (
                                    <div className={"session-history-login-error"}>
                                        <ErrorIcon/>
                                        <p className={"session-history-login-error-text"}>error</p>
                                    </div>
                                );
                            } else {
                                // Display default states
                                return <ArrowRight/>;
                            }
                        }
                    })()}
                </div>
            </div>
        );
    }

    private renderRedirection(): JSX.Element {
        return (
            <Redirect to={this.props.calledFromWhere === undefined ? "/dashboard" : this.props.calledFromWhere}/>
        );
    }

    render() {
        if (this.state.redirect) {
            return this.renderRedirection();
        } else {
            return this.renderContinueAs();
        }
    }
}
