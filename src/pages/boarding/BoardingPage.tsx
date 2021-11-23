import React from "react";
import {Link} from "react-router-dom";
import {ReactComponent as Logo} from "../../assets/logo.svg";
import {ReactComponent as Wave} from "../../assets/waves/wave-2.svg";
import "../../styles/pages/BoardingPage.scss";
import {Button} from "../../components/Button";
import {ComponentStyle} from "../../ComponentStyle";
import {ContinueAs} from "../../components/ContinueAs";
import {v4} from "uuid";
import {App} from "../../logic/App";
import {SessionHistoryEntry} from "../../logic/SessionHistoryEntry";

export type BoardingPageProps = {}

export type BoardingPageState = {}

export class BoardingPage extends React.Component<BoardingPageProps, BoardingPageState> {

    constructor(props: Readonly<BoardingPageProps> | BoardingPageProps) {
        super(props);
    }

    //<ContinueAs sessionHistoryEntry={{
    //                                     sessionID: v4(),
    //                                     profileData: {
    //                                         id: v4(),
    //                                         username: "root",
    //                                         firstname: "root",
    //                                         lastname: "root",
    //                                         lastActive: new Date(),
    //                                         userEntrySetupDate: new Date()
    //                                     }
    //                                 }}/>
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
                    <div className={"title"}>
                        <h1>SQL-Editor</h1>
                        <h3>Learn SQL in our interactive
                            editor and create powerful projects</h3>
                    </div>
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
                                    <Button onClick={() => {}} internalStyling={true} theme={ComponentStyle.DEFAULT}>Log in</Button>
                                </Link>
                                <span className={"separator"}>/</span>
                                {/* Sign-Up button */}
                                <Link to={"/register"}>
                                    <Button onClick={() => {}} internalStyling={true} theme={ComponentStyle.PRIMARY}>Sign up</Button>
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
