import {PageV2} from "../../components/Page";
import {AppHeader} from "../../components/AppHeader";
import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../Themeable";
import React from "react";
import {Icon} from "../../components/Icon";
import {ReactComponent as BackIcon} from "../../assets/icons/ic-20/ic20-arrow-left.svg";
import {FlexBox} from "../../components/FlexBox";
import {FlexDirection} from "../../logic/FlexDirection";
import {Justify} from "../../logic/Justify";
import {Input} from "../../components/Input";
import {percent} from "../../logic/DimensionalMeasured";
import {Text} from "../../components/Text";

export type SignupPageProps = {
    callingFrom: string
}

export type SignupPageLocalState = {
    email: string
    username: string,
    password: string,
    passwordRepeat: string
}

export class SignupPage extends BernieComponent<SignupPageProps, any, SignupPageLocalState> {

    constructor(props: SignupPageProps) {
        super(props, undefined, {
            email: "",
            username: "",
            password: "",
            passwordRepeat: ""
        });
    }

    componentRender(p: SignupPageProps, s: any, l: SignupPageLocalState, t: Themeable.Theme): JSX.Element | undefined {
        return (
            <PageV2>
                <FlexBox flexDir={FlexDirection.COLUMN} justifyContent={Justify.SPACE_BETWEEN} height={percent(100)} width={percent(100)}>
                    <AppHeader
                        left={<Icon icon={<BackIcon/>} onClick={() => this.goto(p.callingFrom)}/>}
                        title={"Signup"}
                    />
                    {this.renderLoginForm()}
                </FlexBox>
            </PageV2>
        );
    }

    private renderLoginForm(): JSX.Element {
        return (
            <FlexBox flexDir={FlexDirection.COLUMN} width={percent(100)}>
                <form style={{width: "100%"}}>
                    <Text text={"Email"}/>
                    {this._component(["email"], state =>
                        <Input
                            label={"Email"}
                            key={"email-component"}
                            onChange={ev => this.local.setState({
                                email: ev.currentTarget.value
                            })}
                        />
                    )}
                    <Text text={"Username"}/>
                    {this._component(["username"], state =>
                        <Input
                            label={"Username"}
                            key={"username-component"}
                            onChange={ev => this.local.setState({
                                username: ev.currentTarget.value
                            })}
                        />
                    )}
                    <Text text={"Password"}/>
                    {this._component(["password"], state =>
                        <Input
                            label={"Password"}
                            key={"password-component"}
                            onChange={ev => this.local.setState({
                                password: ev.currentTarget.value
                            })}
                        />
                    )}
                    <Text text={"Repeat password"}/>
                    {this._component(["repeat-password"], state =>
                        <Input
                            label={"Repeat password"}
                            key={"repeat-password-component"}
                            onChange={ev => this.local.setState({
                                passwordRepeat: ev.currentTarget.value
                            })}
                        />
                    )}
                </form>
            </FlexBox>
        );
    }
}
