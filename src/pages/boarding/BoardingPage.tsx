import React from "react";
import {Link} from "react-router-dom";
import {ReactComponent as Logo} from "../../assets/retired_logo_v2.svg";
import {ReactComponent as AppLogo} from "../../assets/logo.svg";
import "../../styles/pages/BoardingPage.scss";
import {_Button} from "../../components/_Button";
import {ComponentStyle} from "../../ComponentStyle";
import {ContinueAs} from "../../components/ContinueAs";
import {App} from "../../logic/App";
import {SessionHistoryEntry} from "../../logic/SessionHistoryEntry";
import {FlexDirection} from "../../logic/FlexDirection";
import {Align} from "../../logic/Align";
import {Text, TextType} from "../../components/Text";
import {FlexBox} from "../../components/FlexBox";

export type BoardingPageProps = {
}

export type BoardingPageState = {
}

export class BoardingPage extends React.Component<BoardingPageProps, BoardingPageState> {

    constructor(props: Readonly<BoardingPageProps> | BoardingPageProps) {
        super(props);
        App.app().removeInvalidSessionHistoryEntries();
        // After ton socket has connected, the cached sessions might/will change
        // server-wise and need to be reloaded on the client.
        App.app().registerAction("connection-established", () => {
            App.app().removeInvalidSessionHistoryEntries(() => {
                // After validation result sent by the server and recalculated on the client
                // rerender the boarding page.
                this.forceUpdate();
            });
        })
    }

    render() {
        return (
            <div className={"boarding-page"}>
                <div className={"boarding-page-foreground"}>
                    <div className={"header"}>
                        <div className={"header-container"}>
                            <div className={"logo-space"}>
                                <Logo/>
                            </div>
                            <h3 className={"page-name"}>Boarding</h3>
                        </div>
                    </div>

                    <FlexBox flexDir={FlexDirection.COLUMN} align={Align.CENTER}>
                        <AppLogo/>
                        <Text text={"SQL-Editor"} type={TextType.largeHeader}/>
                        <Text text={"Learn SQL in our interactive\neditor and create powerful projects"}
                              type={TextType.secondaryDescription}
                              align={Align.CENTER}
                        />
                    </FlexBox>
                    <div className={"boarding"}>
                        <form className={"boarding-form"}>
                            <ol className={"continue-as-list"}>
                                {
                                    App.app().getSessionHistoryEntries().map((entry: SessionHistoryEntry) => <ContinueAs sessionHistoryEntry={{
                                        sessionID: entry.sessionID,
                                        profileData: entry.profileData
                                    }}/>)
                                }
                            </ol>
                            {/* Continue as button */}

                            <div className={"boarding-type"}>
                                {/* boarding button */}
                                <Link to={"/login"}>
                                    <_Button onClick={() => {}} internalStyling={true} theme={ComponentStyle.DEFAULT}>Log in</_Button>
                                </Link>
                                <span className={"separator"}>/</span>
                                {/* Sign-Up button */}
                                <Link to={"/register"}>
                                    <_Button onClick={() => {}} internalStyling={true} theme={ComponentStyle.PRIMARY}>Sign up</_Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={"boarding-page-background"}>
                    {/*<Wave/>*/}
                </div>
            </div>
        );
    }
}
