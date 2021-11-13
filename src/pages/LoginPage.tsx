import React from "react";
import {ReactComponent as Logo} from "../assets/logo.svg";
import {ReactComponent as Wave} from "../assets/waves/wave-2.svg";
import "../styles/pages/LoginPage.scss";

export type LoginPageProps = {}

export type LoginPageState = {}

export class LoginPage extends React.Component<LoginPageProps, LoginPageState> {

    constructor(props: Readonly<LoginPageProps> | LoginPageProps) {
        super(props);

    }

    render() {
        return (
            <div className={"login-page"}>
                <div className={"login-page-foreground"}>
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
                    <div className={"login"}>
                        <form className={"login-form"}>
                            {/* Continue as button */}
                            <div className={"login-type"}>
                                {/* Login button */}
                                <span className={"separator"}>/</span>
                                {/* Sign-In button */}
                            </div>
                        </form>
                    </div>
                </div>
                <div className={"login-page-background"}>
                    <Wave/>
                </div>
            </div>
        );
    }
}
