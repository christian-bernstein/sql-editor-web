import React from "react";
import {Link} from "react-router-dom";
import {ReactComponent as Logo} from "../assets/logo.svg";
import {ReactComponent as Wave} from "../assets/waves/wave-2.svg";
import "../styles/pages/BoardingPage.scss";
import {Button} from "../components/Button";

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
                            <h3 className={"page-name"}>Onboarding</h3>
                        </div>
                    </div>
                    <div className={"title"}>
                        <h1>SQL-Editor</h1>
                        <h3>Learn SQL in our interactive
                            editor and create powerful projects</h3>
                    </div>
                    <div className={"boarding"}>
                        <form className={"boarding-form"}>
                            {/* Continue as button */}
                            <div className={"boarding-type"}>
                                {/* boarding button */}
                                <Link to={"/login"}>
                                    <Button onClick={() => {}}>Login</Button>
                                </Link>
                                <span className={"separator"}>/</span>
                                <Link to={"/register"}>
                                    <Button onClick={() => {}}>Sign Up</Button>
                                </Link>
                                {/* Sign-In button */}
                            </div>
                        </form>
                    </div>
                </div>
                <div className={"boarding-page-background"}>
                    <Wave/>
                </div>
            </div>
        );
    }
}
