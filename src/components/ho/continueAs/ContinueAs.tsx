import React from "react";
import {SessionHistoryEntry} from "../../../logic/misc/SessionHistoryEntry";
import {ReactComponent as ArrowRight} from "../../../assets/icons/ic-20/ic20-arrow-right.svg";
import {BarLoader} from "react-spinners";
import "../../../styles/components/ContinueAs.scss";
import {App, utilizeGlobalTheme} from "../../../logic/app/App";
import {Redirect} from "react-router-dom";
import {SimpleErrorBadge} from "../../deprecated/SimpleErrorBadge";
import {Text} from "../../lo/Text";
import {FlexBox} from "../../lo/FlexBox";
import {FlexDirection} from "../../../logic/style/FlexDirection";
import {Icon} from "../../lo/Icon";
import {ObjectVisualMeaning} from "../../../logic/style/ObjectVisualMeaning";

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
            <div className={"session-history-entry"} style={{
                backgroundColor: theme.colors.backgroundHighlightColor.css()
            }} onClick={event => this.onContinueClicked(event)}>
                <FlexBox flexDir={FlexDirection.ROW} gap={theme.gaps.smallGab}>
                    <Text text={"Continue as"}/>
                    {/*<ClientDisplay enableClientBadge={false} />*/}
                    <Text text={this.props.sessionHistoryEntry.profileData.username}/>
                </FlexBox>

                <div className={"icon"}>
                    {(() => {
                        if (this.state.loginInProcess) {
                            // Display loading animation
                            // return <BarLoader color={"#A9E5C3"} width={"50px"}/>;
                            return <BarLoader color={theme.colors.primaryHighlightColor.css()} width={"50px"}/>;
                        } else {
                            if (this.state.error) {
                                // Display error badge
                                return (
                                    <SimpleErrorBadge/>
                                );
                            } else {
                                // Display default states
                                return (
                                    <Icon icon={<ArrowRight/>} colored visualMeaning={ObjectVisualMeaning.INFO}/>
                                );
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
