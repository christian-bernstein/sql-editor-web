import React from "react";
import {Link} from "react-router-dom";
import {ReactComponent as Logo} from "../assets/logo.svg";
import {ReactComponent as Wave} from "../assets/waves/wave-2.svg";
import "../styles/pages/BoardingPage.scss";
import {Button} from "../components/Button";
import {ComponentStyle} from "../ComponentStyle";
import {ContinueAs} from "../components/ContinueAs";
import {v4} from "uuid";

export type BoardingPageProps = {}

export type BoardingPageState = {}

export class BoardingPage extends React.Component<BoardingPageProps, BoardingPageState> {

    constructor(props: Readonly<BoardingPageProps> | BoardingPageProps) {
        super(props);
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
                    <div className={"title"}>
                        <h1>SQL-Editor</h1>
                        <h3>Learn SQL in our interactive
                            editor and create powerful projects</h3>
                    </div>
                    <div className={"boarding"}>
                        <form className={"boarding-form"}>

                            <ol className={"continue-as-list"}>
                                <ContinueAs sessionHistoryEntry={{
                                    sessionID: v4(),
                                    userDisplayName: "root",
                                    userAvatarURL: "https://deelay.me/2000/https://gravatar.com/avatar/root?s=400&d=identicon&r=x"
                                }}/>
                                <ContinueAs sessionHistoryEntry={{
                                    sessionID: v4(),
                                    userDisplayName: "Christian Bernstein",
                                    userAvatarURL: "https://deelay.me/1000/https://gravatar.com/avatar/6b34fe24ac2ff8103f6fce1f0da2ef57?s=400&d=identicon&r=x"
                                }}/>
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
