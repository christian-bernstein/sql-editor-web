import React from "react";
import {SessionHistoryEntry} from "../logic/SessionHistoryEntry";
import {ReactComponent as ArrowRight} from "../assets/icons/ic-20/ic20-arrow-right.svg";
import {BarLoader} from "react-spinners";
import "../styles/components/ContinueAs.scss";
import {App, utilizeGlobalTheme} from "../logic/App";
import {Redirect} from "react-router-dom";
import {SimpleErrorBadge} from "./SimpleErrorBadge";
import {ClientDisplay} from "./ClientDisplay";
import {Text} from "./Text";
import {FlexBox} from "./FlexBox";
import {FlexDirection} from "../logic/style/FlexDirection";

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
        const theme = utilizeGlobalTheme();

        return (
            <div className={"session-history-entry"} onClick={event => this.onContinueClicked(event)}>
                <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                    <Text text={"Continue as"}/>
                    {/*<ClientDisplay enableClientBadge={false} />*/}
                    <Text text={this.props.sessionHistoryEntry.profileData.username}/>
                </FlexBox>

                <div className={"icon"}>
                    {(() => {
                        if (this.state.loginInProcess) {
                            // Display loading animation
                            return <BarLoader color={"#A9E5C3"} width={"50px"}/>;
                        } else {
                            if (this.state.error) {
                                // Display error badge
                                return (
                                    <SimpleErrorBadge/>
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
